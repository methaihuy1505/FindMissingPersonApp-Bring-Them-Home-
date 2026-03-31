<?php

use App\Http\Controllers\ImageController;
use App\Http\Controllers\MissingPersonController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SightingController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

// --- PUBLIC ROUTES ---
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::get('/missing-persons', [MissingPersonController::class, 'index']);
Route::get('/missing-persons/{id}', [MissingPersonController::class, 'show']);
Route::get('/sightings/{person_id}', [SightingController::class, 'getByPerson']);

// --- PROTECTED ROUTES (USER & ADMIN) ---
Route::group(['middleware' => 'auth:api'], function () {
    Route::get('/me', [AuthController::class, 'me']);

    // Quản lý hồ sơ cá nhân
    Route::post('/missing-persons', [MissingPersonController::class, 'store']);
    Route::put('/missing-persons/{id}', [MissingPersonController::class, 'update']);
    Route::put('/missing-persons/{id}/status', [MissingPersonController::class, 'updateStatus']);

    // Manh mối & Báo cáo
    Route::post('/sightings', [SightingController::class, 'store']);
    Route::put('/sightings/{id}', [SightingController::class, 'update']);
    Route::delete('/sightings/{id}', [SightingController::class, 'destroy']);
    Route::post('/images', [ImageController::class, 'store']);
    Route::post('/reports', [ReportController::class, 'store']);

    // --- ADMIN ONLY ROUTES ---
    Route::group(['middleware' => 'admin'], function () {
        // Quản trị người dùng
        Route::get('/user', [UserController::class, 'getAllUser']);
        Route::post('/user', [UserController::class, 'createUser']);
        Route::put('/user/{id}', [UserController::class, 'updateUser']);
        Route::delete('/user/{id}', [UserController::class, 'deleteUser']);

        // Quản trị nội dung & Xử lý báo cáo
        Route::delete('/missing-persons/{id}', [MissingPersonController::class, 'destroy']);
        Route::get('/reports', [ReportController::class, 'index']);
        Route::delete('/reports/{id}', [ReportController::class, 'destroy']);
        Route::delete('/images/{id}', [ImageController::class, 'destroy']);
    });
});