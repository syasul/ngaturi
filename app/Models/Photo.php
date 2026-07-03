<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Photo extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'wedding_id',
        'url',
        'order',
        'type',
    ];

    public function wedding()
    {
        return $this->belongsTo(Wedding::class);
    }
}
