<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    /**
     * Đăng ký tài khoản mới
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:100',
            'email' => 'required|string|email|max:150|unique:users',
            'password' => 'required|string|min:6',
            'phone' => 'nullable|string|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password), // Mã hóa mật khẩu
            'phone' => $request->phone,
            'role' => 'user', // Mặc định đăng ký là user thường
        ]);

        return response()->json([
            'message' => 'Đăng ký tài khoản thành công',
            'user' => $user
        ], 201);
    }

    /**
     * Đăng nhập và lấy Token
     */
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        // Thử xác thực người dùng
        if (!$token = auth('api')->attempt($credentials)) {
            return response()->json(['error' => 'Email hoặc mật khẩu không chính xác'], 401);
        }

        return $this->respondWithToken($token);
    }

    /**
     * Lấy thông tin người dùng đang đăng nhập thông qua Token
     */
    public function me()
    {
        return response()->json(auth('api')->user());
    }

    /**
     * Đăng xuất (Vô hiệu hóa Token)
     */
    public function logout()
    {
        auth('api')->logout();

        return response()->json(['message' => 'Đăng xuất thành công']);
    }

    /**
     * Làm mới Token (Refresh Token)
     */
    public function refresh()
    {
        return $this->respondWithToken(auth('api')->refresh());
    }

    /**
     * Cấu trúc phản hồi Token
     */
    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60, // Thời gian hết hạn (giây)
            'user' => auth('api')->user() // Trả về kèm thông tin user để FE tiện sử dụng
        ]);
    }
}