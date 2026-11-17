<?php

use Illuminate\Database\Migrations\Migration;
use App\Models\User;
use App\Http\Controllers\WeddingController;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Heals and auto-publishes wedding records for all users in the system.
     */
    public function up(): void
    {
        $users = User::all();
        foreach ($users as $user) {
            WeddingController::ensureWeddingForUser($user);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No-op
    }
};
