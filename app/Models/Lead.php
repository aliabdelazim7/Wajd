<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Lead extends Model
{
    public const STATUS_NEW = 'new';
    public const STATUS_CONTACTED = 'contacted';
    public const STATUS_QUALIFIED = 'qualified';
    public const STATUS_CLOSED = 'closed';
    public const STATUS_LOST = 'lost';

    public const STATUSES = [
        self::STATUS_NEW,
        self::STATUS_CONTACTED,
        self::STATUS_QUALIFIED,
        self::STATUS_CLOSED,
        self::STATUS_LOST,
    ];

    protected $fillable = [
        'name', 'company_name', 'email', 'phone', 'page_url', 'service', 'industry',
        'contact_preference', 'budget_sar', 'package_selection', 'message', 'locale', 'source', 'status',
        'nurture_stage', 'nurture_last_sent_at', 'nurture_next_at', 'portal_status', 'portal_invited_at',
        'ip_address', 'user_agent', 'consent_at',
    ];

    protected $hidden = [
        'ip_address', 'user_agent',
    ];

    protected function casts(): array
    {
        return [
            'budget_sar' => 'integer',
            'package_selection' => 'array',
            'nurture_last_sent_at' => 'datetime',
            'nurture_next_at' => 'datetime',
            'portal_invited_at' => 'datetime',
            'consent_at' => 'datetime',
        ];
    }

    public function scopeRecent($query)
    {
        return $query->latest('created_at');
    }

    public function nurtureEvents(): HasMany
    {
        return $this->hasMany(LeadNurtureEvent::class);
    }
}
