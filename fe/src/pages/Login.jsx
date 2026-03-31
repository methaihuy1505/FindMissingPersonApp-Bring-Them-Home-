import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import authApi from "../api/authApi";
import toast from "react-hot-toast";
import { LogIn } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await authApi.login({ email, password });
      // Lưu Token và Role vào LocalStorage theo thiết kế App.jsx
      localStorage.setItem("access_token", response.access_token);
      localStorage.setItem("user_role", response.user.role);
      localStorage.setItem("user_id", response.user.id);
      localStorage.setItem("user_name", response.user.name);
      toast.success("Đăng nhập thành công!");
      // Nếu là admin thì đẩy vào dashboard, ngược lại về trang chủ
      response.user.role === "admin" ? navigate("/admin") : navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.error || "Sai tài khoản hoặc mật khẩu");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="p-8 bg-white shadow-md rounded-lg w-96"
      >
        <div className="flex justify-center mb-4 text-blue-600">
          <LogIn size={48} />
        </div>
        <h2 className="text-2xl font-bold mb-6 text-center">Đăng nhập</h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-4 border rounded"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          className="w-full p-2 mb-6 border rounded"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Đăng nhập
        </button>
        <p className="mt-4 text-center">
          Chưa có tài khoản?{" "}
          <Link to="/register" className="text-blue-500">
            Đăng ký
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
