import React, { useEffect, useState } from "react";
import personApi from "../api/personApi";
import { Search, MapPin, UserSearch } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  const [persons, setPersons] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State cho ô tìm kiếm

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await personApi.getAll();
        setPersons(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  // Logic lọc dữ liệu
  const filteredPersons = persons.filter((p) => {
    const isMissing = p.status === "missing"; // Chỉ cho phép trạng thái missing ở trang chủ
    const matchSearch =
      p.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.last_seen_location.toLowerCase().includes(searchTerm.toLowerCase());

    return isMissing && matchSearch;
  });

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <UserSearch className="mr-2 text-blue-600" /> Người mất tích
        </h1>

        {/* Thanh tìm kiếm mới */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc địa điểm..."
            className="w-full pl-10 pr-4 py-2 border rounded-full focus:ring-2 focus:ring-blue-300 outline-none shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Link
          to="/create-post"
          className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition font-bold shadow-md"
        >
          Đăng tin mới
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredPersons.length > 0 ? (
          filteredPersons.map((person) => (
            <div
              key={person.id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition overflow-hidden border border-gray-100"
            >
              <img
                src={
                  person.images?.[0]?.image_url ||
                  "https://via.placeholder.com/300"
                }
                alt={person.full_name}
                className="w-full h-56 object-cover"
              />
              <div className="p-5">
                <h3 className="font-bold text-xl text-gray-900">
                  {person.full_name}
                </h3>
                <p className="flex items-center text-gray-500 mt-2 text-sm">
                  <MapPin size={16} className="mr-1 text-red-500" />{" "}
                  {person.last_seen_location}
                </p>
                <Link
                  to={`/person/${person.id}`}
                  className="block mt-5 text-center bg-blue-600 text-white py-2 rounded-xl font-bold hover:bg-blue-700 transition"
                >
                  Chi tiết hồ sơ
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center py-20 text-gray-400">
            Không tìm thấy kết quả phù hợp với "{searchTerm}"
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
