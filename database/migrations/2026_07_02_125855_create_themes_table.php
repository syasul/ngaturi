<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('themes', function (Blueprint $table) {
            $table->string('id', 100)->primary(); // 'elegant', 'rustic', 'modern'
            $table->string('name');
            $table->string('thumbnail_url', 500)->nullable();
            $table->boolean('is_active')->default(true);
            $table->string('package_level', 50)->default('BASIC'); // 'BASIC', 'PREMIUM'
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('themes');
    }
};
