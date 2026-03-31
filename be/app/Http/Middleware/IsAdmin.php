<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class IsAdmin
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // 1. Kiểm tra xem người dùng đã đăng nhập qua JWT chưa
        // 2. Kiểm tra xem role có phải là 'admin' không
        if (Auth::guard('api')->check() && Auth::guard('api')->user()->role === 'admin') {
            return $next($request);
        }

        // Nếu không phải admin, trả về lỗi 403 (Forbidden)
        return response()->json([
            'message' => 'Truy cập bị từ chối. Khu vực này chỉ dành cho Quản trị viên.',
        ], 403);
    }
}