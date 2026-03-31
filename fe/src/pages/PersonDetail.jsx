import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import personApi from "../api/personApi";
import sightingApi from "../api/sightingApi";
import toast from "react-hot-toast";
import {
  Calendar,
  User,
  AlertCircle,
  Send,
  MapPin,
  Loader2,
  Phone,
  Clock,
  Info,
} from "lucide-react";

const PersonDetail = () => {
  const { id } = useParams();
  const [person, setPerson] = useState(null);
  const [sightings, setSightings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [sightingForm, setSightingForm] = useState({
    location: "",
    description: "",
    sighting_date: "",
  });

  // Lấy ngày hiện tại định dạng YYYY-MM-DD để chặn chọn ngày tương lai
  const today = new Date().toISOString().split("T")[0];

  const loadAllData = useCallback(
    async (isMounted) => {
      try {
        const [pData, sData] = await Promise.all([
          personApi.getDetail(id),
          sightingApi.getByPerson(id),
        ]);

        if (isMounted) {
          setPerson(pData);
          setSightings(sData || []);
          setLoading(false);
        }
      } catch {
        if (isMounted) {
          toast.error("Không thể tải thông tin");
          setLoading(false);
        }
      }
    },
    [id],
  );

  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      await loadAllData(isMounted);
    };
    init();
    return () => {
      isMounted = false;
    };
  }, [loadAllData]);

  const handleSightingSubmit = async (e) => {
    e.preventDefault();
    if (!localStorage.getItem("access_token"))
      return toast.error("Vui lòng đăng nhập");
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await sightingApi.create({
        ...sightingForm,
        missing_person_id: id,
        reported_by: localStorage.getItem("user_id"),
      });

      toast.success("Cảm ơn bạn đã cung cấp manh mối!");
      setSightingForm({ location: "", description: "", sighting_date: "" });
      await loadAllData(true);
    } catch {
      toast.error("Gửi thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReport = async () => {
    const msg = window.prompt("Lý do bạn muốn báo cáo?");
    if (!msg) return;
    try {
      await sightingApi.sendReport({
        missing_person_id: id,
        user_id: localStorage.getItem("user_id"),
        report_message: msg,
      });
      toast.success("Đã gửi báo cáo");
    } catch {
      toast.error("Gửi báo cáo thất bại");
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center p-20 text-blue-600">
        <Loader2 className="animate-spin mb-2" size={40} />
        <span>Đang tải thông tin...</span>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Nút báo cáo */}
      <button
        onClick={handleReport}
        className="flex items-center text-red-500 text-sm hover:underline ml-auto mb-4"
      >
        <AlertCircle size={16} className="mr-1" /> Báo cáo vi phạm
      </button>

      {/* Thông tin chi tiết hồ sơ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="relative">
          <img
            src={
              person?.images?.[0]?.image_url ||
              "https://via.placeholder.com/400"
            }
            className="rounded-xl w-full h-[450px] object-cover shadow-md"
            alt={person?.full_name}
          />
          <div
            className={`absolute top-4 left-4 px-4 py-1.5 rounded-full text-xs font-bold shadow-md ${
              person?.status === "missing"
                ? "bg-red-600 text-white"
                : "bg-green-600 text-white"
            }`}
          >
            {person?.status === "missing" ? "ĐANG TÌM KIẾM" : "ĐÃ TÌM THẤY"}
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <h1 className="text-4xl font-extrabold mb-2 text-gray-900 uppercase">
            {person?.full_name}
          </h1>

          <div className="flex items-center text-blue-600 mb-6 font-medium text-sm">
            <Info size={16} className="mr-1" /> Người đăng:{" "}
            {person?.creator?.name || "Thành viên"}
          </div>

          <div className="space-y-4 text-gray-700 text-lg">
            <div className="flex items-center bg-gray-50 p-3 rounded-xl">
              <User size={20} className="mr-3 text-blue-500" />
              <span>
                <strong>Giới tính:</strong>{" "}
                {person?.gender === "male"
                  ? "Nam"
                  : person?.gender === "female"
                    ? "Nữ"
                    : "Khác"}
                <span className="mx-2 text-gray-300">|</span>
                <strong>Ngày sinh:</strong> {person?.birth_date || "Không rõ"}
              </span>
            </div>

            <div className="flex items-center bg-red-50 p-3 rounded-xl border-l-4 border-red-400">
              <Clock size={20} className="mr-3 text-red-500" />
              <span>
                <strong>Mất tích từ ngày:</strong> {person?.last_seen_date}
              </span>
            </div>

            <div className="flex items-center bg-gray-50 p-3 rounded-xl">
              <MapPin size={20} className="mr-3 text-blue-500" />
              <span>
                <strong>Vị trí cuối:</strong> {person?.last_seen_location}
              </span>
            </div>

            <div className="mt-6 p-4 bg-yellow-50/50 rounded-xl border border-yellow-100 italic text-gray-700 leading-relaxed">
              <p className="text-xs font-bold text-yellow-600 uppercase mb-1">
                Mô tả đặc điểm:
              </p>
              "{person?.description || "Không có mô tả chi tiết."}"
            </div>

            {person?.creator?.phone && (
              <div className="flex items-center text-green-600 font-bold text-sm mt-2">
                <Phone size={16} className="mr-2" /> Liên hệ khẩn cấp:{" "}
                {person.creator.phone}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Phần Manh mối & Gửi manh mối */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
        {/* Danh sách manh mối */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Manh mối cộng đồng
          </h2>
          <div className="space-y-4">
            {sightings.length > 0 ? (
              sightings.map((s) => (
                <div
                  key={s.id}
                  className="p-4 border-l-4 border-blue-500 bg-white shadow-sm rounded-r-lg transition hover:shadow-md"
                >
                  <p className="font-semibold text-blue-700">{s.location}</p>
                  <p className="text-gray-600 mt-1">{s.description}</p>
                  <div className="flex items-center text-xs text-gray-400 mt-3 italic">
                    <Calendar size={14} className="mr-1" /> {s.sighting_date}
                    <User size={14} className="ml-4 mr-1" />{" "}
                    {s.reporter?.name || "Người dùng"}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-10 border-2 border-dashed border-gray-200 rounded-xl text-center text-gray-400 italic">
                Chưa có manh mối nào cho hồ sơ này.
              </div>
            )}
          </div>
        </div>

        {/* Form gửi manh mối */}
        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 h-fit">
          <h2 className="text-xl font-bold mb-4 flex items-center text-gray-800">
            <Send size={20} className="mr-2 text-blue-600" /> Gửi manh mối mới
          </h2>
          <form onSubmit={handleSightingSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Địa điểm bạn nhìn thấy họ?"
              className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              required
              value={sightingForm.location}
              onChange={(e) =>
                setSightingForm({ ...sightingForm, location: e.target.value })
              }
            />
            <div>
              <label className="text-xs text-gray-400 ml-1 mb-1 block uppercase font-bold">
                Ngày nhìn thấy
              </label>
              <input
                type="date"
                className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                required
                max={today} // KHÔNG CHO CHỌN NGÀY TƯƠNG LAI
                value={sightingForm.sighting_date}
                onChange={(e) =>
                  setSightingForm({
                    ...sightingForm,
                    sighting_date: e.target.value,
                  })
                }
              />
            </div>
            <textarea
              placeholder="Mô tả đặc điểm trang phục, hướng di chuyển..."
              className="w-full p-3 border rounded-xl h-28 outline-none focus:ring-2 focus:ring-blue-500"
              required
              value={sightingForm.description}
              onChange={(e) =>
                setSightingForm({
                  ...sightingForm,
                  description: e.target.value,
                })
              }
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 rounded-xl font-bold transition shadow-lg ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {isSubmitting ? "Đang xử lý..." : "Xác nhận báo manh mối"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PersonDetail;
