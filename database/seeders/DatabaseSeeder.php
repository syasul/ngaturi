<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Theme;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        Theme::upsert([
            ['id' => 'elegant', 'name' => 'Elegant Gold', 'thumbnail_url' => null, 'is_active' => true, 'package_level' => 'BASIC'],
            ['id' => 'rustic', 'name' => 'Rustic Bohemian', 'thumbnail_url' => null, 'is_active' => true, 'package_level' => 'BASIC'],
            ['id' => 'modern', 'name' => 'Modern Minimalist', 'thumbnail_url' => null, 'is_active' => true, 'package_level' => 'PREMIUM'],
            ['id' => 'royal-yogyakarta', 'name' => 'Royal Yogyakarta', 'thumbnail_url' => null, 'is_active' => true, 'package_level' => 'PREMIUM'],
            ['id' => 'botanical-minimal', 'name' => 'Botanical Minimal', 'thumbnail_url' => null, 'is_active' => true, 'package_level' => 'BASIC'],
            ['id' => 'editorial-mono', 'name' => 'Editorial Mono', 'thumbnail_url' => null, 'is_active' => true, 'package_level' => 'PREMIUM'],
            ['id' => 'burgundy-bloom', 'name' => 'Burgundy Bloom', 'thumbnail_url' => '/assets/wedding/burgundy-envelope-closed.png', 'is_active' => true, 'package_level' => 'PREMIUM'],
        ], ['id'], ['name', 'thumbnail_url', 'is_active', 'package_level']);

        User::firstOrCreate(
            ['email' => 'test@example.com'],
            ['name' => 'Test User', 'password' => bcrypt('password')]
        );
    }
}
