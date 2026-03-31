<?php
namespace App\Http\Controllers;

use App\Models\Image;
use Illuminate\Http\Request;

class ImageController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'missing_person_id' => 'required|exists:missing_persons,id',
            'image_url'         => 'required|url',
        ]);

        $image = Image::create($validated);
        return response()->json($image, 201);
    }

    public function destroy($id)
    {
        $image = Image::findOrFail($id);
        $image->delete();
        return response()->json(['message' => 'Đã xóa ảnh']);
    }
}