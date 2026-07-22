<?php

namespace App\Services;

use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
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

        // Log login event
        auth()->setUser($user);
        AuditLog::record(AuditLog::EVENT_LOGIN, $user);

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
        // Log logout event before revoking token
        AuditLog::record(AuditLog::EVENT_LOGOUT, $user);

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

    /**
     * Generate password reset token.
     */
    public function forgotPassword(string $email): bool
    {
        $user = User::where('email', $email)->first();

        if (!$user) {
            throw ValidationException::withMessages([
                'email' => 'Email tidak ditemukan.',
            ]);
        }

        $token = Str::random(64);

        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $email],
            [
                'token' => Hash::make($token),
                'created_at' => now(),
            ]
        );

        // TODO: Send email dengan token reset password
        // Mail::to($email)->send(new ResetPasswordMail($token));

        return true;
    }

    /**
     * Reset password dengan token.
     */
    public function resetPassword(string $email, string $token, string $password): bool
    {
        $resetRecord = DB::table('password_reset_tokens')
            ->where('email', $email)
            ->first();

        if (!$resetRecord) {
            throw ValidationException::withMessages([
                'email' => 'Token reset password tidak valid.',
            ]);
        }

        if (!Hash::check($token, $resetRecord->token)) {
            throw ValidationException::withMessages([
                'token' => 'Token reset password tidak valid.',
            ]);
        }

        if (Carbon::parse($resetRecord->created_at)->addMinutes(60)->isPast()) {
            throw ValidationException::withMessages([
                'token' => 'Token reset password sudah expired.',
            ]);
        }

        $user = User::where('email', $email)->first();

        if (!$user) {
            throw ValidationException::withMessages([
                'email' => 'User tidak ditemukan.',
            ]);
        }

        $user->update(['password' => Hash::make($password)]);

        DB::table('password_reset_tokens')->where('email', $email)->delete();

        return true;
    }
}
