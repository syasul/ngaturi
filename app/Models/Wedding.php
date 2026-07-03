<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Wedding extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'user_id',
        'theme_id',
        'slug',
        'status',
        'data',
        'expired_at',
        'expiration_warning_sent_at',
    ];

    protected $casts = [
        'data' => 'array',
        'expired_at' => 'datetime',
        'expiration_warning_sent_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function theme()
    {
        return $this->belongsTo(Theme::class);
    }

    public function guests()
    {
        return $this->hasMany(Guest::class);
    }

    public function photos()
    {
        return $this->hasMany(Photo::class);
    }
}
