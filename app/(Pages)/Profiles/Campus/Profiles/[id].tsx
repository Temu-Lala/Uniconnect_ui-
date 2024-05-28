
"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FaUniversity, FaChalkboardTeacher, FaBuilding, FaBook, FaFlask, FaGlobe, FaMapMarkerAlt, FaEnvelope, FaClipboardList, FaHeartbeat } from 'react-icons/fa';

const UniversityDashboard = ({ id }) => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log(token)
    if (token && id) {
      fetchProfile(id, token);
    } else {
      setError('User is not authenticated or profile ID is missing');
    }
  }, [id]);

  const fetchProfile = async (userId, token) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/university-profiles/${userId}/`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      } else {
        setError('Failed to fetch profile');
      }
    } catch (error) {
      setError('An error occurred');
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-14">
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
        <div className="relative">
          <img src={profile.cover_photo} alt="Cover Photo" className="w-full h-64 object-cover" />
          <div className="absolute bottom-0 left-0 p-4 bg-black bg-opacity-50 text-white">
            <h1 className="text-2xl font-bold">{profile.name}</h1>
            <p className="text-sm">{profile.bio}</p>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center space-x-4 mb-4">
            <img src={profile.profile_photo} alt="Profile Photo" className="w-24 h-24 object-cover rounded-full" />
            <div>
              <h2 className="text-xl font-bold">{profile.name}</h2>
              <p>{profile.establishment_date}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3 p-4 bg-gray-100 rounded-lg shadow">
              <FaChalkboardTeacher className="text-3xl text-blue-600" />
              <div>
                <h3 className="text-lg font-bold">Lectures</h3>
                <p>{profile.number_of_lectures}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-gray-100 rounded-lg shadow">
              <FaBuilding className="text-3xl text-green-600" />
              <div>
                <h3 className="text-lg font-bold">Departments</h3>
                <p>{profile.number_of_departments}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-gray-100 rounded-lg shadow">
              <FaUniversity className="text-3xl text-yellow-600" />
              <div>
                <h3 className="text-lg font-bold">Campuses</h3>
                <p>{profile.number_of_campuses}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-gray-100 rounded-lg shadow">
              <FaUniversity className="text-3xl text-red-600" />
              <div>
                <h3 className="text-lg font-bold">Colleges</h3>
                <p>{profile.number_of_colleges}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-gray-100 rounded-lg shadow">
              <FaBook className="text-3xl text-purple-600" />
              <div>
                <h3 className="text-lg font-bold">Libraries</h3>
                <p>{profile.number_of_libraries}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-gray-100 rounded-lg shadow">
              <FaFlask className="text-3xl text-teal-600" />
              <div>
                <h3 className="text-lg font-bold">Laboratories</h3>
                <p>{profile.number_of_laboratories}</p>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-bold">About</h3>
            <p>{profile.about}</p>
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3 p-4 bg-gray-100 rounded-lg shadow">
              <FaGlobe className="text-3xl text-orange-600" />
              <div>
                <h3 className="text-lg font-bold">Region</h3>
                <p>{profile.region}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-gray-100 rounded-lg shadow">
              <FaMapMarkerAlt className="text-3xl text-indigo-600" />
              <div>
                <h3 className="text-lg font-bold">City</h3>
                <p>{profile.city}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-gray-100 rounded-lg shadow">
              <FaMapMarkerAlt className="text-3xl text-pink-600" />
              <div>
                <h3 className="text-lg font-bold">Specific Place</h3>
                <p>{profile.specific_place}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-gray-100 rounded-lg shadow">
              <FaEnvelope className="text-3xl text-gray-600" />
              <div>
                <h3 className="text-lg font-bold">P.O. Box</h3>
                <p>{profile.pobox}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-gray-100 rounded-lg shadow">
              <FaClipboardList className="text-3xl text-cyan-600" />
              <div>
                <h3 className="text-lg font-bold">Category</h3>
                <p>{profile.category}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-gray-100 rounded-lg shadow">
              <FaHeartbeat className="text-3xl text-red-500" />
              <div>
                <h3 className="text-lg font-bold">Health Support</h3>
                <p>{profile.health_condition_support}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversityDashboard;
