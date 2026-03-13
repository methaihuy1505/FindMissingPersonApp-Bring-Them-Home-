<?php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    // Lấy danh sách (Đã có)
    public function getAllUser()
    {
        return response()->json(User::all());
    }

    // Tạo mới (C)
    public function createUser(Request $request)
    {
        $validated = $request->validate([
            'name'  => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
        ]);

        $user = User::create($validated);
        return response()->json($user, 201);
    }

    // Cập nhật (U)
    public function updateUser(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name'  => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:users,email,' . $id,
        ]);

        $user->update($validated);
        return response()->json($user);
    }

    // Xóa (D)
    public function deleteUser($id)
    {
        $user = User::findOrFail($id);
        $user->delete();
        return response()->json(['message' => 'Xóa thành công']);
    }
}
