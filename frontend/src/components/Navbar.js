import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import axiosInstance from "../api-control/axiosInstance";
const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Use logic for commitee and resident here
  const navItems = [
    { name: "Community", path: "/committee_home" },
    { name: "Household", path: "/committee_household" },
  ];

  const handleLogout = async () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/landing_page"); // Redirect to login page
  };

  return (
    <nav className="bg-[#E9F1FA] py-6 px-4 fixed top-0 left-0 right-0 z-50 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-[#134151] mr-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          <h1 className="text-3xl font-bold text-[#134151]">Manage+</h1>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-[#134151]"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            className="w-8 h-8"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className="text-[#134151] hover:text-black hover:scale-110 transition-all duration-200 text-xl"
            >
              {item.name}
            </button>
          ))}
          <button
            onClick={() => navigate("/profile")}
            className="text-[#134151] hover:text-black hover:scale-110 transition-all duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </button>
          <button
            onClick={handleLogout}
            className="text-[#134151] hover:text-black hover:scale-110 transition-all duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-6 bg-[#E9F1FA] absolute left-0 right-0">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => {
                navigate(item.path);
                setIsMenuOpen(false);
              }}
              className="block w-full text-left text-[#134151] hover:text-white hover:bg-[#134151] py-3 px-4 transition-all duration-200 text-xl"
            >
              {item.name}
            </button>
          ))}
          <button
            onClick={() => {
              navigate("/profile");
              setIsMenuOpen(false);
            }}
            className="block w-full text-left text-[#134151] hover:text-white hover:bg-[#134151] py-3 px-4 transition-all duration-200 text-xl"
          >
            Profile
          </button>
          <button
            onClick={() => {
              handleLogout();
              setIsMenuOpen(false);
            }}
            className="block w-full text-left text-[#134151] hover:text-white hover:bg-[#134151] py-3 px-4 transition-all duration-200 text-xl"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
