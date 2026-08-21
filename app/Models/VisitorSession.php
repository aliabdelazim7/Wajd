<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class VisitorSession extends Model
{
    protected $fillable = [
        'session_token',
        'visitor_id',
        'ip_address',
        'user_agent',
        'locale',
        'duration_seconds',
        'page_count',
        'intent_score',
        'metadata',
        'started_at',
        'last_active_at',
    ];

    protected $casts = [
        'metadata' => 'array',
        'started_at' => 'datetime',
        'last_active_at' => 'datetime',
        'duration_seconds' => 'integer',
        'page_count' => 'integer',
        'intent_score' => 'integer',
    ];

    public function events(): HasMany
    {
        return $this->hasMany(VisitorEvent::class);
    }
}
