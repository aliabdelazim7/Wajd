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
        'strategy_ar', 'strategy_en', 'metric_ar', 'metric_en', 'outcome_ar', 'outcome_en',
        'evidence_note_ar', 'evidence_note_en', 'period_ar', 'period_en', 'results', 'results_ar', 'results_en',
        'image_url', 'thumbnail_url', 'gallery', 'metadata', 'alt_text_ar', 'alt_text_en',
        'sort_order', 'is_published',
    ];

    protected function casts(): array
    {
        return [
            'results' => 'array',
            'results_ar' => 'array',
            'results_en' => 'array',
            'gallery' => 'array',
            'metadata' => 'array',
            'sort_order' => 'integer',
            'is_published' => 'boolean',
        ];
    }

    public function scopePublished($query)
    {
        return $query->where('is_published', true)->orderBy('sort_order')->orderBy('id');
    }
}
