import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Bills = () => {
  const [resident, setResident] = useState([]);
  const [bills, setBills] = useState([]);
  const [success, setSuccess] = useState([]);
  const [error, setError] = useState(null);
  const [newBillsAdded, setNewBillAdded] = useState(false);
  const [formData, setFormData] = useState({
    billType: "",
    amount: "",
    description: "",
    dueDate: "",
  });
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
    const fetchBills = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get(
          "http://localhost:8000/api/viewBills/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setBills(response.data);
      } catch (error) {
        setError("Failed to fetch bills.");
      }
    };

    fetchBills();
  }, [resident, formData, newBillsAdded]);

  const handleAddBill = async (e) => {
    e.preventDefault();
    e.target.querySelector('button[type="submit"]').disabled = true;
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.post(
        "http://localhost:8000/api/addBill/",
        {
          bill_type: formData.billType,
          amount: formData.amount,
          description: formData.description,
          due_date: formData.dueDate,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess("Bill added successfully!");
      setError(null);
      document.getElementById("bill-modal").classList.add("hidden");
      setNewBillAdded((prev) => !prev);
      setFormData({
        billType: "",
        amount: "",
        description: "",
        dueDate: "",
      });
    } catch (err) {
      setError("Failed to add bill.");
      setSuccess(null);
    } finally {
      e.target.querySelector('button[type="submit"]').disabled = false;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRemoveBill = async (id) => {
    try {
      const token = localStorage.getItem("access_token");
      await axios.delete(`http://localhost:8000/api/deleteBill/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBills(bills.filter((bill) => bill.id !== id));
      setSuccess("Bill deleted successfully!");
      setError(null);
    } catch (error) {
      setError("Failed to delete bill.");
    }
  };

  const backPage = () => {
    navigate("/bills");
  };

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
              <h2 className="text-3xl font-bold text-[#1c5b70]">
                Bills to add for {resident.name}
              </h2>
              <button
                onClick={() =>
                  document
                    .getElementById("bill-modal")
                    .classList.remove("hidden")
                }
                className="p-2 rounded-full bg-gradient-to-r from-gray-900 to-sky-500 text-white hover:from-blue-800 hover:to-sky-500 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                aria-label="Add Bill"
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
            </div>
            {bills.length > 0 ? (
              <ul className="space-y-4 mb-8">
                {bills.map((bill) => (
                  <li
                    key={bill.id}
                    className="flex items-center justify-between bg-gray-100 p-6 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-md"
                  >
                    <span className="text-xl font-semibold text-gray-800">
                      {bill.bill_type} - ₹{bill.amount} (Due: {bill.due_date})
                    </span>
                    <button
                      onClick={() => handleRemoveBill(bill.id)}
                      className="p-2 rounded-full bg-gradient-to-r from-gray-900 to-sky-500 text-white hover:from-blue-800 hover:to-sky-500 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                      aria-label="Remove bill"
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
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 mb-8">No bills found.</p>
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

      <div
        id="bill-modal"
        className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full hidden"
      >
        <div className="flex items-center justify-center min-h-screen">
          <div className="relative p-8 bg-white w-full max-w-md m-auto rounded-3xl shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Add New Bill
            </h3>
            <form onSubmit={handleAddBill} className="space-y-6">
              <div>
                <label
                  htmlFor="billType"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Bill Type:
                </label>
                <input
                  type="text"
                  name="billType"
                  value={formData.billType}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Amount:
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description:
                </label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="dueDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Due Date:
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="w-full mr-2 justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gradient-to-r from-blue-900 to-sky-400 text-base font-medium text-white hover:from-blue-800 hover:to-sky-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Add Bill
                </button>
                <button
                  onClick={() =>
                    document
                      .getElementById("bill-modal")
                      .classList.add("hidden")
                  }
                  className="w-full ml-2 justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Back
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bills;
