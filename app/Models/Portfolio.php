<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Portfolio extends Model
{
    protected $table = 'portfolio';
    protected $guarded = [];
    public $timestamps = false;

    protected $casts = [
        'results_json' => 'array',
    ];
}
