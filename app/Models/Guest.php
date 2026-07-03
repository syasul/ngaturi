<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Guest extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'wedding_id',
        'name',
        'phone',
        'unique_token',
        'rsvp_status',
        'message',
        'is_message_visible',
    ];

    protected $casts = [
        'is_message_visible' => 'boolean',
    ];

    public function wedding()
    {
        return $this->belongsTo(Wedding::class);
    }
}
