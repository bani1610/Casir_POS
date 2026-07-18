<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthService
{
    /**
     * Login user dan generate token Sanctum.
     */
    public function login(string $email, string $password, bool $remember = false): array
    {
        $user = User::where('email', $email)->first();

        if (!$user || !Hash::check($password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => 'Email atau password salah.',
            ]);
        }

        if (!$user->isActive()) {
            throw ValidationException::withMessages([
                'email' => 'Akun Anda tidak aktif. Hubungi administrator.',
            ]);
        }

        // Generate token dengan nama device dan expiration sesuai remember
        $tokenName = 'auth_token_' . now()->timestamp;
        $expiresAt = $remember ? now()->addDays(30) : now()->addDay();

        $token = $user->createToken($tokenName, ['*'], $expiresAt)->plainTextToken;

        return [
            'user' => $user,
            'token' => $token,
        ];
    }

    /**
     * Logout user dengan revoke current token.
     */
    public function logout(User $user): void
    {
        // Revoke current access token
        $user->currentAccessToken()->delete();
    }

    /**
     * Get authenticated user data.
     */
    public function me(User $user): User
    {
        return $user;
    }
}
