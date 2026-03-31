import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  AlertOctagon,
  ArrowLeft,
  FileText,
} from "lucide-react";

const AdminSidebar = () => {
  const menuItems = [
    {
      path: "/admin",
      icon: <LayoutDashboard size={20} />,
      label: "Thống kê tổng",
    },
    { path: "/admin/users", icon: <Users size={20} />, label: "Người dùng" },
    {
      path: "/admin/reports",
      icon: <AlertOctagon size={20} />,
      label: "Báo cáo vi phạm",
    },
    {
      path: "/admin/posts",
      icon: <FileText size={20} />,
      label: "Bài đăng tìm người",
    },
  ];

  return (
    <div className="w-64 bg-white h-screen border-r flex flex-col">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/admin"}
            className={({ isActive }) =>
              `flex items-center space-x-3 p-3 rounded-xl transition ${
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`
            }
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t">
        <NavLink
          to="/"
          className="flex items-center space-x-3 p-3 text-gray-500 hover:text-blue-600"
        >
          <ArrowLeft size={20} />
          <span>Về trang chủ</span>
        </NavLink>
      </div>
    </div>
  );
};

export default AdminSidebar;
