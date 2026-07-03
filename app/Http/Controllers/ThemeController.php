<?php

namespace App\Http\Controllers;

use App\Models\Theme;
use Illuminate\Http\Request;

class ThemeController extends Controller
{
    public function index()
    {
        try {
            $list = Theme::where('is_active', true)->get();
            return response()->json(['status' => 'success', 'themes' => $list]);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Gagal mengambil daftar tema.'], 500);
        }
    }
}
