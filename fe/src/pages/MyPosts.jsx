import React, { useEffect, useState } from "react";
import personApi from "../api/personApi";
import {
  MessageCircle,
  Phone,
  Calendar,
  MapPin,
  Edit3,
  Loader2,
  Mail,
  X,
  Save,
} from "lucide-react";
import toast from "react-hot-toast";

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // States cho Edit Modal
  const [editingPost, setEditingPost] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchMyPosts = async (isMounted = true) => {
    try {
      const data = await personApi.getMyPosts();
      if (isMounted) setPosts(data || []);
    } catch (error) {
      console.error("Lỗi khi tải danh sách bài viết:", error);
      if (isMounted) toast.error("Lỗi khi tải danh sách bài viết");
    } finally {
      if (isMounted) setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetchMyPosts(isMounted);
    return () => {
      isMounted = false;
    };
  }, []);

  // Hàm xử lý lưu chỉnh sửa
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await personApi.update(editingPost.id, editingPost);
      toast.success("Cập nhật hồ sơ thành công!");
      setEditingPost(null);
      fetchMyPosts(true);
    } catch (error) {
      console.error("Lỗi khi cập nhật hồ sơ:", error);
      toast.error("Lỗi khi cập nhật hồ sơ");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangeEdit = (e) => {
    const { name, value } = e.target;
    setEditingPost((prev) => ({ ...prev, [name]: value }));
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-blue-600">
        <Loader2 className="animate-spin" size={40} />
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-black mb-8 flex items-center text-blue-800 uppercase tracking-tight">
        <MessageCircle className="mr-3" /> Quản lý tin đăng của tôi
      </h1>

      {posts.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 text-gray-400">
          Bạn chưa đăng tin tìm kiếm nào.
        </div>
      ) : (
        <div className="space-y-8">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Header bài đăng */}
              <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-4 bg-gray-50/50 border-b">
                <div className="flex items-center gap-5">
                  <img
                    src={
                      post.images?.[0]?.image_url ||
                      "https://via.placeholder.com/100"
                    }
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-sm"
                    alt=""
                  />
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 uppercase">
                      {post.full_name}
                    </h2>
                    <div className="flex items-center gap-3 mt-1">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${post.status === "missing" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}
                      >
                        {post.status === "missing"
                          ? "Đang tìm kiếm"
                          : "Đã tìm thấy"}
                      </span>
                      <span className="text-xs text-gray-400 flex items-center">
                        <MapPin size={12} className="mr-1" />{" "}
                        {post.last_seen_location}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Nút Sửa: Đã thêm sự kiện onClick */}
                <button
                  onClick={() => setEditingPost(post)}
                  className="flex items-center gap-2 px-6 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 font-bold hover:bg-blue-50 hover:text-blue-600 transition"
                >
                  <Edit3 size={18} /> Chỉnh sửa tin
                </button>
              </div>

              {/* Danh sách manh mối */}
              <div className="p-6">
                <h3 className="text-xs font-black text-gray-400 mb-5 uppercase tracking-widest flex items-center">
                  Manh mối mới nhận được ({post.sightings?.length || 0})
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {post.sightings && post.sightings.length > 0 ? (
                    post.sightings.map((s) => (
                      <div
                        key={s.id}
                        className="p-5 rounded-2xl bg-blue-50/50 border border-blue-100 flex flex-col"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-[10px] font-black text-blue-700 bg-white px-2 py-1 rounded-lg shadow-sm border border-blue-50">
                            📍 {s.location}
                          </span>
                          <span className="text-[10px] text-gray-400 flex items-center italic">
                            <Calendar size={10} className="mr-1" />{" "}
                            {s.sighting_date}
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed mb-4 flex-1 italic">
                          "{s.description}"
                        </p>

                        <div className="pt-4 border-t border-blue-100 flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs mr-3">
                              {s.reporter?.name?.charAt(0)}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-gray-800">
                                {s.reporter?.name || "Ẩn danh"}
                              </span>
                              <span className="text-[10px] text-gray-400">
                                Người báo tin
                              </span>
                            </div>
                          </div>

                          {/* Phương thức liên lạc: Ưu tiên Phone rồi đến Email */}
                          <div className="flex items-center">
                            {s.reporter?.phone ? (
                              <a
                                href={`tel:${s.reporter.phone}`}
                                className="flex items-center gap-2 text-xs bg-green-600 text-white px-3 py-2 rounded-xl hover:bg-green-700 transition font-bold uppercase shadow-sm"
                              >
                                <Phone size={14} /> Gọi
                              </a>
                            ) : s.reporter?.email ? (
                              <a
                                href={`mailto:${s.reporter.email}`}
                                className="flex items-center gap-2 text-xs bg-blue-600 text-white px-3 py-2 rounded-xl hover:bg-blue-700 transition font-bold uppercase shadow-sm"
                              >
                                <Mail size={14} /> Email
                              </a>
                            ) : (
                              <span className="text-[10px] text-gray-400">
                                Không có liên lạc
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 py-10 text-center text-gray-400 text-sm italic bg-gray-50 rounded-2xl border border-dashed text-gray-400">
                      Hiện chưa có manh mối nào cho hồ sơ này.
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- MODAL EDIT POST (Giống Admin) --- */}
      {editingPost && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative my-8 animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setEditingPost(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
            >
              <X size={24} />
            </button>
            <h3 className="text-2xl font-bold mb-6 flex items-center text-gray-800 border-b pb-2">
              <Edit3 className="mr-2 text-orange-500" /> Chỉnh sửa hồ sơ
            </h3>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    Họ tên
                  </label>
                  <input
                    name="full_name"
                    type="text"
                    className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-orange-200"
                    required
                    value={editingPost.full_name || ""}
                    onChange={handleChangeEdit}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    Giới tính
                  </label>
                  <select
                    name="gender"
                    className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-orange-200"
                    value={editingPost.gender || "male"}
                    onChange={handleChangeEdit}
                  >
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    Ngày sinh
                  </label>
                  <input
                    name="birth_date"
                    type="date"
                    className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-orange-200"
                    value={editingPost.birth_date || ""}
                    onChange={handleChangeEdit}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    Ngày thấy cuối cùng
                  </label>
                  <input
                    name="last_seen_date"
                    type="date"
                    className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-orange-200"
                    required
                    value={editingPost.last_seen_date || ""}
                    onChange={handleChangeEdit}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Địa điểm thấy cuối
                </label>
                <input
                  name="last_seen_location"
                  type="text"
                  className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-orange-200"
                  required
                  value={editingPost.last_seen_location || ""}
                  onChange={handleChangeEdit}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Trạng thái hồ sơ
                </label>
                <select
                  name="status"
                  className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-orange-200 font-bold"
                  value={editingPost.status || "missing"}
                  onChange={handleChangeEdit}
                >
                  <option value="missing" className="text-red-500">
                    Đang tìm kiếm (Missing)
                  </option>
                  <option value="found" className="text-green-500">
                    Đã tìm thấy (Found)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Mô tả đặc điểm
                </label>
                <textarea
                  name="description"
                  className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-orange-200 h-24"
                  value={editingPost.description || ""}
                  onChange={handleChangeEdit}
                ></textarea>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingPost(null)}
                  className="flex-1 bg-gray-100 text-gray-600 font-bold py-2 rounded-lg hover:bg-gray-200 transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-[2] bg-orange-500 text-white font-bold py-2 rounded-lg hover:bg-orange-600 transition shadow-md disabled:bg-orange-300 flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <Save size={18} />
                  )}
                  Cập nhật hồ sơ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPosts;
