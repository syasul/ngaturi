<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureIsAdmin
{
    /**
     * Handle an incoming request.
     * Only allow users with role = 'ADMIN' to proceed.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->user() || $request->user()->role !== 'ADMIN') {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Forbidden. Admin only.'], 403);
            }

            // Redirect to user dashboard if authenticated but not admin
            if ($request->user()) {
                return redirect()->route('dashboard');
            }

            return redirect()->route('login');
        }

        return $next($request);
    }
}
