import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import authApi from "../api/authApi";
import toast from "react-hot-toast";
import { UserPlus } from "lucide-react";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await authApi.register(formData);
      toast.success("Đăng ký thành công! Hãy đăng nhập.");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.email?.[0] || "Đăng ký thất bại");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleRegister}
        className="p-8 bg-white shadow-md rounded-lg w-96"
      >
        <div className="flex justify-center mb-4 text-green-600">
          <UserPlus size={48} />
        </div>
        <h2 className="text-2xl font-bold mb-6 text-center">
          Đăng ký tài khoản
        </h2>
        <input
          type="text"
          placeholder="Họ tên"
          className="w-full p-2 mb-4 border rounded"
          required
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-4 border rounded"
          required
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Mật khẩu (ít nhất 6 ký tự)"
          className="w-full p-2 mb-4 border rounded"
          required
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Số điện thoại"
          className="w-full p-2 mb-6 border rounded"
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
        >
          Đăng ký
        </button>
        <p className="mt-4 text-center">
          Đã có tài khoản?{" "}
          <Link to="/login" className="text-blue-500">
            Đăng nhập
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
