<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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
        'name', 'email', 'phone', 'page_url', 'service', 'budget_sar', 'message',
        'locale', 'source', 'status', 'ip_address', 'user_agent', 'consent_at',
    ];

    protected $hidden = [
        'ip_address', 'user_agent',
    ];

    protected function casts(): array
    {
        return [
            'budget_sar' => 'integer',
            'consent_at' => 'datetime',
        ];
    }

    public function scopeRecent($query)
    {
        return $query->latest('created_at');
    }
}
