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
        // Deactivate basic, other sample themes, and theme-3
        Theme::whereIn('id', [
            'elegant',
            'rustic',
            'modern',
            'royal-yogyakarta',
            'botanical-minimal',
            'editorial-mono',
            'theme-3'
        ])->update(['is_active' => false]);

        // Ensure premium themes (theme-1 and theme-2) are active
        Theme::whereIn('id', [
            'theme-1',
            'theme-2'
        ])->update(['is_active' => true]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Re-activate basic and other themes
        Theme::whereIn('id', [
            'elegant',
            'rustic',
            'modern',
            'royal-yogyakarta',
            'botanical-minimal',
            'editorial-mono',
            'theme-3'
        ])->update(['is_active' => true]);
    }
};
