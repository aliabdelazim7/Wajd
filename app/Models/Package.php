<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Package extends Model
{
    protected $fillable = [
        'slug', 'category', 'name_ar', 'name_en', 'subtitle_ar', 'subtitle_en', 'price_sar',
        'price_one_time_sar', 'compare_at_price_sar', 'billing_cycle', 'cta_label_ar', 'cta_label_en',
        'features_ar', 'features_en', 'metadata', 'sort_order', 'is_featured', 'is_published',
    ];

    protected function casts(): array
    {
        return [
            'price_sar' => 'integer',
            'price_one_time_sar' => 'integer',
            'compare_at_price_sar' => 'integer',
            'features_ar' => 'array',
            'features_en' => 'array',
            'metadata' => 'array',
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
