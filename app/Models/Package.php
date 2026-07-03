<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Package extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'name',
        'price',
        'features',
        'max_guests',
        'duration_days',
    ];

    protected $casts = [
        'features' => 'array',
    ];
}
