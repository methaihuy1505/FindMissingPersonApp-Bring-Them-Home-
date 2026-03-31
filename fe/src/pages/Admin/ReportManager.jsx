import React, { useEffect, useState, useCallback } from "react";
import sightingApi from "../../api/sightingApi";
import toast from "react-hot-toast";
import { ShieldAlert, Trash2, Search, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const ReportManager = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  const fetchReports = useCallback(async (isMounted) => {
    try {
      const data = await sightingApi.getAllReports();
      if (isMounted) {
        setReports(data || []);
      }
    } catch {
      if (isMounted) toast.error("Không thể tải danh sách báo cáo");
    } finally {
      if (isMounted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    fetchReports(isMounted);
    return () => {
      isMounted = false;
    };
  }, [fetchReports]);

  const handleDeleteReport = async (id) => {
    if (!window.confirm("Xác nhận xóa báo cáo này?")) return;
    try {
      await sightingApi.deleteReport(id);
      toast.success("Đã xóa báo cáo");
      fetchReports(true);
    } catch {
      toast.error("Không thể xóa báo cáo");
    }
  };

  // Lọc dữ liệu theo tên người báo hoặc tên người bị báo cáo
  const filtered = reports.filter(
    (r) =>
      r.user?.name?.toLowerCase().includes(filter.toLowerCase()) ||
      r.missing_person?.full_name?.toLowerCase().includes(filter.toLowerCase()),
  );

  if (loading)
    return <div className="p-6 text-center">Đang tải dữ liệu...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold flex items-center text-red-700">
          <ShieldAlert className="mr-2" /> Quản lý báo cáo vi phạm
        </h2>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Lọc báo cáo..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-red-200"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="p-4 font-bold border-b">Người báo cáo</th>
              <th className="p-4 font-bold border-b">Nội dung tố cáo</th>
              <th className="p-4 font-bold border-b">Hồ sơ liên quan</th>
              <th className="p-4 font-bold border-b text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50 transition border-b">
                  <td className="p-4">
                    <div className="font-bold text-gray-800">
                      {r.user?.name || "N/A"}
                    </div>
                    <div className="text-xs text-gray-400">
                      ID: #{r.user_id}
                    </div>
                  </td>
                  <td className="p-4 text-red-600 italic font-medium">
                    "{r.report_message}"
                  </td>
                  <td className="p-4">
                    <Link
                      to={`/person/${r.missing_person_id}`}
                      className="text-blue-600 hover:underline flex items-center font-bold"
                    >
                      {r.missing_person?.full_name ||
                        `ID: ${r.missing_person_id}`}
                      <ExternalLink size={14} className="ml-1" />
                    </Link>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleDeleteReport(r.id)}
                      className="p-2 bg-red-50 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="p-10 text-center text-gray-400 italic"
                >
                  Không tìm thấy báo cáo nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportManager;
