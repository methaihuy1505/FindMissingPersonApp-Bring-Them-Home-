import React, { useEffect, useState } from "react";
import personApi from "../../api/personApi";
import {
  FileText,
  Trash2,
  CheckCircle,
  Search,
  Eye,
  Loader2,
  Edit,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const PostManager = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // States cho bộ lọc
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // States cho tính năng Edit tại chỗ
  const [editingPost, setEditingPost] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchAllPosts = async (isMounted) => {
    try {
      const data = await personApi.getAll();
      if (isMounted) {
        setPosts(data || []);
      }
    } catch {
      if (isMounted) toast.error("Không thể tải danh sách bài đăng");
    } finally {
      if (isMounted) setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      await fetchAllPosts(isMounted);
    };
    init();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa vĩnh viễn bài đăng này?"))
      return;
    try {
      await personApi.delete(id);
      toast.success("Đã xóa bài đăng");
      fetchAllPosts(true);
    } catch {
      toast.error("Lỗi khi xóa bài");
    }
  };

  const handleUpdateStatus = async (id) => {
    try {
      await personApi.updateStatus(id);
      toast.success("Đã cập nhật trạng thái tìm thấy");
      fetchAllPosts(true);
    } catch {
      toast.error("Cập nhật thất bại");
    }
  };

  // Hàm xử lý lưu khi Edit tại chỗ
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      
      await personApi.update(editingPost.id, editingPost);
      toast.success("Cập nhật bài đăng thành công!");
      setEditingPost(null); // Đóng modal
      fetchAllPosts(true); // Tải lại dữ liệu mới
    } catch {
      toast.error("Lỗi khi cập nhật bài đăng");
    } finally {
      setIsSaving(false);
    }
  };

  // Logic lọc kết hợp Text và Status
  const filteredPosts = posts.filter((p) => {
    const matchText =
      p.full_name?.toLowerCase().includes(filter.toLowerCase()) ||
      p.last_seen_location?.toLowerCase().includes(filter.toLowerCase());
    const matchStatus =
      statusFilter === "all" ? true : p.status === statusFilter;
    return matchText && matchStatus;
  });

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-blue-600">
        <Loader2 className="animate-spin" size={40} />
      </div>
    );

  return (
    <div className="p-6 bg-gray-50 min-h-screen relative">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h2 className="text-2xl font-bold flex items-center text-gray-800">
          <FileText className="mr-2 text-blue-600" /> Quản lý bài đăng tìm người
        </h2>

        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          {/* Lọc theo trạng thái */}
          <select
            className="border p-2 rounded-xl outline-none focus:ring-2 focus:ring-blue-200 shadow-sm bg-white"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="missing">Đang tìm kiếm</option>
            <option value="found">Đã tìm thấy</option>
          </select>

          {/* Ô tìm kiếm */}
          <div className="relative w-full md:w-80">
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Tìm theo tên hoặc địa điểm..."
              className="w-full pl-10 pr-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-200 shadow-sm"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-bold">
            <tr>
              <th className="p-4 border-b">Ảnh</th>
              <th className="p-4 border-b">Thông tin</th>
              <th className="p-4 border-b">Vị trí</th>
              <th className="p-4 border-b text-center">Trạng thái</th>
              <th className="p-4 border-b text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <tr
                  key={post.id}
                  className="hover:bg-blue-50/30 transition border-b"
                >
                  <td className="p-4">
                    <img
                      src={
                        post.images?.[0]?.image_url ||
                        "https://via.placeholder.com/50"
                      }
                      className="w-12 h-12 rounded-lg object-cover border"
                      alt=""
                    />
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-gray-900">
                      {post.full_name}
                    </div>
                    <div className="text-xs text-gray-400">
                      Giới tính: {post.gender === "male" ? "Nam" : "Nữ"}
                    </div>
                  </td>
                  <td className="p-4 text-gray-600 text-sm">
                    {post.last_seen_location}
                  </td>
                  <td className="p-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-extrabold ${post.status === "missing" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}
                    >
                      {post.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center items-center space-x-2">
                      <Link
                        to={`/person/${post.id}`}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-full"
                        title="Xem chi tiết"
                      >
                        <Eye size={18} />
                      </Link>

                      {/* Nút Edit */}
                      <button
                        onClick={() => setEditingPost(post)}
                        className="p-2 text-orange-500 hover:bg-orange-50 rounded-full"
                        title="Sửa bài"
                      >
                        <Edit size={18} />
                      </button>

                      {post.status === "missing" && (
                        <button
                          onClick={() => handleUpdateStatus(post.id)}
                          className="p-2 text-green-500 hover:bg-green-50 rounded-full"
                          title="Đánh dấu đã tìm thấy"
                        >
                          <CheckCircle size={18} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="p-2 text-red-400 hover:bg-red-50 rounded-full"
                        title="Xóa bài"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="p-10 text-center text-gray-400 italic"
                >
                  Không có dữ liệu.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- MODAL EDIT POST TẠI CHỖ --- */}
      {editingPost && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setEditingPost(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
            >
              <X size={24} />
            </button>
            <h3 className="text-2xl font-bold mb-4 flex items-center">
              <Edit className="mr-2 text-orange-500" /> Sửa bài đăng
            </h3>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Họ tên
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-200 outline-none"
                  required
                  value={editingPost.full_name}
                  onChange={(e) =>
                    setEditingPost({
                      ...editingPost,
                      full_name: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nơi nhìn thấy cuối
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-200 outline-none"
                  required
                  value={editingPost.last_seen_location}
                  onChange={(e) =>
                    setEditingPost({
                      ...editingPost,
                      last_seen_location: e.target.value,
                    })
                  }
                />
              </div>
              <button
                type="submit"
                disabled={isSaving}
                className="w-full bg-orange-500 text-white font-bold py-2 rounded-lg hover:bg-orange-600 transition mt-4"
              >
                {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostManager;
