<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

// Read (Đã có)
Route::get('/user', [UserController::class, 'getAllUser']);

// Create (Thêm mới)
Route::post('/user', [UserController::class, 'createUser']);

// Update (Cập nhật) - Cần truyền ID của user muốn sửa
Route::put('/user/{id}', [UserController::class, 'updateUser']);

// Delete (Xóa) - Cần truyền ID của user muốn xóa
Route::delete('/user/{id}', [UserController::class, 'deleteUser']);