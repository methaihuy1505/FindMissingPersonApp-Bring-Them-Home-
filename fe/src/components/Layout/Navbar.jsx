import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, LogOut, PlusCircle, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");
  const role = localStorage.getItem("user_role");

  const handleLogout = () => {
    localStorage.clear(); // Xóa sạch Token và Role
    toast.success("Đã đăng xuất");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center space-x-2 text-blue-600 font-bold text-xl"
        >
          <Home size={24} />
          <span>BringThemHome</span>
        </Link>

        {/* Menu Items */}
        <div className="flex items-center space-x-6">
          <Link
            to="/"
            className="text-gray-600 hover:text-blue-600 flex items-center"
          >
            Trang chủ
          </Link>

          {token ? (
            <>
              <Link
                to="/create-post"
                className="text-gray-600 hover:text-blue-600 flex items-center"
              >
                <PlusCircle size={18} className="mr-1" /> Đăng tin
              </Link>

              {/* Nút Quản trị dành riêng cho Admin */}
              {role === "admin" && (
                <Link
                  to="/admin"
                  className="text-purple-600 font-medium flex items-center"
                >
                  <ShieldCheck size={18} className="mr-1" /> Quản trị
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="flex items-center text-red-500 hover:bg-red-50 px-3 py-1 rounded-lg transition"
              >
                <LogOut size={18} className="mr-1" /> Thoát
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
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
