<?php

namespace App\Mail;

use App\Models\Lead;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class LeadWelcomeAcknowledgement extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Lead $lead)
    {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->lead->locale === 'en' ? 'We received your growth brief | Wajd' : 'وصلتنا تفاصيل مشروعك | وجد',
        );
    }

    public function content(): Content
    {
        return new Content(view: 'emails/lead-welcome');
    }

    public function attachments(): array
    {
        return [];
    }
}
