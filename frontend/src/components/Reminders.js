import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Reminders = () => {
  const [message, setMessage] = useState("");
  const [reminders, setReminders] = useState([]);
  const [error, setError] = useState(null);
  const [resident, setResident] = useState(null);
  const navigate = useNavigate();

  const handleAddReminders = async () => {
    try {
      const token = localStorage.getItem("access_token");
      await axios.post(
        "http://localhost:8000/api/sendReminder/",
        {
          message,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Reminder sent to all residents!");
      setMessage("");
    } catch (error) {
      console.error("Error sending reminder:", error);
    }
  };

  useEffect(() => {
    const fetchResidentData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get("http://localhost:8000/api/getUser", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setResident(response.data);
      } catch (error) {
        console.error("Failed to fetch resident data:", error);
      }
    };

    const fetchReminders = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get(
          "http://localhost:8000/api/viewReminders/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const unviewedReminders = [];
        for (const reminder of response.data) {
          if (!reminder.viewed) {
            unviewedReminders.push(reminder);
            await axios.patch(
              `http://localhost:8000/api/reminders/${reminder.id}/markViewed/`,
              {},
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
          }
        }

        setReminders(unviewedReminders);
      } catch (error) {
        setError("Failed to fetch reminders.");
      }
    };

    fetchResidentData();
    fetchReminders();
  }, []);

  const handleBackToHousehold = () => {
    navigate("/committee_home");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 to-sky-500">
      <Navbar />
      <div className="container mx-auto px-4 py-28">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg overflow-hidden">
          <div className="p-8">
            {resident && resident.is_committee && (
              <div className="mb-8">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter reminder message"
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
                />
                <button
                  className="w-full bg-gradient-to-r from-gray-900 to-sky-500 text-white py-2 px-4 rounded-md hover:from-blue-800 hover:to-sky-500 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  onClick={handleAddReminders}
                >
                  Send Reminder
                </button>
              </div>
            )}

            {reminders.length > 0 ? (
              <div>
                <h3 className="text-3xl font-bold mb-6 text-[#1c5b70]">
                  Reminders:
                </h3>
                <ul className="space-y-4 mb-8">
                  {reminders.map((reminder) => (
                    <li
                      key={reminder.id}
                      className="flex items-center justify-between bg-gray-100 p-6 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-md"
                    >
                      <span className="text-xl font-semibold text-gray-800">
                        {reminder.message} (sent on{" "}
                        {new Date(reminder.created_at).toLocaleDateString()})
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-xl font-semibold text-gray-800">
                No new reminders.
              </p>
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
    </div>
  );
};

export default Reminders;
