<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContentBlock extends Model
{
    protected $fillable = [
        'key', 'locale', 'title', 'body', 'data', 'is_published',
    ];

    protected function casts(): array
    {
        return [
            'data' => 'array',
            'is_published' => 'boolean',
        ];
    }
}
