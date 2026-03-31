<?php
namespace App\Http\Controllers;

use App\Models\Report;
use Illuminate\Http\Request;

/**
 * @group Báo cáo vi phạm
 *
 * API dành cho việc gửi và quản lý các báo cáo vi phạm liên quan đến hồ sơ.
 */
class ReportController extends Controller
{
    /**
     * Danh sách báo cáo
     ** Lấy toàn bộ danh sách báo cáo vi phạm kèm thông tin người báo và hồ sơ bị báo cáo.
     * @authenticated
     */
    public function index()
    {
        $reports = Report::with(['user:id,name', 'missingPerson:id,full_name'])->get();
        return response()->json($reports);
    }

    /**
     * Gửi báo cáo
     ** Người dùng gửi nội dung báo cáo vi phạm cho một hồ sơ cụ thể.
     * @authenticated
     * @bodyParam user_id int required ID người gửi báo cáo. Example: 1
     * @bodyParam missing_person_id int required ID hồ sơ bị báo cáo. Example: 5
     * @bodyParam report_message string required Nội dung chi tiết báo cáo. Example: Hồ sơ có chứa thông tin sai lệch.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id'           => 'required|exists:users,id',
            'missing_person_id' => 'required|exists:missing_persons,id',
            'report_message'    => 'required|string',
        ]);

        $report = Report::create($validated);
        return response()->json($report, 201);
    }

    /**
     * Đóng báo cáo
     ** Xóa báo cáo sau khi đã được Admin xử lý.
     * @authenticated
     * @urlParam id int required ID của báo cáo. Example: 1
     */
    public function destroy($id)
    {
        $report = Report::findOrFail($id);
        $report->delete();
        return response()->json(['message' => 'Đã đóng báo cáo']);
    }
}