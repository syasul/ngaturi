<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;

class Theme extends Model
{
    use HasFactory;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'code',
        'name',
        'thumbnail_url',
        'is_active',
        'package_level',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    protected $appends = [
        'tier_code',
        'demo_url',
    ];

    protected static function booted()
    {
        static::creating(function ($theme) {
            if (empty($theme->code)) {
                $theme->code = static::generateUniqueCode();
            }
        });
    }

    public static function generateUniqueCode(int $length = 6): string
    {
        do {
            $code = strtolower(Str::random($length));
        } while (static::where('code', $code)->exists());

        return $code;
    }

    public function getTierCodeAttribute(): string
    {
        return match (strtoupper($this->package_level ?? 'BASIC')) {
            'BASIC' => 'b',
            'PREMIUM' => 'p',
            'CUSTOM' => 'c',
            default => 'b',
        };
    }

    public function getDemoUrlAttribute(): string
    {
        $domain = 'ngaturi.inxdvi.com';
        $code = $this->code ?: $this->id;
        return "https://{$domain}/demo/{$this->tier_code}/{$code}";
    }

    public function weddings()
    {
        return $this->hasMany(Wedding::class);
    }
}
