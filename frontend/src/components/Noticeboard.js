import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Noticeboard = () => {
  const [notices, setNotices] = useState([]);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(null);
  const [newNoticeAdded, setNewNoticeAdded] = useState(false);
  const [resident, setResident] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResident = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          throw new Error("No access token found");
        }

        const response = await axios.get("http://localhost:8000/api/getUser", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setResident(response.data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchResident();
  }, []);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) throw new Error("No access token found");

        const response = await axios.get("http://localhost:8000/api/notices/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotices(response.data);
      } catch (error) {
        setError("Failed to fetch notices.");
      }
    };

    fetchNotices();
  }, [resident, newNoticeAdded]);

  const handleAddNotice = async (e) => {
    e.preventDefault();
    e.target.querySelector('button[type="submit"]').disabled = true;
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("No access token found");

      const response = await axios.post(
        "http://localhost:8000/api/notices/create/",
        {
          title: formData.title,
          content: formData.content,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccess("Notice added successfully!");
      setFormData({ title: "", content: "" });
      document.getElementById("notice-modal").classList.add("hidden");
      setNewNoticeAdded((prev) => !prev);
    } catch (error) {
      setError("Failed to add notice. Make sure you are a committee member.");
    } finally {
      e.target.querySelector('button[type="submit"]').disabled = false;
    }
  };

  const handleRemoveNotice = async (id) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("No access token found");

      await axios.delete(`http://localhost:8000/api/notices/${id}/delete/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotices(notices.filter((notice) => notice.id !== id));
      setSuccess("Notice deleted successfully!");
    } catch (error) {
      setError("Failed to delete notice.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  if (!resident) {
    return <div>Loading...</div>;
  }
  const handleBackToHousehold = () => {
    navigate("/committee_home");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 to-sky-500">
      <Navbar />
      <div className="container mx-auto px-4 py-28">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-[#1c5b70]">Noticeboard</h2>
              {resident.is_committee && (
                <button
                  onClick={() =>
                    document
                      .getElementById("notice-modal")
                      .classList.remove("hidden")
                  }
                  className="p-2 rounded-full bg-gradient-to-r from-gray-900 to-sky-500 text-white hover:from-blue-800 hover:to-sky-500 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  aria-label="Add Notices"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>
              )}
            </div>
            {notices.length > 0 ? (
              <ul className="space-y-4 mb-8">
                {notices.map((notice) => (
                  <li
                    key={notice.id}
                    className="flex items-center justify-between bg-gray-100 p-6 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-md"
                  >
                    <span className="text-xl font-semibold text-gray-800">
                      <strong>{notice.title}</strong> - {notice.content}
                    </span>
                    {resident.is_committee && (
                      <button
                        onClick={() => handleRemoveNotice(notice.id)}
                        className="p-2 rounded-full bg-gradient-to-r from-gray-900 to-sky-500 text-white hover:from-blue-800 hover:to-sky-500 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                        aria-label="Remove notices"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 12H4"
                          />
                        </svg>
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 mb-8">No notices found.</p>
            )}
            <button
              onClick={handleBackToHousehold}
              className="w-full bg-gradient-to-r from-gray-900 to-sky-500 text-white py-3 px-6 rounded-full font-semibold hover:from-blue-800 hover:to-sky-500 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Back to Household
            </button>
          </div>
        </div>
      </div>
      <Footer />
      {resident.is_committee && (
        <div
          id="notice-modal"
          className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full hidden"
        >
          <div className="flex items-center justify-center min-h-screen">
            <div className="relative p-8 bg-white w-full max-w-md m-auto rounded-3xl shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Add New Notice
              </h3>
              <form onSubmit={handleAddNotice} className="space-y-6">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Title:
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="content"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Content:
                  </label>
                  <input
                    type="text"
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex justify-between">
                  <button
                    type="submit"
                    className="w-full mr-2 justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gradient-to-r from-gray-900 to-sky-500 text-base font-medium text-white hover:from-blue-800 hover:to-sky-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      document
                        .getElementById("notice-modal")
                        .classList.add("hidden")
                    }
                    className="w-full ml-2 justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Close
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Noticeboard;
