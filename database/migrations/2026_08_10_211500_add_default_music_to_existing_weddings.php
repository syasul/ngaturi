<?php

use Illuminate\Database\Migrations\Migration;
use App\Models\Music;
use App\Models\Wedding;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Seed default music library if empty
        $tracks = [
            [
                'title' => 'Jedag Jedug Gamelan',
                'artist' => 'Unknown Artist',
                'url' => '/assets/music/jedag-jedug-gamelan.mp3',
                'is_active' => true,
            ],
            [
                'title' => 'A Thousand Years',
                'artist' => 'Christina Perri',
                'url' => '/uploads/a_thousand_years.mp3',
                'is_active' => true,
            ],
            [
                'title' => 'Marry Me',
                'artist' => 'Train',
                'url' => '/uploads/marry_me.mp3',
                'is_active' => true,
            ],
            [
                'title' => 'Beautiful in White',
                'artist' => 'Westlife',
                'url' => '/uploads/beautiful_in_white.mp3',
                'is_active' => true,
            ],
        ];

        foreach ($tracks as $track) {
            Music::firstOrCreate(
                ['title' => $track['title']],
                [
                    'artist' => $track['artist'],
                    'url' => $track['url'],
                    'is_active' => $track['is_active'],
                ]
            );
        }

        // 2. Add default music to all existing weddings
        $defaultMusicUrl = '/assets/music/jedag-jedug-gamelan.mp3';

        $weddings = Wedding::all();
        foreach ($weddings as $wedding) {
            $data = $wedding->data;
            if (!is_array($data)) {
                $data = [];
            }

            // Set top-level musicUrl
            $data['musicUrl'] = $defaultMusicUrl;

            // Set customStyle.musicUrl
            if (!isset($data['customStyle']) || !is_array($data['customStyle'])) {
                $data['customStyle'] = [];
            }
            $data['customStyle']['musicUrl'] = $defaultMusicUrl;

            $wedding->data = $data;
            $wedding->save();
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Rollback music Url changes
        $weddings = Wedding::all();
        foreach ($weddings as $wedding) {
            $data = $wedding->data;
            if (is_array($data)) {
                if (isset($data['musicUrl'])) {
                    unset($data['musicUrl']);
                }
                if (isset($data['customStyle']) && is_array($data['customStyle']) && isset($data['customStyle']['musicUrl'])) {
                    $data['customStyle']['musicUrl'] = '';
                }
                $wedding->data = $data;
                $wedding->save();
            }
        }
    }
};
