import { useEffect, useState } from "react";
import api from "./utils/api";

function App() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [editingId, setEditingId] = useState(null);
  
  // State quản lý trạng thái tải dữ liệu
  const [isLoading, setIsLoading] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true); // Bật loading
    try {
      const res = await api.get("/user");
      setUsers(res.data);
    } catch (err) {
      console.error("Lỗi khi tải danh sách:", err);
    } finally {
      setIsLoading(false); // Tắt loading dù thành công hay thất bại
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Bật loading khi bắt đầu lưu
    
    try {
      if (editingId) {
        await api.put(`/user/${editingId}`, formData);
      } else {
        await api.post("/user", formData);
      }
      setFormData({ name: "", email: "" });
      setEditingId(null);
      await fetchUsers(); // Đợi tải lại danh sách mới xong
    } catch (error) {
      console.error("Lỗi khi lưu dữ liệu:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại.");
      setIsLoading(false); // Tắt loading nếu có lỗi (vì fetchUsers sẽ không chạy tới)
    }
  };

  const handleEditClick = (user) => {
    setFormData({ name: user.name, email: user.email });
    setEditingId(user.id);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      setIsLoading(true); // Bật loading khi đang xóa
      try {
        await api.delete(`/user/${id}`);
        await fetchUsers(); // Tải lại danh sách sau khi xóa
      } catch (error) {
        console.error("Lỗi khi xóa:", error);
        setIsLoading(false);
      }
    }
  };

  const handleCancelEdit = () => {
    setFormData({ name: "", email: "" });
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 font-sans relative">
      
      {/* Màn hình Loading Overlay (Chỉ hiện khi isLoading === true) */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center backdrop-blur-sm transition-opacity">
          <div className="bg-white p-5 rounded-lg shadow-xl flex flex-col items-center">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-3 text-gray-700 font-medium">Đang xử lý...</p>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Quản lý Người Dùng
        </h2>

        {/* Khối Form Thêm/Sửa */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            {editingId ? "✏️ Sửa thông tin" : "➕ Thêm người dùng mới"}
          </h3>
          
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Nhập tên..."
              />
            </div>
            
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Nhập email..."
              />
            </div>
            
            <div className="flex gap-2 w-full md:w-auto">
              <button 
                type="submit" 
                className="w-full md:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow transition duration-200"
              >
                {editingId ? "Lưu thay đổi" : "Thêm mới"}
              </button>
              
              {editingId && (
                <button 
                  type="button" 
                  onClick={handleCancelEdit} 
                  className="w-full md:w-auto px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg shadow transition duration-200"
                >
                  Hủy
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Khối Bảng Danh sách */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700 uppercase text-sm font-semibold">
                  <th className="p-4 border-b border-gray-200">ID</th>
                  <th className="p-4 border-b border-gray-200">Tên</th>
                  <th className="p-4 border-b border-gray-200">Email</th>
                  <th className="p-4 border-b border-gray-200 text-center w-40">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition duration-150">
                      <td className="p-4 text-gray-600">{user.id}</td>
                      <td className="p-4 font-medium text-gray-800">{user.name}</td>
                      <td className="p-4 text-gray-600">{user.email}</td>
                      <td className="p-4 flex justify-center gap-2">
                        <button 
                          onClick={() => handleEditClick(user)} 
                          className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded transition duration-200 shadow-sm"
                        >
                          Sửa
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(user.id)} 
                          className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded transition duration-200 shadow-sm"
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-gray-500">
                      Chưa có dữ liệu người dùng.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;