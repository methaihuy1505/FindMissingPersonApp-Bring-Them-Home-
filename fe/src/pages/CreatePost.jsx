import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import personApi from "../api/personApi";
import toast from "react-hot-toast";

const CreatePost = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: "",
    gender: "male",
    last_seen_location: "",
    description: "",
    image_url: "",
    created_by: localStorage.getItem("user_id"),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await personApi.create(formData);
      toast.success("Đăng tin thành công!");
      navigate("/");
    } catch {
      // Không cần khai báo biến error nếu không dùng đến
      toast.error("Có lỗi xảy ra, vui lòng kiểm tra lại");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow mt-10 rounded">
      <h2 className="text-2xl font-bold mb-6 text-blue-800">
        Đăng tin tìm người mất tích
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">
            Họ và tên người mất tích
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
            required
            onChange={(e) =>
              setFormData({ ...formData, full_name: e.target.value })
            }
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Giới tính</label>
            <select
              className="w-full p-2 border rounded"
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value })
              }
            >
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Link ảnh đại diện</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="http://..."
              onChange={(e) =>
                setFormData({ ...formData, image_url: e.target.value })
              }
            />
          </div>
        </div>
        <div>
          <label className="block mb-1 font-medium">
            Địa điểm nhìn thấy cuối cùng
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            required
            onChange={(e) =>
              setFormData({ ...formData, last_seen_location: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">
            Mô tả đặc điểm nhận dạng
          </label>
          <textarea
            className="w-full p-2 border rounded h-32"
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded font-bold hover:bg-blue-700 transition"
        >
          Xác nhận đăng tin
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
