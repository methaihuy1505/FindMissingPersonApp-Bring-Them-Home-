<?php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

/**
 * @group Quản lý người dùng
 *
 * API dành cho quản trị viên quản lý danh sách người dùng và cá nhân người dùng quản lý hồ sơ.
 */
class UserController extends Controller
{
    /**
     * Danh sách người dùng
     ** (Admin) Lấy toàn bộ danh sách tài khoản trên hệ thống.
     * @authenticated
     */
    public function getAllUser()
    {
        return response()->json(User::all());
    }

    /**
     * Tạo người dùng mới
     ** (Admin) Tạo tài khoản mới thủ công.
     * @authenticated
     * @bodyParam name string required Tên người dùng. Example: Admin Test
     * @bodyParam email string required Email duy nhất. Example: admin@test.com
     */
    public function createUser(Request $request)
    {
        $validated = $request->validate([
            'name'  => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
        ]);

        $user = User::create($validated);
        return response()->json($user, 201);
    }

    /**
     * Cập nhật người dùng (Admin)
     * @authenticated
     * @urlParam id int required ID người dùng.
     * @bodyParam name string Tên.
     * @bodyParam email string Email.
     * @bodyParam phone string Số điện thoại.
     * @bodyParam role string Quyền (admin/user).
     */
    public function updateUser(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name'  => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:users,email,' . $id,
            'phone' => 'sometimes|nullable|string|max:15',
            'role'  => 'sometimes|required|in:admin,user',
        ]);

        $user->update($validated);

        return response()->json([
            'message' => 'Cập nhật người dùng thành công',
            'user'    => $user,
        ]);
    }

    /**
     * Xóa người dùng
     * @authenticated
     * @urlParam id int required ID người dùng.
     */
    public function deleteUser($id)
    {
        $user = User::findOrFail($id);
        $user->delete();
        return response()->json(['message' => 'Xóa thành công']);
    }

    /**
     * Cập nhật hồ sơ cá nhân
     ** Người dùng tự cập nhật thông tin của chính mình.
     * @authenticated
     * @urlParam id int required ID của bạn.
     * @bodyParam name string required Tên hiển thị mới. Example: Nguyễn Văn B
     * @bodyParam email string required Email mới.
     * @bodyParam phone string Số điện thoại liên hệ. Example: 0987654321
     */
    public function updateProfile(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name'  => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $id,
            'phone' => 'nullable|string|max:15',
        ]);

        $user->update($validated);

        return response()->json([
            'message' => 'Cập nhật thông tin thành công',
            'user'    => $user,
        ]);
    }

    /**
     * Đổi mật khẩu
     * @authenticated
     * @urlParam id int required ID của bạn.
     * @bodyParam current_password string required Mật khẩu hiện tại.
     * @bodyParam new_password string required Mật khẩu mới (min 6 ký tự).
     * @bodyParam new_password_confirmation string required Xác nhận mật khẩu mới.
     */
    public function updatePassword(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $request->validate([
            'current_password' => 'required',
            'new_password'     => 'required|min:6|confirmed',
        ]);

        if (! Hash::check($request->current_password, $user->password)) {
            return response()->json(['message' => 'Mật khẩu hiện tại không chính xác'], 422);
        }

        $user->update(['password' => Hash::make($request->new_password)]);
        return response()->json(['message' => 'Đổi mật khẩu thành công']);
    }

}