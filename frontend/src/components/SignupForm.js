// SignupForm.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import image from "./Neighbors2.jpeg";
const SignupForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    house_number_temp: "",
    is_resident: false,
    is_committee: false,
    password_committee: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    if (name === "is_committee" && checked) {
      setFormData({
        ...formData,
        is_committee: true,
        is_resident: false, // Deselect resident if committee is checked
      });
    }

    if (name === "is_resident" && checked) {
      setFormData({
        ...formData,
        is_resident: true,
        is_committee: false, // Deselect committee if resident is checked
      });
    }
  };
  const navigateToLogin = () => {
    navigate("/login");
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.is_committee) {
        // const storedPassword = localStorage.getItem('committee_password');  // Password stored in localStorage

        if (formData.password_committee !== "12345678") {
          // If password doesn't match, alert and ask them to sign in again
          alert("Incorrect committee password. Please sign in again.");

          // Optionally, you can reset the form or take them back to a login page
          setFormData({
            name: "",
            email: "",
            phoneNumber: "",
            password: "",
            house_number_temp: "",
            is_resident: false,
            is_committee: false,
            password_committee: "",
          });
          return; // Stop form submission
        }
      }
      // If password matches, remove password_committee from formData
      const { password_committee, ...finalFormData } = formData;
      await axios.post("http://127.0.0.1:8000/api/signup/", finalFormData);
      navigate("/home"); // Redirect to home after successful signup
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[#1F1D2B]">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-0">
        <div className="w-full max-w-md p-8 bg-[#2A2D3E] rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
          <p className="text-gray-400 mb-6">Sign up for a new account</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-400 mb-1"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full px-3 py-2 bg-[#3A3F50] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#00ABE4]"
                placeholder="Enter your name"
                onChange={handleChange}
                value={formData.name}
                required
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-400 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full px-3 py-2 bg-[#3A3F50] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#00ABE4]"
                placeholder="Enter your email"
                onChange={handleChange}
                value={formData.email}
                required
              />
            </div>
            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-400 mb-1"
              >
                Phone Number
              </label>
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                className="w-full px-3 py-2 bg-[#3A3F50] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#00ABE4]"
                placeholder="Enter your phone number"
                onChange={handleChange}
                value={formData.phoneNumber}
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-400 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  className="w-full pl-3 pr-10 py-2 bg-[#3A3F50] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#00ABE4]"
                  placeholder="Enter your password"
                  onChange={handleChange}
                  value={formData.password}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 focus:outline-none"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <svg
                      className="h-5 w-5 text-gray-400 hover:text-gray-200"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5 text-gray-400 hover:text-gray-200"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <div>
              <label
                htmlFor="house_number_temp"
                className="block text-sm font-medium text-gray-400 mb-1"
              >
                House Number
              </label>
              <input
                type="text"
                id="house_number_temp"
                name="house_number_temp"
                className="w-full px-3 py-2 bg-[#3A3F50] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#00ABE4]"
                placeholder="Enter your house number"
                onChange={handleChange}
                value={formData.house_number_temp}
                required
              />
            </div>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="is_resident"
                  className="form-checkbox h-5 w-5 text-[#00ABE4]"
                  checked={formData.is_resident}
                  onChange={handleChange}
                />
                <span className="ml-2 text-gray-400">Is Resident</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="is_committee"
                  className="form-checkbox h-5 w-5 text-[#00ABE4]"
                  checked={formData.is_committee}
                  onChange={handleChange}
                />
                <span className="ml-2 text-gray-400">Is Committee</span>
              </label>
            </div>
            {formData.is_committee && (
              <div>
                <label
                  htmlFor="password_committee"
                  className="block text-sm font-medium text-gray-400 mb-1"
                >
                  Committee Password
                </label>
                <input
                  type="password"
                  id="password_committee"
                  name="password_committee"
                  className="w-full px-3 py-2 bg-[#3A3F50] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#00ABE4]"
                  placeholder="Enter committee password"
                  onChange={handleChange}
                  value={formData.password_committee}
                  required
                />
              </div>
            )}
            <button
              type="submit"
              className="w-full py-2 px-4 bg-gradient-to-r from-[#00ABE4] to-[#6C63FF] text-white font-bold rounded-md hover:opacity-90 transition duration-300 transform hover:scale-105"
            >
              Sign Up
            </button>
          </form>
          <p className="mt-6 text-center text-gray-400">
            Already have an account?{" "}
            <a href="/login" className="text-[#00ABE4] hover:underline">
              Sign in here
            </a>
          </p>
        </div>
      </div>
      {/* backgroundimage */}
      <div
        className="w-full lg:w-1/2 bg-cover bg-center"
        style={{
          backgroundImage: `url(${image})`,
        }}
      >
        <div className="h-full flex flex-col items-center justify-center bg-black bg-opacity-50 text-white p-4 lg:p-0">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-center">
            Welcome !
          </h2>
          <p className="mb-8 text-center text-sm lg:text-base">
            Already have an account? Sign in and continue your journey!
          </p>
          <button
            className="py-2 px-6 border-2 border-white rounded-full hover:bg-white hover:text-black transition duration-300"
            onClick={navigateToLogin}
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
