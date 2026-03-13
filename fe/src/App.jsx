import { useEffect, useState } from "react";
import api from "./utils/api";

function App() {
  const [users, setUsers] = useState([]);

  // State quản lý dữ liệu form
  const [formData, setFormData] = useState({ name: "", email: "" });

  // State để biết đang ở chế độ "Thêm mới" hay "Cập nhật" (lưu ID nếu đang cập nhật)
  const [editingId, setEditingId] = useState(null);

  // Gộp hàm gọi API lấy danh sách để có thể tái sử dụng sau khi Thêm/Sửa/Xóa
  const fetchUsers = () => {
    api
      .get("/user")
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => console.error("Lỗi khi tải danh sách:", err));
  };

  // Chạy 1 lần khi component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Xử lý khi gõ vào input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Xử lý Thêm mới (Create) hoặc Cập nhật (Update)
  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn form reload lại trang

    try {
      if (editingId) {
        // Nếu có editingId -> Đang ở chế độ Sửa (Cập nhật)
        await api.put(`/user/${editingId}`, formData);
        alert("Cập nhật thành công!");
      } else {
        // Nếu không có -> Đang ở chế độ Thêm mới
        await api.post("/user", formData);
        alert("Thêm mới thành công!");
      }

      // Reset form và state, sau đó gọi lại API để load data mới nhất
      setFormData({ name: "", email: "" });
      setEditingId(null);
      fetchUsers();
    } catch (error) {
      console.error("Lỗi khi lưu dữ liệu:", error);
      alert("Có lỗi xảy ra, vui lòng kiểm tra lại console.");
    }
  };

  // Nút Sửa: Đưa dữ liệu của user lên Form
  const handleEditClick = (user) => {
    setFormData({ name: user.name, email: user.email });
    setEditingId(user.id);
  };

  // Nút Xóa (Delete)
  const handleDeleteClick = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      try {
        await api.delete(`/user/${id}`);
        fetchUsers(); // Load lại danh sách sau khi xóa
      } catch (error) {
        console.error("Lỗi khi xóa:", error);
      }
    }
  };

  // Hủy bỏ việc sửa, quay lại form Thêm mới
  const handleCancelEdit = () => {
    setFormData({ name: "", email: "" });
    setEditingId(null);
  };

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "800px",
        margin: "0 auto",
        fontFamily: "sans-serif",
      }}
    >
      <h2>Quản lý Người Dùng (CRUD)</h2>

      {/* Form Thêm/Sửa */}
      <div
        style={{
          marginBottom: "30px",
          padding: "15px",
          border: "1px solid #ccc",
          borderRadius: "8px",
        }}
      >
        <h3>{editingId ? "Sửa người dùng" : "Thêm người dùng mới"}</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "10px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>
              Tên:
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              style={{ width: "100%", padding: "8px" }}
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>
              Email:
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              style={{ width: "100%", padding: "8px" }}
            />
          </div>

          <button
            type="submit"
            style={{
              padding: "8px 15px",
              background: "#007bff",
              color: "white",
              border: "none",
              cursor: "pointer",
              marginRight: "10px",
            }}
          >
            {editingId ? "Lưu thay đổi" : "Thêm mới"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              style={{
                padding: "8px 15px",
                background: "#6c757d",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              Hủy
            </button>
          )}
        </form>
      </div>

      {/* Danh sách User (Dạng Bảng) */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f4f4f4", textAlign: "left" }}>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>ID</th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Tên</th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Email</th>
            <th
              style={{
                padding: "10px",
                border: "1px solid #ddd",
                width: "150px",
              }}
            >
              Hành động
            </th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id}>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {user.id}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {user.name}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {user.email}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  <button
                    onClick={() => handleEditClick(user)}
                    style={{
                      marginRight: "5px",
                      padding: "5px 10px",
                      cursor: "pointer",
                    }}
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDeleteClick(user.id)}
                    style={{
                      padding: "5px 10px",
                      cursor: "pointer",
                      color: "red",
                    }}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="4"
                style={{
                  padding: "10px",
                  textAlign: "center",
                  border: "1px solid #ddd",
                }}
              >
                Chưa có dữ liệu
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
