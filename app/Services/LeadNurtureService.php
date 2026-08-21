<?php

namespace App\Services;

use App\Mail\LeadFollowUp;
use App\Mail\LeadWelcomeAcknowledgement;
use App\Models\Lead;
use App\Models\LeadNurtureEvent;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class LeadNurtureService
{
    public function sendWelcome(Lead $lead): bool
    {
        $sent = false;

        if (config('services.nurture.email_enabled') && config('mail.default') !== 'log') {
            try {
                Mail::to($lead->email)->send(new LeadWelcomeAcknowledgement($lead));
                $this->record($lead, 'email', 'welcome', 'sent');
                $sent = true;
            } catch (\Throwable $exception) {
                $this->record($lead, 'email', 'welcome', 'failed', ['error' => $exception->getMessage()]);
                Log::error('Lead welcome email failed', ['lead_id' => $lead->id, 'exception' => $exception::class]);
            }
        }

        $this->sendWhatsAppTemplate($lead, 'welcome');
        $lead->forceFill([
            'nurture_stage' => $sent ? 'welcome_sent' : 'welcome_pending',
            'nurture_last_sent_at' => $sent ? now() : null,
            'nurture_next_at' => $sent ? now()->addDays(config('services.nurture.follow_up_after_days', 2)) : null,
        ])->save();

        return $sent;
    }

    public function sendDueFollowUp(Lead $lead): bool
    {
        if (!in_array($lead->status, [Lead::STATUS_NEW, Lead::STATUS_CONTACTED], true)) {
            return false;
        }

        if (!$lead->nurture_next_at || $lead->nurture_next_at->isFuture()) {
            return false;
        }

        $sent = false;
        if (config('services.nurture.email_enabled') && config('mail.default') !== 'log') {
            try {
                Mail::to($lead->email)->send(new LeadFollowUp($lead));
                $this->record($lead, 'email', 'follow_up_1', 'sent');
                $sent = true;
            } catch (\Throwable $exception) {
                $this->record($lead, 'email', 'follow_up_1', 'failed', ['error' => $exception->getMessage()]);
                Log::error('Lead follow-up email failed', ['lead_id' => $lead->id, 'exception' => $exception::class]);
            }
        }

        $this->sendWhatsAppTemplate($lead, 'follow_up_1');
        $lead->forceFill([
            'nurture_stage' => $sent ? 'follow_up_sent' : 'follow_up_pending',
            'nurture_last_sent_at' => $sent ? now() : $lead->nurture_last_sent_at,
            'nurture_next_at' => null,
        ])->save();

        return $sent;
    }

    private function sendWhatsAppTemplate(Lead $lead, string $step): void
    {
        $accessToken = config('services.whatsapp.access_token');
        $phoneNumberId = config('services.whatsapp.phone_number_id');
        $template = config("services.whatsapp.templates.{$step}");

        if (!$accessToken || !$phoneNumberId || !$template || $lead->contact_preference !== 'whatsapp' || !$lead->phone) {
            return;
        }

        $phone = preg_replace('/[^0-9]/', '', $lead->phone);
        $version = config('services.whatsapp.graph_version', 'v22.0');
        $language = $lead->locale === 'en' ? 'en_US' : 'ar';

        try {
            $response = Http::withToken($accessToken)
                ->acceptJson()
                ->timeout(8)
                ->post("https://graph.facebook.com/{$version}/{$phoneNumberId}/messages", [
                    'messaging_product' => 'whatsapp',
                    'to' => $phone,
                    'type' => 'template',
                    'template' => [
                        'name' => $template,
                        'language' => ['code' => $language],
                        'components' => [
                            [
                                'type' => 'body',
                                'parameters' => [
                                    ['type' => 'text', 'text' => $lead->name],
                                ],
                            ],
                        ],
                    ],
                ]);

            if (!$response->successful() || !$response->json('messages.0.id')) {
                throw new \RuntimeException('WhatsApp API rejected the template message.');
            }

            $this->record($lead, 'whatsapp', $step, 'sent', [], $response->json('messages.0.id'));
        } catch (\Throwable $exception) {
            $this->record($lead, 'whatsapp', $step, 'failed', ['error' => $exception->getMessage()]);
            Log::error('Lead WhatsApp nurture failed', ['lead_id' => $lead->id, 'step' => $step, 'exception' => $exception::class]);
        }
    }

    private function record(Lead $lead, string $channel, string $step, string $status, array $payload = [], ?string $messageId = null): void
    {
        LeadNurtureEvent::create([
            'lead_id' => $lead->id,
            'channel' => $channel,
            'step' => $step,
            'status' => $status,
            'provider_message_id' => $messageId,
            'payload' => $payload,
            'sent_at' => $status === 'sent' ? now() : null,
        ]);
    }
}
