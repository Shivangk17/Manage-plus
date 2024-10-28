import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";

import icon from "./default pfp.jpeg";

const Profile = () => {
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

  const userDetails = [
    { label: "Full Name", value: resident.name },
    { label: "Email", value: resident.email },
    { label: "Phone", value: resident.phoneNumber },
    
    { label: "User Type", value: resident.is_committee ? "Committee Member" : "Resident" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 to-sky-500">
      <Navbar />
      <div className="container mx-auto px-4 py-28">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105">
          <div className="p-6 md:p-8 md:flex relative">
            <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-br from-slate-500 to-lime-200 rounded-3xl"></div>
            <div className="md:w-1/3 mb-6 md:mb-0 relative z-10">
              <div className="text-center">
                <img
                  src={icon}
                  alt="Profile"
                  className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-white shadow-lg"
                />
                <h2 className="text-2xl font-bold text-gray-800">
                  {resident.name}
                </h2>
                <p className="text-gray-600">
                  {resident.is_committee ? "Committee Member" : "Resident"}
                </p>
              </div>
            </div>
            <div className="md:w-2/3 md:pl-8 relative z-10">
              <h1 className="text-3xl font-bold mb-6 text-gray-800">
                User Profile
              </h1>
              <div className="space-y-4">
                {userDetails.map((detail, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-1/3">
                      <p className="text-sm font-medium text-gray-500">
                        {detail.label}
                      </p>
                    </div>
                    <div className="w-2/3">
                      <p className="text-lg font-semibold text-gray-900">
                        {detail.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 space-y-4">
                <h3 className="text-xl font-bold text-gray-800">Household</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Family Members
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {resident.no_family_memebers}
                    </p>
                  </div>
                  <button
                    onClick={() => navigate("/committee_household")}
                    className="w-full sm:w-auto bg-gradient-to-r from-gray-900 to-sky-500 text-white py-3 px-6 rounded-full font-semibold hover:from-blue-800 hover:to-sky-500 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    aria-label="Manage Household"
                  >
                    My Household
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;