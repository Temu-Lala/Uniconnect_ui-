"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  FaFile,
  FaUser,
  FaUniversity,
  FaBuilding,
  FaFlask,
} from "react-icons/fa";

const LabDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const userId = getUserIdFromToken(token);
      fetchProfile(userId, token); // Fetch profile data using the user ID
    } else {
      setError("User is not authenticated");
    }
  }, []);

  const getUserIdFromToken = (token) => {
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

  const fetchProfile = async (userId, token) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/lab-profiles/by-user/?user=${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        localStorage.setItem("profileData", JSON.stringify(data));
      } else {
        setError("Failed to fetch profile data");
      }
    } catch (error) {
      setError("An error occurred while fetching profile data");
    }
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
          <div className="absolute bottom-0 left-0 p-4 bg-black bg-opacity-50 text-white">
            <h1 className="text-2xl font-bold">{profile.name}</h1>
            <p className="text-sm">{profile.description}</p>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center space-x-4 mb-4">
            <img
              src={profile.profile_photo}
              alt="Profile Photo"
              className="w-24 h-24 object-cover rounded-full"
            />
            <div>
              <h2 className="text-xl font-bold text-white">{profile.name}</h2>
              <p className="text-gray-400">Established: {profile.establishment_date}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3 p-4 bg-gray-700 rounded-lg shadow">
              <FaUser className="text-3xl text-blue-400" />
              <div>
                <h3 className="text-lg font-bold text-white">User</h3>
                <p className="text-gray-300">{profile.user}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-gray-700 rounded-lg shadow">
              <FaUniversity className="text-3xl text-green-400" />
              <div>
                <h3 className="text-lg font-bold text-white">University</h3>
                <p className="text-gray-300">{profile.university_profile}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-gray-700 rounded-lg shadow">
              <FaBuilding className="text-3xl text-yellow-400" />
              <div>
                <h3 className="text-lg font-bold text-white">Campus</h3>
                <p className="text-gray-300">{profile.campus_profile}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-gray-700 rounded-lg shadow">
              <FaFlask className="text-3xl text-red-400" />
              <div>
                <h3 className="text-lg font-bold text-white">College</h3>
                <p className="text-gray-300">{profile.college_profile}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-gray-700 rounded-lg shadow">
              <FaFlask className="text-3xl text-purple-400" />
              <div>
                <h3 className="text-lg font-bold text-white">Department</h3>
                <p className="text-gray-300">{profile.department_profile}</p>
              </div>
            </div>
            {profile.files && profile.files.map((file) => (
              <div key={file.id} className="flex items-center space-x-3 p-4 bg-gray-700 rounded-lg shadow">
                <FaFile className="text-3xl text-teal-400" />
                <div>
                  <h3 className="text-lg font-bold text-white">File</h3>
                  <a href={file.file} className="text-gray-300" target="_blank" rel="noopener noreferrer">{file.file}</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabDashboard;
