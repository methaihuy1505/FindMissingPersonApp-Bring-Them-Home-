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
} from "lucide-react";

const PersonDetail = () => {
  const { id } = useParams();
  const [person, setPerson] = useState(null);
  const [sightings, setSightings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false); // Chống double submit

  const [sightingForm, setSightingForm] = useState({
    location: "",
    description: "",
    sighting_date: "",
  });

  // Sử dụng useCallback để đóng gói logic tải dữ liệu, tránh tạo lại hàm liên tục
  const loadAllData = useCallback(
    async (isMounted) => {
      try {
        const [pData, sData] = await Promise.all([
          personApi.getDetail(id),
          sightingApi.getByPerson(id),
        ]);

        if (isMounted) {
          // Gộp các setState vào một lượt cập nhật duy nhất
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

    // Tách biệt việc gọi dữ liệu khỏi luồng render chính của useEffect
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

    // Kiểm tra token và trạng thái đang gửi
    if (!localStorage.getItem("access_token"))
      return toast.error("Vui lòng đăng nhập");
    if (isSubmitting) return;

    setIsSubmitting(true); // Khóa nút bấm ngay lập tức

    try {
      await sightingApi.create({
        ...sightingForm,
        missing_person_id: id,
        reported_by: localStorage.getItem("user_id"),
      });

      toast.success("Cảm ơn bạn đã cung cấp manh mối!");
      setSightingForm({ location: "", description: "", sighting_date: "" });

      // Tải lại dữ liệu sau khi gửi thành công mà không dùng setTimeout
      await loadAllData(true);
    } catch {
      toast.error("Gửi thất bại");
    } finally {
      setIsSubmitting(false); // Mở khóa nút bấm
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
    <div className="max-w-5xl mx-auto p-6">
      <button
        onClick={handleReport}
        className="flex items-center text-red-500 text-sm hover:underline ml-auto mb-4"
      >
        <AlertCircle size={16} className="mr-1" /> Báo cáo vi phạm
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <img
          src={
            person?.images?.[0]?.image_url || "https://via.placeholder.com/400"
          }
          className="rounded-xl w-full h-[400px] object-cover shadow-md"
          alt={person?.full_name}
        />
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl font-extrabold mb-2 text-gray-900">
            {person?.full_name}
          </h1>
          <div
            className={`inline-block w-fit px-3 py-1 rounded-full text-xs font-bold mb-6 ${
              person?.status === "missing"
                ? "bg-red-100 text-red-600"
                : "bg-green-100 text-green-600"
            }`}
          >
            {person?.status === "missing" ? "ĐANG TÌM KIẾM" : "ĐÃ TÌM THẤY"}
          </div>

          <div className="space-y-4 text-gray-700 text-lg">
            <p>
              <strong>Giới tính:</strong>{" "}
              {person?.gender === "male" ? "Nam" : "Nữ"}
            </p>
            <p className="flex items-start">
              <MapPin size={20} className="mr-2 text-blue-500 mt-1" />
              <span>
                <strong>Vị trí cuối:</strong> {person?.last_seen_location}
              </span>
            </p>
            <div className="mt-6 p-4 bg-gray-50 rounded-xl border-l-4 border-gray-200 italic text-gray-600">
              "{person?.description || "Không có mô tả."}"
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
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

        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 h-fit">
          <h2 className="text-xl font-bold mb-4 flex items-center text-gray-800">
            <Send size={20} className="mr-2 text-blue-600" /> Gửi manh mối mới
          </h2>
          <form onSubmit={handleSightingSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Địa điểm thấy?"
              className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              required
              value={sightingForm.location}
              onChange={(e) =>
                setSightingForm({ ...sightingForm, location: e.target.value })
              }
            />
            <input
              type="date"
              className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              required
              value={sightingForm.sighting_date}
              onChange={(e) =>
                setSightingForm({
                  ...sightingForm,
                  sighting_date: e.target.value,
                })
              }
            />
            <textarea
              placeholder="Mô tả đặc điểm..."
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
                  : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100"
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
