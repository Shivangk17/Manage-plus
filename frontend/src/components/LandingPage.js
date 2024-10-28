import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import image1 from "./carousel1.jpg";
import image2 from "./carousel2.jpg";
import image3 from "./carousel3.jpg";
import image4 from "./carousel11.jpg";

const LandingPage = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Use logic for commitee and resident here
  const navItems = [{ name: "Login", path: "/login" }];
  const slides = [{ image: image1 }, { image: image2 }, { image: image3 }];

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    pauseOnHover: false,
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 to-sky-500">
      {/* Navbar only for LandingPage here */}
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
          </div>
        )}
      </nav>

      <div className="pt-20 relative">
        <Slider {...settings}>
          {slides.map((slide, index) => (
            <div key={index} className="relative">
              <img
                src={slide.image}
                alt={`Slide ${index + 1}`}
                className="w-full h-[calc(100vh-85px)] object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <h1 className="text-5xl md:text-7xl font-light text-white mb-6 tracking-wide">
                  Welcome to <span className="font-bold">Manage+</span>
                </h1>
                
                <button
                  onClick={() => navigate("/login")}
                  className="bg-white text-gray-900 text-lg font-semibold py-3 px-8 rounded-full hover:bg-opacity-90 transition-all duration-300 shadow-lg"
                >
                  Get Started
                </button>
              </div>
            </div>
          ))}
        </Slider>
      </div>
      <section className="py-20 md:py-2 "></section>

      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl p-8 shadow-2xl transform hover:scale-105 transition-transform duration-300">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-8 md:mb-0 pr-0 md:pr-8">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Why Manage+
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <svg
                      className="w-6 h-6 text-sky-500 mr-4 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <p className="text-lg text-gray-700">
                      Streamline your community management with ease
                    </p>
                  </div>
                  <div className="flex items-start">
                    <svg
                      className="w-6 h-6 text-sky-500 mr-4 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <p className="text-lg text-gray-700">
                      Keep everyone in your community informed and connected
                    </p>
                  </div>
                  <div className="flex items-start">
                    <svg
                      className="w-6 h-6 text-sky-500 mr-4 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <p className="text-lg text-gray-700">
                      Manage your household tasks and responsibilities effortlessly
                    </p>
                  </div>
                </div>
                <button
                  className="mt-8 bg-gradient-to-r from-gray-900 to-sky-500 text-white font-bold py-3 px-6 rounded-full hover:from-gray-800 hover:to-sky-500 transition duration-300 shadow-md"
                  onClick={() => navigate("/login")}
                >
                  Join Your Community Today
                </button>
              </div>
              <div className="md:w-1/2 mt-8 md:mt-0">
                <div className="relative">
                  <img
                    src={image4}
                    alt="Manage+ Features"
                    className="w-full h-auto rounded-2xl shadow-xl"
                  />
                  <div className="absolute inset-0 bg-gray-900 opacity-20 rounded-2xl"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      
        <div className="container mx-auto py-28 px-4">
          <div className="bg-white rounded-3xl p-8 shadow-2xl transform hover:scale-105 transition-transform duration-300">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">
              Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex flex-col items-center bg-teal-50 p-6 rounded-xl shadow-md">
                <div className="bg-teal-500 text-white rounded-full p-3 mb-4">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-teal-600">
                  Time-Saving
                </h3>
                <p className="text-center text-gray-600">
                  Streamline your community management tasks
                </p>
              </div>
              <div className="flex flex-col items-center bg-pink-50 p-6 rounded-xl shadow-md">
                <div className="bg-pink-500 text-white rounded-full p-3 mb-4">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-pink-600">
                  Family Organization
                </h3>
                <p className="text-center text-gray-600">
                  Improve living experience.
                </p>
              </div>
              <div className="flex flex-col items-center bg-purple-50 p-6 rounded-xl shadow-md">
                <div className="bg-purple-500 text-white rounded-full p-3 mb-4">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-purple-600">
                  Society Charges
                </h3>
                <p className="text-center text-gray-600">
                  Simplify maintenance notifications.
                </p>
              </div>
              <div className="flex flex-col items-center bg-blue-50 p-6 rounded-xl shadow-md">
                <div className="bg-blue-500 text-white rounded-full p-3 mb-4">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-blue-600">
                  Enhanced Security
                </h3>
                <p className="text-center text-gray-600">
                  Ensure data protection and privacy
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
