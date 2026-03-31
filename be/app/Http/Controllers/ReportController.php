<?php
namespace App\Http\Controllers;

use App\Models\Report;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    // Admin lấy danh sách báo cáo
    public function index()
    {
        $reports = Report::with(['user:id,name', 'missingPerson:id,full_name'])->get();
        return response()->json($reports);
    }

    // Người dùng gửi báo cáo
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

    // Xóa báo cáo sau khi đã xử lý
    public function destroy($id)
    {
        $report = Report::findOrFail($id);
        $report->delete();
        return response()->json(['message' => 'Đã đóng báo cáo']);
    }
}