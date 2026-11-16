<?php

use Illuminate\Database\Migrations\Migration;
use App\Models\Theme;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $newThemes = [
            [
                'id' => 'basic-11',
                'name' => 'Midnight Navy',
                'code' => 'b11n9x',
                'thumbnail_url' => '/assets/wedding/couple-royal.png',
                'package_level' => 'BASIC',
                'is_active' => true,
            ],
            [
                'id' => 'basic-12',
                'name' => 'Champagne Luxe',
                'code' => 'b12c4v',
                'thumbnail_url' => '/assets/wedding/couple-royal.png',
                'package_level' => 'BASIC',
                'is_active' => true,
            ],
            [
                'id' => 'basic-13',
                'name' => 'Crimson Velvet',
                'code' => 'b13r8m',
                'thumbnail_url' => '/assets/wedding/hero-floral.png',
                'package_level' => 'BASIC',
                'is_active' => true,
            ],
            [
                'id' => 'basic-14',
                'name' => 'Nordic Pine',
                'code' => 'b14p7k',
                'thumbnail_url' => '/assets/wedding/couple-foliage.png',
                'package_level' => 'BASIC',
                'is_active' => true,
            ],
            [
                'id' => 'basic-15',
                'name' => 'Ethereal Sky',
                'code' => 'b15e2w',
                'thumbnail_url' => '/assets/wedding/couple-foliage.png',
                'package_level' => 'BASIC',
                'is_active' => true,
            ],
            [
                'id' => 'basic-16',
                'name' => 'Warm Amber',
                'code' => 'b16a5z',
                'thumbnail_url' => '/assets/wedding/couple-rustic.png',
                'package_level' => 'BASIC',
                'is_active' => true,
            ],
            [
                'id' => 'basic-17',
                'name' => 'Lilac Dream',
                'code' => 'b17l3d',
                'thumbnail_url' => '/assets/wedding/hero-floral.png',
                'package_level' => 'BASIC',
                'is_active' => true,
            ],
            [
                'id' => 'basic-18',
                'name' => 'Desert Sand',
                'code' => 'b18d6s',
                'thumbnail_url' => '/assets/wedding/couple-rustic.png',
                'package_level' => 'BASIC',
                'is_active' => true,
            ],
            [
                'id' => 'basic-19',
                'name' => 'Peachy Coral',
                'code' => 'b19c8p',
                'thumbnail_url' => '/assets/wedding/hero-floral.png',
                'package_level' => 'BASIC',
                'is_active' => true,
            ],
            [
                'id' => 'basic-20',
                'name' => 'Pearl Opal',
                'code' => 'b20o1r',
                'thumbnail_url' => '/assets/wedding/couple-royal.png',
                'package_level' => 'BASIC',
                'is_active' => true,
            ],
        ];

        foreach ($newThemes as $themeData) {
            Theme::updateOrCreate(
                ['id' => $themeData['id']],
                $themeData
            );
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Theme::whereIn('id', [
            'basic-11', 'basic-12', 'basic-13', 'basic-14', 'basic-15',
            'basic-16', 'basic-17', 'basic-18', 'basic-19', 'basic-20',
        ])->delete();
    }
};
