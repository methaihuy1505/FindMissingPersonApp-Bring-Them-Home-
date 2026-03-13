<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/user', [UserController::class, 'getAllUser']);
Route::get('/test', function () {
    return "API working";
});
