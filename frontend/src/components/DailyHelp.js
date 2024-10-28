import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const DailyHelp = () => {
  const [maidsData, setMaidsData] = useState({});
  const [resident, setResident] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
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

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchMaids = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get(
          "http://localhost:8000/api/helpersAll/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setMaidsData(response.data);
      } catch (error) {
        setError("Failed to fetch maids.");
      }
    };

    fetchMaids();
  }, [resident]);

  function backPage() {
    navigate("/committee_home");
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 to-sky-500">
      <Navbar />
      <div className="container mx-auto px-4 py-28">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg overflow-hidden">
          <div className="p-8">
            <h2 className="text-3xl font-bold mb-8 text-white bg-gradient-to-r from-gray-900 to-sky-500 p-4 rounded-2xl">
              Maids of our apartment
            </h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {Object.keys(maidsData).length === 0 ? (
              <p className="text-gray-600 mb-8">No maids found.</p>
            ) : (
              Object.keys(maidsData).map((apartment) => (
                <div key={apartment} className="mb-8">
                  <h4 className="text-2xl font-bold mb-4 text-[#1c5b70]">
                    Apartment number: {apartment}
                  </h4>
                  <ul className="space-y-4">
                    {maidsData[apartment].map((maid, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between bg-gray-100 p-6 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-md"
                      >
                        <span className="text-xl font-semibold text-gray-800">
                          {maid.name} - {maid.job} (Phone: {maid.phone_number})
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            )}
            <button
              onClick={backPage}
              className="w-full bg-gradient-to-r from-gray-900 to-sky-500 text-white py-3 px-6 rounded-full font-semibold hover:from-blue-800 hover:to-sky-500 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Back to Household
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyHelp;
