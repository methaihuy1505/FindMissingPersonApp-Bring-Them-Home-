import React, { useEffect, useState } from "react";
import personApi from "../api/personApi";
import { Search, MapPin, UserSearch, Filter, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  const [persons, setPersons] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [genderFilter, setGenderFilter] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await personApi.getAll();
        setPersons(data || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const filteredPersons = persons.filter((p) => {
    const isMissing = p.status === "missing";
    const matchSearch =
      p.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.last_seen_location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchGender =
      genderFilter === "all" ? true : p.gender === genderFilter;

    return isMissing && matchSearch && matchGender;
  });

  return (
    <div className="container mx-auto p-4 min-h-screen">
      {/* Header & Search Section */}
      <div className="flex flex-col gap-6 mb-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-black text-blue-900 flex items-center">
            <UserSearch className="mr-3 text-blue-600" size={32} /> TÌM NGƯỜI
            THÂN
          </h1>
          <Link
            to="/create-post"
            className="w-full md:w-auto bg-green-600 text-white px-8 py-3 rounded-2xl hover:bg-green-700 transition font-bold shadow-lg text-center"
          >
            + Đăng tin mới
          </Link>
        </div>

        {/* Thanh tìm kiếm & Bộ lọc */}
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Nhập tên người mất tích hoặc địa điểm..."
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <div className="flex items-center bg-gray-50 px-4 rounded-2xl border border-gray-100">
              <Filter size={18} className="text-gray-400 mr-2" />
              <select
                className="bg-transparent py-3 outline-none text-gray-600 font-medium"
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value)}
              >
                <option value="all">Tất cả giới tính</option>
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Danh sách */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredPersons.length > 0 ? (
          filteredPersons.map((person) => (
            <div
              key={person.id}
              className="group bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col"
            >
              <div className="relative overflow-hidden">
                <img
                  src={
                    person.images?.[0]?.image_url ||
                    "https://via.placeholder.com/300"
                  }
                  alt={person.full_name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase">
                  Khẩn cấp
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-bold text-xl text-gray-900 mb-2 uppercase truncate">
                  {person.full_name}
                </h3>

                <div className="space-y-2 mb-6">
                  <p className="flex items-center text-gray-500 text-sm">
                    <MapPin size={16} className="mr-2 text-red-500 shrink-0" />
                    <span className="truncate">
                      {person.last_seen_location}
                    </span>
                  </p>
                  <p className="flex items-center text-gray-500 text-sm">
                    <Calendar
                      size={16}
                      className="mr-2 text-blue-500 shrink-0"
                    />
                    <span>Mất tích: {person.last_seen_date}</span>
                  </p>
                </div>

                <Link
                  to={`/person/${person.id}`}
                  className="mt-auto block text-center bg-gray-900 text-white py-3 rounded-2xl font-bold hover:bg-blue-600 transition shadow-md"
                >
                  Xem hồ sơ
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-20">
            <div className="text-gray-300 mb-4 flex justify-center">
              <Search size={64} />
            </div>
            <p className="text-gray-500 text-lg">
              Không tìm thấy thông tin phù hợp.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
