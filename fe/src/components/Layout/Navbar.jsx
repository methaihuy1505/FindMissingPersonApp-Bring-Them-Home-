import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Home,
  LogOut,
  PlusCircle,
  ShieldCheck,
  User,
  FolderHeart,
} from "lucide-react";
import toast from "react-hot-toast";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");
  const role = localStorage.getItem("user_role");

  // Dùng state để quản lý userName giúp giao diện cập nhật ngay lập tức
  const [name, setName] = useState(localStorage.getItem("user_name"));

  useEffect(() => {
    // Hàm này sẽ chạy mỗi khi trang Profile phát đi tín hiệu "storage"
    const handleStorageChange = () => {
      setName(localStorage.getItem("user_name"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Đã đăng xuất");
    setName(null); // Reset tên trong state
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center space-x-2 text-blue-600 font-bold text-xl uppercase tracking-tighter"
        >
          <Home size={24} />
          <span>BringThemHome</span>
        </Link>

        {/* Menu Items */}
        <div className="flex items-center space-x-5 text-sm font-medium">
          <Link to="/" className="text-gray-600 hover:text-blue-600 transition">
            Trang chủ
          </Link>

          {token ? (
            <>
              <Link
                to="/my-posts"
                className="text-gray-600 hover:text-blue-600 flex items-center transition"
              >
                <FolderHeart size={18} className="mr-1 text-pink-500" /> Tin của
                tôi
              </Link>

              <Link
                to="/create-post"
                className="text-gray-600 hover:text-blue-600 flex items-center transition"
              >
                <PlusCircle size={18} className="mr-1 text-green-500" /> Đăng
                tin
              </Link>

              {/* Link vào Profile - Hiển thị tên từ state */}
              <Link
                to="/profile"
                className="text-gray-600 hover:text-blue-600 flex items-center transition"
              >
                <User size={18} className="mr-1 text-blue-500" />{" "}
                {name && name !== "undefined" ? name : "Cá nhân"}
              </Link>

              {role === "admin" && (
                <Link
                  to="/admin"
                  className="text-purple-600 font-bold flex items-center bg-purple-50 px-3 py-1 rounded-full transition"
                >
                  <ShieldCheck size={18} className="mr-1" /> Quản trị
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="flex items-center text-red-500 hover:bg-red-50 px-3 py-1 rounded-lg transition"
              >
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition shadow-md shadow-blue-100 font-bold"
            >
              Đăng nhập
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
