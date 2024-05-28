"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  FaPhone,
  FaEnvelope,
  FaLinkedin,
  FaBook,
  FaBriefcase,
  FaGraduationCap,
  FaLanguage,
  FaProjectDiagram,
  FaClipboardList,
} from "react-icons/fa";

const LecturerCVDashboard = () => {
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
      const response = await fetch(`http://127.0.0.1:8000/api/lecturer-cv/by-user/?user=${userId}`, {
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
            <p className="text-sm">{profile.bio}</p>
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
              <p className="text-gray-400">{profile.job_title}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3 p-4 bg-gray-700 rounded-lg shadow">
              <FaPhone className="text-3xl text-blue-400" />
              <div>
                <h3 className="text-lg font-bold text-white">Phone</h3>
                <p className="text-gray-300">{profile.phone}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-gray-700 rounded-lg shadow">
              <FaEnvelope className="text-3xl text-green-400" />
              <div>
                <h3 className="text-lg font-bold text-white">Email</h3>
                <p className="text-gray-300">{profile.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-gray-700 rounded-lg shadow">
              <FaLinkedin className="text-3xl text-yellow-400" />
              <div>
                <h3 className="text-lg font-bold text-white">LinkedIn</h3>
                <a href={profile.linkedin} className="text-gray-300">{profile.linkedin}</a>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-gray-700 rounded-lg shadow">
              <FaGraduationCap className="text-3xl text-red-400" />
              <div>
                <h3 className="text-lg font-bold text-white">Education Background</h3>
                <p className="text-gray-300">{profile.education_background}</p>
                <p className="text-gray-300">{profile.background_description}</p>
              </div>
            </div>
            {profile.education_background2 && (
              <div className="flex items-center space-x-3 p-4 bg-gray-700 rounded-lg shadow">
                <FaGraduationCap className="text-3xl text-red-400" />
                <div>
                  <h3 className="text-lg font-bold text-white">Education Background 2</h3>
                  <p className="text-gray-300">{profile.education_background2}</p>
                  <p className="text-gray-300">{profile.background_description2}</p>
                </div>
              </div>
            )}
            {profile.education_background3 && (
              <div className="flex items-center space-x-3 p-4 bg-gray-700 rounded-lg shadow">
                <FaGraduationCap className="text-3xl text-red-400" />
                <div>
                  <h3 className="text-lg font-bold text-white">Education Background 3</h3>
                  <p className="text-gray-300">{profile.education_background3}</p>
                  <p className="text-gray-300">{profile.background_description3}</p>
                </div>
              </div>
            )}
            <div className="flex items-center space-x-3 p-4 bg-gray-700 rounded-lg shadow">
              <FaLanguage className="text-3xl text-purple-400" />
              <div>
                <h3 className="text-lg font-bold text-white">Languages</h3>
                <p className="text-gray-300">{profile.languages}</p>
                {profile.languages2 && <p className="text-gray-300">{profile.languages2}</p>}
                {profile.languages3 && <p className="text-gray-300">{profile.languages3}</p>}
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-gray-700 rounded-lg shadow">
              <FaBriefcase className="text-3xl text-teal-400" />
              <div>
                <h3 className="text-lg font-bold text-white">Professional Experience</h3>
                <p className="text-gray-300">{profile.professional_experience}</p>
                {profile.professional_experience2 && <p className="text-gray-300">{profile.professional_experience2}</p>}
                {profile.professional_experience3 && <p className="text-gray-300">{profile.professional_experience3}</p>}
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-gray-700 rounded-lg shadow">
              <FaClipboardList className="text-3xl text-cyan-400" />
              <div>
                <h3 className="text-lg font-bold text-white">Key Responsibilities</h3>
                <p className="text-gray-300">{profile.key_responsibilities}</p>
                {profile.key_responsibilities2 && <p className="text-gray-300">{profile.key_responsibilities2}</p>}
                {profile.key_responsibilities3 && <p className="text-gray-300">{profile.key_responsibilities3}</p>}
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-gray-700 rounded-lg shadow">
              <FaProjectDiagram className="text-3xl text-pink-400" />
              <div>
                <h3 className="text-lg font-bold text-white">Projects</h3>
                <p className="text-gray-300">{profile.project1}</p>
                <p className="text-gray-300">{profile.project_description1}</p>
                {profile.project2 && (
                  <>
                    <p className="text-gray-300">{profile.project2}</p>
                    <p className="text-gray-300">{profile.project_description2}</p>
                  </>
                )}
                {profile.project3 && (
                  <>
                    <p className="text-gray-300">{profile.project3}</p>
                    <p className="text-gray-300">{profile.project_description3}</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LecturerCVDashboard;
