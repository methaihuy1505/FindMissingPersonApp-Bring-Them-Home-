<?php
namespace App\Http\Controllers;

use App\Models\Image;
use Illuminate\Http\Request;

/**
 * @group Quản lý ảnh
 *
 * API xử lý các hình ảnh liên quan đến hồ sơ người mất tích.
 */
class ImageController extends Controller
{
    /**
     * Thêm ảnh mới
     ** Lưu đường dẫn ảnh vào cơ sở dữ liệu cho một hồ sơ cụ thể.
     * @authenticated
     * @bodyParam missing_person_id int required ID của hồ sơ người mất tích. Example: 1
     * @bodyParam image_url string required Đường dẫn URL của ảnh. Example: https://example.com/image.jpg
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'missing_person_id' => 'required|exists:missing_persons,id',
            'image_url'         => 'required|url',
        ]);

        $image = Image::create($validated);
        return response()->json($image, 201);
    }

    /**
     * Xóa ảnh
     * @authenticated
     * @urlParam id int required ID của ảnh cần xóa. Example: 1
     */
    public function destroy($id)
    {
        $image = Image::findOrFail($id);
        $image->delete();
        return response()->json(['message' => 'Đã xóa ảnh']);
    }
}