import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Pets = () => {
  const [formData, setFormData] = useState({
    name: "",
    animal_type: "",
    resident: null,
  });
  const [pets, setPets] = useState([]);
  const [resident, setResident] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  // const [residentChecker, setResidentChecker] = useState(null);
  const [newPetAdded, setNewPetAdded] = useState(false);
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
        // setResidentChecker(response.data);
        setFormData({
          ...formData,
          resident: response.data.id,
        });
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddPet = async (e) => {
    e.preventDefault();
    e.target.querySelector('button[type="submit"]').disabled = true;

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("No access token found");
      }

      const response = await axios.post(
        "http://localhost:8000/api/pets/",
        {
          ...formData,
          resident: resident ? resident.id : null,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Pet added:", response.data);
      document.getElementById("pet-modal").classList.add("hidden");
      setFormData({
        name: "",
        animal_type: "",
      });
      setNewPetAdded((prev) => !prev);
    } catch (error) {
      console.error("There was an error adding the pet:", error);
      alert("Failed to add pet. Please check your credentials and try again.");
    } finally {
      e.target.querySelector('button[type="submit"]').disabled = false;
    }
  };

  const handleBackToHousehold = () => {
    navigate("/committee_household");
  };

  useEffect(() => {
    if (resident) {
      const fetchPets = async () => {
        try {
          const token = localStorage.getItem("access_token");
          const responsePet = await axios.get(
            `http://localhost:8000/api/pets/apartment/${resident.id}/`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setPets(responsePet.data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchPets();
    }
  }, [resident, newPetAdded]);

  const handleRemovePet = async (petId) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("No access token found");
      }

      await axios.delete(`http://localhost:8000/api/pets/${petId}/delete/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPets(pets.filter((pet) => pet.id !== petId));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 to-sky-500">
      <Navbar />
      <div className="container mx-auto px-4 py-28">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-[#1c5b70]">
                Pets of {resident.name}'s House
              </h2>
              <button
                onClick={() =>
                  document
                    .getElementById("pet-modal")
                    .classList.remove("hidden")
                }
                className="p-2 rounded-full bg-gradient-to-r from-gray-900 to-sky-500 text-white hover:from-blue-800 hover:to-sky-500 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                aria-label="Add Pet"
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
            {pets.length > 0 ? (
              <ul className="space-y-4 mb-8">
                {pets.map((pet) => (
                  <li
                    key={pet.id}
                    className="flex items-center justify-between bg-gray-100 p-6 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-md"
                  >
                    <span className="text-xl font-semibold text-gray-800">
                      {pet.name} - {pet.animal_type}
                    </span>
                    <button
                      onClick={() => handleRemovePet(pet.id)}
                      className="p-2 rounded-full bg-gradient-to-r from-gray-900 to-sky-500 text-white hover:from-blue-800 hover:to-sky-500 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                      aria-label="Remove pet"
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
              <p className="text-gray-600 mb-8">No pets found.</p>
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
        id="pet-modal"
        className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full hidden"
      >
        <div className="flex items-center justify-center min-h-screen">
          <div className="relative p-8 bg-white w-full max-w-md m-auto rounded-3xl shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Add New Pet
            </h3>
            <form onSubmit={handleAddPet} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Name:
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="animal_type"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Animal Type:
                </label>
                <input
                  type="text"
                  id="animal_type"
                  name="animal_type"
                  value={formData.animal_type}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="w-full mr-2 justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gradient-to-r from-gray-900 to-sky-500 text-base font-medium text-white hover:from-blue-800 hover:to-sky-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Add Pet
                </button>
                <button
                  onClick={() =>
                    document.getElementById("pet-modal").classList.add("hidden")
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

export default Pets;
