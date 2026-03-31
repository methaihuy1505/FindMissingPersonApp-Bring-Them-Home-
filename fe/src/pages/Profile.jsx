import React, { useState, useEffect } from "react";
import authApi from "../api/authApi"; // Sử dụng authApi bạn đã có
import userApi from "../api/userApi"; // Để dùng updateProfile và updatePassword
import toast from "react-hot-toast";
import { User, Phone, Lock, Save, Loader2, KeyRound, Mail } from "lucide-react";

const Profile = () => {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [pwdData, setPwdData] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // DÙNG authApi.getMe() BẠN ĐÃ CÓ
        const res = await authApi.getMe();
        setFormData({
          name: res.name || "",
          email: res.email || "",
          phone: res.phone || "",
        });
        // Cập nhật lại tên vào localStorage để đồng bộ Navbar
        localStorage.setItem("user_name", res.name);
        window.dispatchEvent(new Event("storage"));
      } catch (error) {
        console.error("Lỗi khi tải thông tin người dùng:", error);
        toast.error("Không thể tải thông tin");
      } finally {
        setFetching(false);
      }
    };
    fetchUserData();
  }, []);

  // Hàm lưu thông tin cơ bản
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await userApi.updateProfile(userId, formData);
      toast.success("Cập nhật thành công!");
      localStorage.setItem("user_name", formData.name);
      window.dispatchEvent(new Event("storage"));
    } catch (error) {
        console.error("Lỗi khi cập nhật hồ sơ:", error);
      toast.error("Lỗi cập nhật");
    } finally {
      setLoading(false);
    }
  };

  // Hàm đổi mật khẩu (Dùng API updatePassword bên userApi)
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (pwdData.new_password !== pwdData.new_password_confirmation) {
      return toast.error("Mật khẩu xác nhận không khớp!");
    }
    setLoading(true);
    try {
      await userApi.updatePassword(userId, pwdData);
      toast.success("Đổi mật khẩu thành công!");
      setPwdData({
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Mật khẩu hiện tại sai");
    } finally {
      setLoading(false);
    }
  };

  if (fetching)
    return (
      <div className="p-20 text-center italic text-gray-400">
        <Loader2 className="animate-spin inline mr-2" /> Đang tải dữ liệu...
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-6 mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* FORM THÔNG TIN CƠ BẢN */}
      <div className="bg-white p-8 shadow-xl rounded-3xl border border-gray-100">
        <h2 className="text-xl font-black mb-6 text-gray-800 flex items-center uppercase">
          <User className="mr-2 text-blue-600" /> Hồ sơ cá nhân
        </h2>
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <input
            type="text"
            placeholder="Họ tên"
            className="w-full p-3 bg-gray-50 rounded-xl outline-none border"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 bg-gray-50 rounded-xl outline-none border text-gray-500"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Số điện thoại"
            className="w-full p-3 bg-gray-50 rounded-xl outline-none border"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold flex justify-center items-center"
          >
            {loading ? (
              <Loader2 className="animate-spin mr-2" />
            ) : (
              <Save className="mr-2" size={18} />
            )}{" "}
            Lưu thay đổi
          </button>
        </form>
      </div>

      {/* FORM ĐỔI MẬT KHẨU */}
      <div className="bg-white p-8 shadow-xl rounded-3xl border border-gray-100">
        <h2 className="text-xl font-black mb-6 text-gray-800 flex items-center uppercase">
          <KeyRound className="mr-2 text-orange-500" /> Bảo mật
        </h2>
        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <input
            type="password"
            placeholder="Mật khẩu hiện tại"
            className="w-full p-3 bg-gray-50 rounded-xl outline-none border"
            value={pwdData.current_password}
            onChange={(e) =>
              setPwdData({ ...pwdData, current_password: e.target.value })
            }
            required
          />
          <input
            type="password"
            placeholder="Mật khẩu mới"
            className="w-full p-3 bg-gray-50 rounded-xl outline-none border"
            value={pwdData.new_password}
            onChange={(e) =>
              setPwdData({ ...pwdData, new_password: e.target.value })
            }
            required
          />
          <input
            type="password"
            placeholder="Xác nhận mật khẩu mới"
            className="w-full p-3 bg-gray-50 rounded-xl outline-none border"
            value={pwdData.new_password_confirmation}
            onChange={(e) =>
              setPwdData({
                ...pwdData,
                new_password_confirmation: e.target.value,
              })
            }
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold"
          >
            Cập nhật mật khẩu
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
