<?php
namespace App\Http\Controllers;

use App\Models\Sighting;
use Illuminate\Http\Request;

/**
 * @group Manh mối (Sightings)
 *
 * API quản lý các thông tin manh mối nhìn thấy người mất tích từ cộng đồng.
 */
class SightingController extends Controller
{
    /**
     * Lấy manh mối theo người mất tích
     ** Lấy danh sách tất cả manh mối của một hồ sơ cụ thể.
     * @urlParam person_id int required ID của hồ sơ người mất tích. Example: 1
     */
    public function getByPerson($person_id)
    {
        $sightings = Sighting::with('reporter')
            ->where('missing_person_id', $person_id)
            ->orderBy('sighting_date', 'desc')
            ->get();
        return response()->json($sightings);
    }

    /**
     * Gửi manh mối mới
     ** Lưu thông tin manh mối nhìn thấy người mất tích.
     * @authenticated
     * @bodyParam missing_person_id int required ID hồ sơ người mất tích. Example: 1
     * @bodyParam reported_by int required ID người báo manh mối. Example: 2
     * @bodyParam location string required Địa điểm nhìn thấy. Example: Công viên Tao Đàn, Quận 1
     * @bodyParam description string required Mô tả chi tiết (trang phục, hướng đi...). Example: Mặc áo thun xanh.
     * @bodyParam sighting_date date required Ngày giờ nhìn thấy (YYYY-MM-DD). Example: 2024-03-15
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'missing_person_id' => 'required|exists:missing_persons,id',
            'reported_by'       => 'required|exists:users,id',
            'location'          => 'required|string|max:255',
            'description'       => 'required|string',
            'sighting_date'     => 'required|date',
        ]);

        $sighting = Sighting::create($validated);
        return response()->json($sighting, 201);
    }

    /**
     * Cập nhật manh mối
     * @authenticated
     * @urlParam id int required ID của manh mối. Example: 1
     * @bodyParam location string Địa điểm mới.
     * @bodyParam description string Mô tả mới.
     * @bodyParam sighting_date date Ngày mới.
     */
    public function update(Request $request, $id)
    {
        $sighting = Sighting::findOrFail($id);

        $validated = $request->validate([
            'location'      => 'sometimes|required|string|max:255',
            'description'   => 'sometimes|required|string',
            'sighting_date' => 'sometimes|required|date',
        ]);

        $sighting->update($validated);
        return response()->json($sighting);
    }

    /**
     * Xóa manh mối
     * @authenticated
     * @urlParam id int required ID của manh mối. Example: 1
     */
    public function destroy($id)
    {
        $sighting = Sighting::findOrFail($id);
        $sighting->delete();
        return response()->json(['message' => 'Đã xóa manh mối']);
    }
}