import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router-dom";
// Import Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PersonDetail from "./pages/PersonDetail";
import CreatePost from "./pages/CreatePost";
import AdminDashboard from "./pages/Admin/Dashboard";
import ReportManager from "./pages/Admin/ReportManager";
import UserManager from "./pages/Admin/UserManager";
import PostManager from "./pages/Admin/PostManager";
import Navbar from "./components/Layout/Navbar";
import AdminSidebar from "./components/Layout/AdminSidebar";
import MyPosts from "./pages/MyPosts";
import Profile from "./pages/Profile";

// 1. Chỉ cho người đã đăng nhập vào (User & Admin)
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("access_token");
  return token ? children : <Navigate to="/login" />;
};

// 2. Chỉ cho Admin vào
const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("access_token");
  const role = localStorage.getItem("user_role");
  return token && role === "admin" ? children : <Navigate to="/" />;
};

function App() {
  return (
    <Router>
      {/* Thông báo Toast hiện ở mọi trang */}
      <Toaster position="top-right" reverseOrder={false} />
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* ================= PUBLIC ROUTES ================= */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/person/:id" element={<PersonDetail />} />

          {/* ================= USER ROUTES (Yêu cầu Token) ================= */}
          <Route
            path="/create-post"
            element={
              <PrivateRoute>
                <CreatePost />
              </PrivateRoute>
            }
          />
          <Route
            path="/my-posts"
            element={
              <PrivateRoute>
                <MyPosts />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          {/* ================= ADMIN ROUTES (Yêu cầu Admin Role) ================= */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <div className="flex">
                  <AdminSidebar /> {/* Menu bên trái */}
                  <div className="flex-1">
                    <Outlet /> {/* Nơi hiển thị Dashboard/Users/Reports */}
                  </div>
                </div>
              </AdminRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="reports" element={<ReportManager />} />
            <Route path="users" element={<UserManager />} />
            <Route path="posts" element={<PostManager />} />
          </Route>

          {/* Điều hướng mặc định nếu gõ sai URL */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
