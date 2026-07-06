<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Exception;

class GoogleController extends Controller
{
    /**
     * Redirect the user to the Google authentication page.
     *
     * @return \Symfony\Component\HttpFoundation\RedirectResponse
     */
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->redirect();
    }

    /**
     * Obtain the user information from Google.
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();
            
            // Check if user already exists with this Google ID
            $user = User::where('google_id', $googleUser->getId())->first();
            
            if ($user) {
                // User exists, log them in
                Auth::login($user);
                return redirect()->intended('/dashboard');
            }
            
            // Otherwise, check if user exists with the same email
            $user = User::where('email', $googleUser->getEmail())->first();
            
            if ($user) {
                // Link the Google account and log in
                $user->update([
                    'google_id' => $googleUser->getId(),
                    'status' => 'ACTIVE', // Ensure they are active
                ]);
                
                if (!$user->hasVerifiedEmail()) {
                    $user->markEmailAsVerified();
                }
                
                Auth::login($user);
                return redirect()->intended('/dashboard');
            }
            
            // Create a new user since they don't exist
            $newUser = User::create([
                'name' => $googleUser->getName(),
                'email' => $googleUser->getEmail(),
                'google_id' => $googleUser->getId(),
                'password' => null, // No password needed for Google users
                'role' => 'USER',
                'status' => 'ACTIVE', // Socialite accounts are active by default
            ]);
            
            // Mark email as verified since it came from Google
            $newUser->markEmailAsVerified();
            
            Auth::login($newUser);
            return redirect()->intended('/dashboard');
            
        } catch (Exception $e) {
            return redirect('/login')->withErrors(['email' => 'Gagal masuk menggunakan akun Google. Silakan coba kembali.']);
        }
    }
}
