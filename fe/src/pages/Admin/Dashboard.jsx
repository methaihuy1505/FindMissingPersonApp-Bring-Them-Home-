import React, { useEffect, useState } from "react";
import personApi from "../../api/personApi";
import sightingApi from "../../api/sightingApi";
import userApi from "../../api/userApi";
import { Users, FileText, AlertTriangle, CheckCircle } from "lucide-react";

const Dashboard = () => {
  const [stats, setStats] = useState({ users: 0, persons: 0, reports: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [u, p, r] = await Promise.all([
          userApi.getAllUsers(),
          personApi.getAll(),
          sightingApi.getAllReports(),
        ]);
        setStats({
          users: u.length,
          persons: p.length,
          reports: r.length,
        });
      } catch {
        /* Bỏ qua lỗi unused */
      }
    };
    fetchStats();
  }, []);

  const cards = [
    {
      label: "Tổng người dùng",
      value: stats.users,
      icon: <Users />,
      color: "bg-blue-500",
    },
    {
      label: "Hồ sơ tìm người",
      value: stats.persons,
      icon: <FileText />,
      color: "bg-green-500",
    },
    {
      label: "Báo cáo vi phạm",
      value: stats.reports,
      icon: <AlertTriangle />,
      color: "bg-red-500",
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Bảng điều khiển Admin</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`${card.color} text-white p-6 rounded-2xl shadow-lg flex items-center justify-between`}
          >
            <div>
              <p className="text-lg opacity-80">{card.label}</p>
              <h2 className="text-4xl font-bold mt-1">{card.value}</h2>
            </div>
            <div className="p-3 bg-white/20 rounded-full">{card.icon}</div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-blue-50 p-8 rounded-2xl border border-blue-100">
        <h3 className="text-xl font-bold text-blue-800 mb-2">
          Hệ thống sẵn sàng!
        </h3>
        <p className="text-blue-600">
          Bạn đang quản lý hệ thống tìm kiếm người mất tích với đầy đủ quyền hạn
          Admin.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
