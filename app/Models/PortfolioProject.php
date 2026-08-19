<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PortfolioProject extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'slug', 'name_ar', 'name_en', 'category_ar', 'category_en',
        'description_ar', 'description_en', 'challenge_ar', 'challenge_en',
        'strategy_ar', 'strategy_en', 'results', 'image_url', 'thumbnail_url',
        'alt_text_ar', 'alt_text_en', 'sort_order', 'is_published',
    ];

    protected function casts(): array
    {
        return [
            'results' => 'array',
            'sort_order' => 'integer',
            'is_published' => 'boolean',
        ];
    }

    public function scopePublished($query)
    {
        return $query->where('is_published', true)->orderBy('sort_order')->orderBy('id');
    }
}
