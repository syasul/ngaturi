<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Theme extends Model
{
    use HasFactory;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'name',
        'thumbnail_url',
        'is_active',
        'package_level',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function weddings()
    {
        return $this->hasMany(Wedding::class);
    }
}
