<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PreauthorizedAdmin extends Model
{
    protected $table = 'preauthorized_admins';
    protected $guarded = [];
    public $timestamps = false;
}
