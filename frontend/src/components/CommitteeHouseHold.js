// CommitteeHousehold.js
import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const CommitteeHouseHold = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Family",
      icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
      description: "Check family members on the website.",
    },
    {
      title: "Helpers",
      icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
      description: "Manage daily help, maids and services.",
    },
    {
      title: "Pets",
      icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
      description: "Manage information about your pets.",
    },
    {
      title: "Vehicles",
      icon: "M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z",
      description: "Manage your vehicles.",
    },
    {
      title: "Profile",
      icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
      description: "View your personal information.",
    },
    {
      title: "Home",
      icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
      description: "Go back to home.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 to-sky-500">
      <Navbar />
      <div className="container mx-auto px-4 py-28">
        <div className="space-y-8">
          <h2 className="text-3xl font-bold mb-6 capitalize text-white">
            Household
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 relative"
              >
                <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-br from-slate-500 to-lime-200 rounded-3xl"></div>
                <div className="p-6 relative z-10">
                  <div
                    className={`flex items-center justify-center w-12 h-12 bg-${
                      ["blue", "green", "yellow", "purple", "pink"][index % 5]
                    }-100 rounded-full mb-4`}
                  >
                    <svg
                      className="w-6 h-6 text-[#1c5b70]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={card.icon}
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold mb-3 text-gray-800">
                    {card.title}
                  </h3>
                  <p className="text-gray-600 mb-6">{card.description}</p>
                  <button
                    onClick={() =>
                      navigate(`/${card.title.toLowerCase().replace(" ", "-")}`)
                    }
                    className="w-full bg-gradient-to-r from-gray-900 to-sky-500 text-white py-3 px-6 rounded-full font-semibold hover:from-blue-800 hover:to-sky-500 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    aria-label={`Manage ${card.title}`}
                  >
                    MANAGE
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommitteeHouseHold;
