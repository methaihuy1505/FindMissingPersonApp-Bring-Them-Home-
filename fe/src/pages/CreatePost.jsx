import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import personApi from "../api/personApi";
import toast from "react-hot-toast";

const CreatePost = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: "",
    gender: "male",
    birth_date: "",
    last_seen_date: "",
    last_seen_location: "",
    description: "",
    status: "missing",
    image_url: "",
    created_by: localStorage.getItem("user_id"),
  });

  // Hàm dùng chung cho tất cả các input để cập nhật state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await personApi.create(formData);
      toast.success("Đăng tin thành công!");
      navigate("/");
    } catch (error) {
      console.error("Lỗi khi đăng tin:", error);
      toast.error("Có lỗi xảy ra, vui lòng kiểm tra lại");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow mt-10 rounded">
      <h2 className="text-2xl font-bold mb-6 text-blue-800">
        Đăng tin tìm người mất tích
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Họ tên */}
        <div>
          <label className="block mb-1 font-medium">
            Họ và tên người mất tích
          </label>
          <input
            name="full_name"
            type="text"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
            required
            value={formData.full_name}
            onChange={handleChange}
          />
        </div>

        {/* Giới tính và Ngày sinh */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Giới tính</label>
            <select
              name="gender"
              className="w-full p-2 border rounded outline-none"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">
              Ngày sinh (nếu biết)
            </label>
            <input
              name="birth_date"
              type="date"
              className="w-full p-2 border rounded outline-none"
              value={formData.birth_date}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Ngày thấy lần cuối và Link ảnh */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Ngày thấy lần cuối</label>
            <input
              name="last_seen_date"
              type="date"
              className="w-full p-2 border rounded outline-none"
              value={formData.last_seen_date}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Link ảnh đại diện</label>
            <input
              name="image_url"
              type="text"
              className="w-full p-2 border rounded outline-none"
              placeholder="http://..."
              value={formData.image_url}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Địa điểm */}
        <div>
          <label className="block mb-1 font-medium">
            Địa điểm nhìn thấy cuối cùng
          </label>
          <input
            name="last_seen_location"
            type="text"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
            required
            placeholder="Ví dụ: Công viên Tao Đàn, Quận 1..."
            value={formData.last_seen_location}
            onChange={handleChange}
          />
        </div>

        {/* Mô tả */}
        <div>
          <label className="block mb-1 font-medium">
            Mô tả đặc điểm nhận dạng
          </label>
          <textarea
            name="description"
            className="w-full p-2 border rounded h-32 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Ví dụ: Cao 1m6, khi đi mặc áo thun trắng, có vết sẹo ở tay trái..."
            value={formData.description}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* Nút đăng bài */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded font-bold hover:bg-blue-700 transition shadow-lg"
        >
          Xác nhận đăng tin
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
