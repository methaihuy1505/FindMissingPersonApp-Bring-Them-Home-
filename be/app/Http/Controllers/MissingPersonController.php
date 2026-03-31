<?php
namespace App\Http\Controllers;

use App\Models\MissingPerson;
use App\Models\Image;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MissingPersonController extends Controller
{
    
    // Lấy danh sách hiển thị (Hỗ trợ lọc theo trạng thái )
    public function index(Request $request)
    {
        $query = MissingPerson::with('images')->orderBy('created_at', 'desc');

        // Nếu request có gửi kèm status (VD: ?status=missing) và không phải là 'all'
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $list = $query->get();
        return response()->json($list);
    }

    // 2. Đăng tin mới
    public function store(Request $request)
    {
        $validated = $request->validate([
            'full_name' => 'required|string',
            'gender' => 'required|in:male,female,other',
            'last_seen_location' => 'required',
            'created_by' => 'required|exists:users,id',
            'image_url' => 'nullable|string' // Nhận link ảnh trực tiếp cho nhanh
        ]);

        // Dùng Transaction để đảm bảo lưu cả hồ sơ và ảnh cùng lúc
        return DB::transaction(function () use ($validated) {
            $person = MissingPerson::create($validated);

            // Nếu có link ảnh thì lưu vào bảng images
            if (!empty($validated['image_url'])) {
                Image::create([
                    'missing_person_id' => $person->id,
                    'image_url' => $validated['image_url']
                ]);
            }

            return response()->json($person->load('images'), 201);
        });
    }

    // 3. Xem chi tiết hồ sơ (Kèm tất cả ảnh và tất cả manh mối)
    public function show($id)
    {
        // Eager loading: lấy thông tin người đăng (creator), ảnh (images) và manh mối (sightings)
        $person = MissingPerson::with(['creator', 'images', 'sightings.reporter'])
                  ->findOrFail($id);
        return response()->json($person);
    }

    // 4. Cập nhật trạng thái (Tìm thấy)
    public function updateStatus(Request $request, $id)
    {
        $person = MissingPerson::findOrFail($id);
        $person->update(['status' => 'found']);
        return response()->json(['message' => 'Chúc mừng! Đã cập nhật trạng thái tìm thấy.']);
    }

    // 5. Xóa bài (Dành cho Admin)
    public function destroy($id)
    {
        $person = MissingPerson::findOrFail($id);
        $person->delete(); // Tự động xóa sightings/images nhờ ON DELETE CASCADE trong DB
        return response()->json(['message' => 'Đã xóa hồ sơ thành công.']);
    }

    // Cập nhật thông tin hồ sơ
    public function update(Request $request, $id)
    {
        $person = MissingPerson::findOrFail($id);

        $validated = $request->validate([
            'full_name'          => 'sometimes|required|string|max:150',
            'gender'             => 'sometimes|required|in:male,female,other',
            'birth_date'         => 'nullable|date',
            'last_seen_date'     => 'sometimes|required|date',
            'last_seen_location' => 'sometimes|required|string|max:255',
            'description'        => 'nullable|string',
            'status'             => 'sometimes|required|in:missing,found',
        ]);

        $person->update($validated);

        return response()->json([
            'message' => 'Cập nhật hồ sơ thành công',
            'data'    => $person
        ]);
    }
}   