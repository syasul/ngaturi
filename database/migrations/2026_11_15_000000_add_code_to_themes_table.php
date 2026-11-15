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

        // Generate unique random codes for all existing themes
        $existingThemes = Theme::all();
        $assignedCodes = [];

        foreach ($existingThemes as $theme) {
            if (empty($theme->code)) {
                do {
                    $code = strtolower(Str::random(6));
                } while (in_array($code, $assignedCodes) || Theme::where('code', $code)->exists());

                $assignedCodes[] = $code;
                $theme->code = $code;
                $theme->save();
            }
        }

        // Ensure basic-1 theme exists and is active
        $basic1 = Theme::find('basic-1');
        if (!$basic1) {
            do {
                $basicCode = strtolower(Str::random(6));
            } while (in_array($basicCode, $assignedCodes) || Theme::where('code', $basicCode)->exists());

            Theme::create([
                'id' => 'basic-1',
                'name' => 'Minimalist Sage',
                'code' => $basicCode,
                'thumbnail_url' => '/assets/wedding/couple-foliage.png',
                'is_active' => true,
                'package_level' => 'BASIC',
            ]);
        } else {
            $basic1->update([
                'name' => 'Minimalist Sage',
                'thumbnail_url' => '/assets/wedding/couple-foliage.png',
                'is_active' => true,
                'package_level' => 'BASIC',
            ]);
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
