import React, { useEffect, useState } from "react";
import userApi from "../../api/userApi";
import toast from "react-hot-toast";
import { Users, UserX, Loader2, Edit, Search, X, Phone } from "lucide-react"; // Thêm icon Phone

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // States bộ lọc
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // States Edit tại chỗ
  const [editingUser, setEditingUser] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const loadData = async (isMounted = true) => {
    try {
      const data = await userApi.getAllUsers();
      if (isMounted) setUsers(data || []);
    } catch {
      toast.error("Lỗi khi tải danh sách người dùng");
    } finally {
      if (isMounted) setIsLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    loadData(active);
    return () => {
      active = false;
    };
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa người dùng này?")) return;
    try {
      await userApi.deleteUser(id);
      toast.success("Xóa thành công");
      loadData();
    } catch {
      toast.error("Không thể xóa người dùng này");
    }
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // Gửi toàn bộ object editingUser (bao gồm name, role, phone) lên Backend
      await userApi.updateUser(editingUser.id, editingUser);
      toast.success("Cập nhật thông tin người dùng thành công");
      setEditingUser(null);
      loadData();
    } catch {
      toast.error("Cập nhật thất bại");
    } finally {
      setIsSaving(false);
    }
  };

  // Logic lọc kết hợp (Thêm tìm kiếm theo cả số điện thoại nếu muốn)
  const filteredUsers = users.filter((u) => {
    const matchText =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.phone && u.phone.includes(searchTerm)); // Tìm theo số điện thoại
    const matchRole = roleFilter === "all" ? true : u.role === roleFilter;
    return matchText && matchRole;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 text-blue-600">
        <Loader2 className="animate-spin" size={40} />
      </div>
    );
  }

  return (
    <div className="p-6 relative">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold flex items-center text-blue-700">
          <Users className="mr-2" /> Quản lý người dùng
        </h2>

        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <select
            className="border p-2 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-200"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">Mọi vai trò</option>
            <option value="user">User thường</option>
            <option value="admin">Admin</option>
          </select>

          <div className="relative w-full md:w-72">
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Tìm tên, email hoặc số ĐT..."
              className="w-full pl-10 pr-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold">
            <tr>
              <th className="p-4 border-b">Tên người dùng</th>
              <th className="p-4 border-b">Thông tin liên hệ</th>
              <th className="p-4 border-b text-center">Vai trò</th>
              <th className="p-4 border-b text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-blue-50/30 transition">
                  <td className="p-4 font-medium text-gray-800">{user.name}</td>
                  <td className="p-4">
                    <div className="text-sm text-gray-600">{user.email}</div>
                    <div className="text-xs text-gray-400 italic">
                      {user.phone || "Chưa cập nhật SĐT"}
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {user.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => setEditingUser(user)}
                        className="text-orange-400 hover:text-orange-600 transition p-1"
                        title="Sửa thông tin"
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-400 hover:text-red-600 transition p-1"
                        title="Xóa User"
                      >
                        <UserX size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="p-10 text-center text-gray-400 italic"
                >
                  Không tìm thấy người dùng phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- MODAL EDIT USER TẠI CHỖ --- */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setEditingUser(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
            >
              <X size={24} />
            </button>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Edit className="mr-2 text-blue-600" /> Sửa thông tin User
            </h3>

            <form onSubmit={handleSaveUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên hiển thị
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-200 outline-none"
                  required
                  value={editingUser.name}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, name: e.target.value })
                  }
                />
              </div>

              {/* TRƯỜNG PHONE MỚI THÊM */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-200 outline-none"
                  placeholder="Nhập số điện thoại..."
                  value={editingUser.phone || ""}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, phone: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email (Chỉ đọc)
                </label>
                <input
                  type="email"
                  className="w-full p-2 border rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed outline-none"
                  value={editingUser.email}
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cấp quyền (Role)
                </label>
                <select
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-200 outline-none"
                  value={editingUser.role}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, role: e.target.value })
                  }
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={isSaving}
                className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition mt-4"
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

export default UserManager;
