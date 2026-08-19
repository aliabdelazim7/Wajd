<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Package extends Model
{
    protected $fillable = [
        'slug', 'name_ar', 'name_en', 'subtitle_ar', 'subtitle_en', 'price_sar',
        'billing_cycle', 'features_ar', 'features_en', 'sort_order', 'is_featured', 'is_published',
    ];

    protected function casts(): array
    {
        return [
            'price_sar' => 'integer',
            'features_ar' => 'array',
            'features_en' => 'array',
            'sort_order' => 'integer',
            'is_featured' => 'boolean',
            'is_published' => 'boolean',
        ];
    }

    public function scopePublished($query)
    {
        return $query->where('is_published', true)->orderBy('sort_order')->orderBy('id');
    }
}
