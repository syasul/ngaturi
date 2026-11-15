<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use App\Models\Theme;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (!Schema::hasColumn('themes', 'code')) {
            Schema::table('themes', function (Blueprint $table) {
                $table->string('code', 50)->nullable()->unique()->after('id');
            });
        }

        // Standard predefined codes for consistent URLs across all environments
        $knownCodes = [
            'basic-1' => 'tv6akl',
            'basic-2' => 'b2x8k1',
            'basic-3' => 'b3v7x2',
            'basic-4' => 'b4k8n1',
            'basic-5' => 'b5w9p3',
            'theme-1' => 'emikvq',
            'theme-2' => 't2ltgr',
            'custom-theme-1' => 'rgudhs',
            'elegant' => 'u6etuk',
            'rustic' => 'c3j55t',
            'modern' => 'auildo',
            'royal-yogyakarta' => 'mowx32',
            'botanical-minimal' => 'bzuqtb',
            'editorial-mono' => '94shhu',
            'theme-3' => 'w616j1',
        ];

        // Ensure basic-1 theme exists and is active
        $basic1 = Theme::find('basic-1');
        if (!$basic1) {
            Theme::create([
                'id' => 'basic-1',
                'name' => 'Minimalist Sage',
                'code' => $knownCodes['basic-1'],
                'thumbnail_url' => '/assets/wedding/couple-foliage.png',
                'is_active' => true,
                'package_level' => 'BASIC',
            ]);
        } else {
            $basic1->update([
                'name' => 'Minimalist Sage',
                'code' => $knownCodes['basic-1'],
                'thumbnail_url' => '/assets/wedding/couple-foliage.png',
                'is_active' => true,
                'package_level' => 'BASIC',
            ]);
        }

        // Ensure basic-2 theme exists and is active
        $basic2 = Theme::find('basic-2');
        if (!$basic2) {
            Theme::create([
                'id' => 'basic-2',
                'name' => 'Terracotta Bloom',
                'code' => $knownCodes['basic-2'],
                'thumbnail_url' => '/assets/wedding/couple-rustic.png',
                'is_active' => true,
                'package_level' => 'BASIC',
            ]);
        } else {
            $basic2->update([
                'name' => 'Terracotta Bloom',
                'code' => $knownCodes['basic-2'],
                'thumbnail_url' => '/assets/wedding/couple-rustic.png',
                'is_active' => true,
                'package_level' => 'BASIC',
            ]);
        }

        // Ensure basic-3 theme exists and is active
        $basic3 = Theme::find('basic-3');
        if (!$basic3) {
            Theme::create([
                'id' => 'basic-3',
                'name' => 'Dusty Rose',
                'code' => $knownCodes['basic-3'],
                'thumbnail_url' => '/assets/wedding/hero-floral.png',
                'is_active' => true,
                'package_level' => 'BASIC',
            ]);
        } else {
            $basic3->update([
                'name' => 'Dusty Rose',
                'code' => $knownCodes['basic-3'],
                'thumbnail_url' => '/assets/wedding/hero-floral.png',
                'is_active' => true,
                'package_level' => 'BASIC',
            ]);
        }

        // Ensure basic-4 theme exists and is active
        $basic4 = Theme::find('basic-4');
        if (!$basic4) {
            Theme::create([
                'id' => 'basic-4',
                'name' => 'Classic Ivory Noir',
                'code' => $knownCodes['basic-4'],
                'thumbnail_url' => '/assets/wedding/couple-royal.png',
                'is_active' => true,
                'package_level' => 'BASIC',
            ]);
        } else {
            $basic4->update([
                'name' => 'Classic Ivory Noir',
                'code' => $knownCodes['basic-4'],
                'thumbnail_url' => '/assets/wedding/couple-royal.png',
                'is_active' => true,
                'package_level' => 'BASIC',
            ]);
        }

        // Ensure basic-5 theme exists and is active
        $basic5 = Theme::find('basic-5');
        if (!$basic5) {
            Theme::create([
                'id' => 'basic-5',
                'name' => 'Ocean Breeze',
                'code' => $knownCodes['basic-5'],
                'thumbnail_url' => '/assets/wedding/couple-foliage.png',
                'is_active' => true,
                'package_level' => 'BASIC',
            ]);
        } else {
            $basic5->update([
                'name' => 'Ocean Breeze',
                'code' => $knownCodes['basic-5'],
                'thumbnail_url' => '/assets/wedding/couple-foliage.png',
                'is_active' => true,
                'package_level' => 'BASIC',
            ]);
        }

        // Assign codes for all existing themes
        $existingThemes = Theme::all();
        $assignedCodes = [];

        foreach ($existingThemes as $theme) {
            if (isset($knownCodes[$theme->id])) {
                $theme->code = $knownCodes[$theme->id];
                $theme->save();
                $assignedCodes[] = $theme->code;
            } elseif (empty($theme->code)) {
                do {
                    $code = strtolower(Str::random(6));
                } while (in_array($code, $assignedCodes) || Theme::where('code', $code)->exists());

                $assignedCodes[] = $code;
                $theme->code = $code;
                $theme->save();
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasColumn('themes', 'code')) {
            Schema::table('themes', function (Blueprint $table) {
                $table->dropColumn('code');
            });
        }
    }
};
