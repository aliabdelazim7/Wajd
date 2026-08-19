<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AdminLoginRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(AdminLoginRequest $request): JsonResponse
    {
        $credentials = $request->validated();
        $user = User::query()->where('email', $credentials['email'])->first();

        if (!$user || !$user->is_admin || !Hash::check($credentials['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['بيانات الدخول غير صحيحة أو الحساب لا يملك صلاحية الإدارة.'],
            ]);
        }

        $user->tokens()->where('name', 'wajd-admin')->delete();
        $token = $user->createToken('wajd-admin', ['admin'])->plainTextToken;

        return response()->json([
            'data' => [
                'token' => $token,
                'user' => $user->only(['id', 'name', 'email', 'is_admin']),
            ],
            'message' => 'تم تسجيل الدخول بنجاح.',
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'data' => $request->user()->only(['id', 'name', 'email', 'is_admin']),
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()?->delete();

        return response()->json(['message' => 'تم تسجيل الخروج بنجاح.']);
    }
}
