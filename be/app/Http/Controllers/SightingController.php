<?php
namespace App\Http\Controllers;

use App\Models\Sighting;
use Illuminate\Http\Request;

class SightingController extends Controller
{
    // Lấy tất cả manh mối của một người mất tích cụ thể
    public function getByPerson($person_id)
    {
        $sightings = Sighting::with('reporter')
            ->where('missing_person_id', $person_id)
            ->orderBy('sighting_date', 'desc')
            ->get();
        return response()->json($sightings);
    }

    // Gửi manh mối mới (Đã có)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'missing_person_id' => 'required|exists:missing_persons,id',
            'reported_by'       => 'required|exists:users,id',
            'location'          => 'required|string|max:255',
            'description'       => 'required|string',
            'sighting_date'     => 'required|date',
        ]);
        // 2. Ép Laravel in ra câu lệnh SQL thực tế mà nó định chạy

        $sighting = Sighting::create($validated);
        return response()->json($sighting, 201);
    }

    // Cập nhật manh mối
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

    // Xóa manh mối
    public function destroy($id)
    {
        $sighting = Sighting::findOrFail($id);
        $sighting->delete();
        return response()->json(['message' => 'Đã xóa manh mối']);
    }
}