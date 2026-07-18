<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Resources\UserResource;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function __construct(protected AuthService $service) {}

    /**
     * Login user dan generate token.
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $result = $this->service->login(
            email: $validated['email'],
            password: $validated['password'],
            remember: $validated['remember'] ?? false
        );

        return response()->json([
            'message' => 'Login berhasil.',
            'data' => [
                'user' => new UserResource($result['user']),
                'token' => $result['token'],
            ],
        ]);
    }

    /**
     * Logout user dan revoke token.
     */
    public function logout(Request $request): JsonResponse
    {
        $this->service->logout($request->user());

        return response()->json([
            'message' => 'Logout berhasil.',
        ]);
    }

    /**
     * Get authenticated user data.
     */
    public function me(Request $request): JsonResponse
    {
        $user = $this->service->me($request->user());

        return response()->json([
            'message' => 'Data user berhasil diambil.',
            'data' => new UserResource($user),
        ]);
    }

    /**
     * Forgot password - akan diimplementasikan nanti.
     */
    public function forgotPassword(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'Fitur forgot password akan segera tersedia.',
        ], 501);
    }

    /**
     * Reset password - akan diimplementasikan nanti.
     */
    public function resetPassword(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'Fitur reset password akan segera tersedia.',
        ], 501);
    }
}
