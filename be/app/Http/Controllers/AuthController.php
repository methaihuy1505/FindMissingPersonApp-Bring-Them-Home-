<?php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

/**
 * @group Xác thực tài khoản
 *
 * API dành cho việc quản lý tài khoản người dùng, đăng ký và đăng nhập.
 */
class AuthController extends Controller
{
    /**
     * Đăng ký tài khoản
     *
     ** Tạo tài khoản mới cho người dùng. Mặc định vai trò sẽ là 'user'.
     *
     * @bodyParam name string required Tên người dùng. Example: Nguyễn Văn A
     * @bodyParam email string required Email dùng để đăng nhập (duy nhất). Example: user@example.com
     * @bodyParam password string required Mật khẩu. Example: password123
     * @bodyParam phone string Số điện thoại liên hệ. Example: 0901234567
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'     => 'required|string|max:100',
            'email'    => 'required|string|email|max:150|unique:users',
            'password' => 'required|string|min:6',
            'phone'    => 'nullable|string|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'phone'    => $request->phone,
            'role'     => 'user',
        ]);

        return response()->json([
            'message' => 'Đăng ký tài khoản thành công',
            'user'    => $user,
        ], 201);
    }

    /**
     * Đăng nhập
     *
     ** Xác thực người dùng và trả về JWT token.
     *
     * @bodyParam email string required Email đã đăng ký. Example: user@example.com
     * @bodyParam password string required Mật khẩu tài khoản. Example: password123
     */
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (! $token = auth('api')->attempt($credentials)) {
            return response()->json(['error' => 'Email hoặc mật khẩu không chính xác'], 401);
        }

        return $this->respondWithToken($token);
    }

    /**
     * Thông tin cá nhân (Me)
     *
     ** Lấy thông tin chi tiết của người dùng đang đăng nhập từ Token.
     *
     * @authenticated
     */
    public function me()
    {
        return response()->json(auth('api')->user());
    }

    /**
     * Đăng xuất
     *
     ** Vô hiệu hóa Token hiện tại.
     *
     * @authenticated
     */
    public function logout()
    {
        auth('api')->logout();

        return response()->json(['message' => 'Đăng xuất thành công']);
    }

    /**
     * Làm mới Token
     *
     ** Cấp một Token mới dựa trên Token hiện tại.
     *
     * @authenticated
     */
    public function refresh()
    {
        return $this->respondWithToken(auth('api')->refresh());
    }

    /**
     * Cấu trúc phản hồi Token
     * @internal
     */
    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type'   => 'bearer',
            'expires_in'   => auth('api')->factory()->getTTL() * 60,
            'user'         => auth('api')->user(),
        ]);
    }
}