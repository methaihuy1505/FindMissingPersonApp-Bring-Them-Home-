<?php
namespace App\Http\Controllers;

use App\Models\Image;
use App\Models\MissingPerson;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * @group Quản lý hồ sơ người mất tích
 * * Các API liên quan đến việc tạo, hiển thị và cập nhật hồ sơ người mất tích.
 */
class MissingPersonController extends Controller
{

    /**
     * Danh sách hồ sơ
     ** Lấy toàn bộ danh sách người mất tích, mặc định sắp xếp theo tin mới nhất.
     * @queryParam status Lọc theo trạng thái ('missing', 'found' hoặc 'all'). Example: missing
     */
    public function index(Request $request)
    {
        $query = MissingPerson::with('images')->orderBy('created_at', 'desc');

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $list = $query->get();
        return response()->json($list);
    }

    /**
     * Đăng hồ sơ mới
     ** Lưu thông tin người mất tích và ảnh đính kèm (nếu có).
     * @authenticated
     * @bodyParam full_name string required Họ và tên người cần tìm. Example: Nguyễn Văn A
     * @bodyParam gender string required Giới tính (male, female, other). Example: male
     * @bodyParam birth_date date Ngày sinh (YYYY-MM-DD). Example: 1995-05-20
     * @bodyParam last_seen_date date Ngày nhìn thấy lần cuối. Example: 2024-01-15
     * @bodyParam last_seen_location string required Vị trí cuối cùng nhìn thấy. Example: Quận 1, TP.HCM
     * @bodyParam description string Đặc điểm nhận dạng hoặc thông tin mô tả. Example: Cao 1m7, nốt ruồi bên trái.
     * @bodyParam status string Trạng thái (missing hoặc found). Example: missing
     * @bodyParam created_by int required ID người đăng bài. Example: 1
     * @bodyParam image_url string Đường dẫn ảnh hồ sơ. Example: https://example.com/photo.jpg
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'full_name'          => 'required|string|max:255',
            'gender'             => 'required|in:male,female,other',
            'birth_date'         => 'nullable|date',
            'last_seen_date'     => 'nullable|date',
            'last_seen_location' => 'required|string',
            'description'        => 'nullable|string',
            'status'             => 'nullable|string',
            'created_by'         => 'required|exists:users,id',
            'image_url'          => 'nullable|string',
        ]);

        return DB::transaction(function () use ($validated) {
            $person = MissingPerson::create($validated);

            if (! empty($validated['image_url'])) {
                Image::create([
                    'missing_person_id' => $person->id,
                    'image_url'         => $validated['image_url'],
                ]);
            }

            return response()->json($person->load('images'), 201);
        });
    }

    /**
     * Chi tiết hồ sơ
     ** Lấy thông tin chi tiết một hồ sơ kèm ảnh, người đăng và các manh mối liên quan.
     * @urlParam id int required ID của hồ sơ. Example: 1
     */
    public function show($id)
    {
        $person = MissingPerson::with(['creator', 'images', 'sightings.reporter'])
            ->findOrFail($id);
        return response()->json($person);
    }

    /**
     * Cập nhật trạng thái Tìm thấy
     ** Đánh dấu hồ sơ này là đã tìm thấy (Found).
     * @authenticated
     * @urlParam id int required ID của hồ sơ. Example: 1
     */
    public function updateStatus(Request $request, $id)
    {
        $person = MissingPerson::findOrFail($id);
        $person->update(['status' => 'found']);
        return response()->json(['message' => 'Chúc mừng! Đã cập nhật trạng thái tìm thấy.']);
    }

    /**
     * Xóa hồ sơ
     ** Xóa vĩnh viễn hồ sơ và dữ liệu liên quan (Ảnh, Manh mối). Dành cho Admin.
     * @authenticated
     * @urlParam id int required ID của hồ sơ. Example: 1
     */
    public function destroy($id)
    {
        $person = MissingPerson::findOrFail($id);
        $person->delete();
        return response()->json(['message' => 'Đã xóa hồ sơ thành công.']);
    }

    /**
     * Cập nhật hồ sơ
     ** Chỉnh sửa thông tin chi tiết của hồ sơ người mất tích.
     * @authenticated
     * @urlParam id int required ID của hồ sơ. Example: 1
     * @bodyParam full_name string Họ tên mới.
     * @bodyParam gender string Giới tính.
     * @bodyParam birth_date date Ngày sinh.
     * @bodyParam last_seen_date date Ngày nhìn thấy cuối.
     * @bodyParam last_seen_location string Địa điểm.
     * @bodyParam description string Mô tả.
     * @bodyParam status string Trạng thái (missing/found).
     */
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
            'data'    => $person,
        ]);
    }

    /**
     * Bài đăng của tôi
     ** Lấy danh sách các hồ sơ do chính người dùng hiện tại đã đăng.
     * @authenticated
     */
    public function getMyPosts(Request $request)
    {
        // Lấy ID user đang đăng nhập (từ token)
        $userId = auth()->id() ?? $request->user_id;

        $posts = MissingPerson::with([
            'images',
            'sightings.reporter',
        ])
            ->where('created_by', $userId)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($posts);
    }
}