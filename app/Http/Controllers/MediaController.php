<?php

namespace App\Http\Controllers;

use App\Models\Photo;
use App\Models\Wedding;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class MediaController extends Controller
{
    // 1. POST /api/media/upload - Upload file
    public function upload(Request $request)
    {
        $user = Auth::user();
        try {
            $file = $request->file('file');

            if (!$file) {
                return response()->json(['status' => 'error', 'message' => 'Tidak ada file yang diunggah.'], 400);
            }

            // Security Hardening: File Size check (max 5MB)
            if ($file->getSize() > 5 * 1024 * 1024) {
                return response()->json(['status' => 'error', 'message' => 'Ukuran file melebihi batas maksimal (5MB).'], 400);
            }

            // Security Hardening: Extension whitelist
            $ext = '.' . strtolower($file->getClientOriginalExtension());
            $allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.mp3'];
            if (!in_array($ext, $allowedExtensions)) {
                return response()->json(['status' => 'error', 'message' => 'Tipe file tidak diizinkan. Hanya menerima jpg, png, webp, dan mp3.'], 400);
            }

            // Security Hardening: Mime-type checking
            $mime = $file->getMimeType();
            $allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'audio/mpeg', 'audio/mp3'];
            if (!in_array($mime, $allowedMimeTypes)) {
                return response()->json(['status' => 'error', 'message' => 'Format file tidak valid.'], 400);
            }

            $uploadsDir = public_path('uploads');
            if (!File::exists($uploadsDir)) {
                File::makeDirectory($uploadsDir, 0755, true);
            }

            // Generate path-safe randomized filename
            $cleanExt = ($ext === '.jpeg') ? '.jpg' : $ext;
            $fileName = time() . '-' . Str::random(7) . $cleanExt;

            // Save file
            $file->move($uploadsDir, $fileName);
            $fileUrl = "/uploads/{$fileName}";

            // Check if it's a photo to save to photos database table
            $wedding = Wedding::where('user_id', $user->id)->first();
            if ($wedding && str_starts_with($mime, 'image/')) {
                $existingPhotosCount = Photo::where('wedding_id', $wedding->id)->count();

                Photo::create([
                    'wedding_id' => $wedding->id,
                    'url' => $fileUrl,
                    'order' => $existingPhotosCount,
                    'type' => 'gallery',
                ]);
            }

            return response()->json([
                'status' => 'success',
                'message' => 'File berhasil diunggah.',
                'url' => $fileUrl,
            ]);
        } catch (\Exception $e) {
            logger()->error('File upload error: ' . $e->getMessage());
            return response()->json(['status' => 'error', 'message' => 'Gagal mengunggah file.'], 500);
        }
    }

    // 2. DELETE /api/media/photos/{id} - Delete photo
    public function deletePhoto($id)
    {
        $user = Auth::user();
        try {
            $wedding = Wedding::where('user_id', $user->id)->first();

            if (!$wedding) {
                return response()->json(['status' => 'error', 'message' => 'Akses ditolak.'], 403);
            }

            $photo = Photo::where('id', $id)->where('wedding_id', $wedding->id)->first();

            if (!$photo) {
                return response()->json(['status' => 'error', 'message' => 'Foto tidak ditemukan.'], 404);
            }

            // Delete physical file
            $filePath = public_path($photo->url);
            if (File::exists($filePath)) {
                try {
                    File::delete($filePath);
                } catch (\Exception $e) {
                    logger()->error('Failed to delete physical file: ' . $e->getMessage());
                }
            }

            $photo->delete();

            return response()->json(['status' => 'success', 'message' => 'Foto berhasil dihapus.']);
        } catch (\Exception $e) {
            logger()->error('Delete photo error: ' . $e->getMessage());
            return response()->json(['status' => 'error', 'message' => 'Gagal menghapus foto.'], 500);
        }
    }

    // 3. POST /api/media/photos/sort - Sort photos
    public function sortPhotos(Request $request)
    {
        $user = Auth::user();
        try {
            $photoIds = $request->input('photoIds');

            if (!is_array($photoIds) || empty($photoIds)) {
                return response()->json(['status' => 'error', 'message' => 'Urutan foto tidak valid.'], 400);
            }

            $wedding = Wedding::where('user_id', $user->id)->first();

            if (!$wedding) {
                return response()->json(['status' => 'error', 'message' => 'Akses ditolak.'], 403);
            }

            // Update order for each photo
            foreach ($photoIds as $index => $id) {
                Photo::where('id', $id)
                    ->where('wedding_id', $wedding->id)
                    ->update(['order' => $index]);
            }

            return response()->json(['status' => 'success', 'message' => 'Urutan foto berhasil disimpan.']);
        } catch (\Exception $e) {
            logger()->error('Sort photos error: ' . $e->getMessage());
            return response()->json(['status' => 'error', 'message' => 'Gagal mengurutkan foto.'], 500);
        }
    }
}
