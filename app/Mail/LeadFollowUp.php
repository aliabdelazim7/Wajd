<?php

namespace App\Mail;

use App\Models\Lead;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class LeadFollowUp extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Lead $lead)
    {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->lead->locale === 'en' ? 'A practical next step for your project | Wajd' : 'خطوة عملية تالية لمشروعك | وجد',
        );
    }

    public function content(): Content
    {
        return new Content(view: 'emails/lead-follow-up');
    }

    public function attachments(): array
    {
        return [];
    }
}
