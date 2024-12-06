"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  FaUniversity,
  FaChalkboardTeacher,
  FaBuilding,
  FaBook,
  FaFlask,
  FaGlobe,
  FaMapMarkerAlt,
  FaEnvelope,
  FaClipboardList,
  FaHeartbeat,
} from "react-icons/fa";
import { Button } from 'antd'; // Import the Button component from Ant Design
import Link from "next/link";

interface Profile {
  cover_photo: string;
  name: string;
  bio: string;
  profile_photo: string;
  establishment_date: string;
  number_of_lectures: number;
  number_of_departments: number;
  number_of_campuses: number;
  number_of_colleges: number;
  number_of_libraries: number;
  number_of_laboratories: number;
  about: string;
  region: string;
  city: string;
  specific_place: string;
  pobox: string;
  category: string;
  health_condition_support: string;
}

const CampusDashboard = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showOptions, setShowOptions] = useState(false); // State for toggling options

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const userId = getUserIdFromToken(token);
      fetchProfile(userId, token); // Fetch profile data using the user ID
    } else {
      setError("User is not authenticated");
    }
  }, []);

  const getUserIdFromToken = (token: string): number => {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    const decodedToken = JSON.parse(jsonPayload);
    return decodedToken.user_id;
  };

  const fetchProfile = async (userId: number, token: string) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/campus-profiles/by-user/?user=${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data: Profile = await response.json();
        setProfile(data);
        localStorage.setItem("profileData", JSON.stringify(data));
      } else {
        setError("Failed to fetch profile data");
      }
    } catch (error) {
      setError("An error occurred while fetching profile data");
    }
  };
  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto pt-36">
      <div className="bg-gray-800 shadow-md rounded-lg overflow-hidden mb-6">
        <div className="relative">
          <img
            src={profile.cover_photo}
            alt="Cover Photo"
            className="w-full h-64 object-cover"
          />
          <div className="absolute top-4 right-4">
            <button onClick={toggleOptions} className="text-white text-2xl">
              &#x22EE;
            </button>
            {showOptions && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg">
                <Link href="../Components/Updates/Campus/cump-update/"> {/* Update profile page */}
                  <button
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    Update Profile
                  </button>
                </Link>
                <Link href="../Components/Updates/Campus/cump-delete/"> {/* Delete profile page */}
                  <button
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    Delete Profile
                  </button>
                </Link>
              </div>
            )}
          </div>
          <div className="absolute bottom-0 left-0 p-4 bg-black bg-opacity-50 text-white">
            <h1 className="text-2xl font-bold">{profile.name}</h1>
            <p className="text-sm">{profile.bio}</p>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <img
                src={profile.profile_photo}
                alt="Profile Photo"
                className="w-24 h-24 object-cover rounded-full"
              />
              <div>
                <h2 className="text-xl font-bold text-white">{profile.name}</h2>
                <p className="text-gray-400">{profile.establishment_date}</p>
              </div>
            </div>
            <Button type="primary" href="/News/createnews/">Create Post</Button> {/* Create Post Button */}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3 p-4 bg-gray-700 rounded-lg shadow">
              <FaChalkboardTeacher className="text-3xl text-blue-400" />
              <div>
                <h3 className="text-lg font-bold text-white">Lectures</h3>
                <p className="text-gray-300">{profile.number_of_lectures}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-gray-700 rounded-lg shadow">
              <FaBuilding className="text-3xl text-green-400" />
              <div>
                <h3 className="text-lg font-bold text-white">Departments</h3>
                <p className="text-gray-300">{profile.number_of_departments}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-gray-700 rounded-lg shadow">
              <FaUniversity className="text-3xl text-yellow-400" />
              <div>
                <h3 className="text-lg font-bold text-white">Campuses</h3>
                <p className="text-gray-300">{profile.number_of_campuses}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-gray-700 rounded-lg shadow">
              <FaUniversity className="text-3xl text-red-400" />
              <div>
                <h3 className="text-lg font-bold text-white">Colleges</h3>
                <p className="text-gray-300">{profile.number_of_colleges}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-gray-700 rounded-lg shadow">
              <FaBook className="text-3xl text-purple-400" />
              <div>
                <h3 className="text-lg font-bold text-white">Libraries</h3>
                <p className="text-gray-300">{profile.number_of_libraries}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-gray-700 rounded-lg shadow">
              <FaFlask className="text-3xl text-teal-400" />
              <div>
                <h3 className="text-lg font-bold text-white">Laboratories</h3>
                <p className="text-gray-300">{profile.number_of_laboratories}</p>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-bold text-white">About</h3>
            <p className="text-gray-300">{profile.about}</p>
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3 p-4 bg-gray-700 rounded-lg shadow">
              <FaGlobe className="text-3xl text-orange-400" />
              <div>
                <h3 className="text-lg font-bold text-white">Region</h3>
                <p className="text-gray-300">{profile.region}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-gray-700 rounded-lg shadow">
              <FaMapMarkerAlt className="text-3xl text-indigo-400" />
              <div>
                <h3 className="text-lg font-bold text-white">City</h3>
                <p className="text-gray-300">{profile.city}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-gray-700 rounded-lg shadow">
              <FaMapMarkerAlt className="text-3xl text-pink-400" />
              <div>
                <h3 className="text-lg font-bold text-white">Specific Place</h3>
                <p className="text-gray-300">{profile.specific_place}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-gray-700 rounded-lg shadow">
              <FaEnvelope className="text-3xl text-gray-400" />
              <div>
                <h3 className="text-lg font-bold text-white">P.O. Box</h3>
                <p className="text-gray-300">{profile.pobox}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-gray-700 rounded-lg shadow">
              <FaClipboardList className="text-3xl text-cyan-400" />
              <div>
                <h3 className="text-lg font-bold text-white">Category</h3>
                <p className="text-gray-300">{profile.category}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-gray-700 rounded-lg shadow">
              <FaHeartbeat className="text-3xl text-red-500" />
              <div>
                <h3 className="text-lg font-bold text-white">Health Support</h3>
                <p className="text-gray-300">{profile.health_condition_support}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampusDashboard;
