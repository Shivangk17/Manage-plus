import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const Family = () => {
  const [people, setPeople] = useState([]);
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
    const fetchPeople = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get(
          "http://localhost:8000/api/residentSameApartment/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPeople(response.data);
        setError(null);
      } catch (error) {
        setError("Failed to fetch people in this apartment.");
        setPeople([]);
      }
    };

    fetchPeople();
  }, [resident]);

  function backPage() {
    navigate("/committee_household");
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 to-sky-500">
      <Navbar />
      <div className="container mx-auto px-4 py-28">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-[#1c5b70]">
                Family Members of {resident.name}
              </h2>
            </div>
            {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
            {people.length > 0 ? (
              <ul className="space-y-4 mb-8">
                {people.map((user, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between bg-gray-100 p-6 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-md"
                  >
                    <span className="text-xl font-semibold text-gray-800">
                      {user.name}
                    </span>
                    <div className="text-right">
                      <p className="text-gray-600">
                        Phone: {user.phone_number}
                      </p>
                      <p className="text-gray-600">Role: {user.role}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 mb-8 text-center">
                No one found in your apartment.
              </p>
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

export default Family;
