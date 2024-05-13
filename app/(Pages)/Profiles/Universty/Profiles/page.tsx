
"use client";
import { useState, useEffect } from 'react';

const UserProfileList = () => {
  const [userProfiles, setUserProfiles] = useState([]);

  useEffect(() => {
    const fetchUserProfiles = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }
        
        const response = await fetch('http://127.0.0.1:8000/university-profiles/', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user profiles');
        }

        const data = await response.json();
        setUserProfiles(data);
      } catch (error) {
        console.error('Error fetching user profiles:', error.message);
      }
    };

    fetchUserProfiles();
  }, []);

  const handleUpdateProfile = async (profileId, updatedData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
  
      const response = await fetch(`http://127.0.0.1:8000/university-profiles/${profileId}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
  
      // Optionally, fetch and update the profiles list after successful update
      fetchUserProfiles();
    } catch (error) {
      console.error('Error updating profile:', error.message);
    }
  };
  

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">University Profiles</h1>
      {userProfiles.map((profile) => (
        <div key={profile.id} className="bg-white shadow rounded p-4 mb-4">
          <h2 className="text-xl font-semibold mb-2">{profile.name}</h2>
          <p className="text-gray-700 mb-2">Bio: {profile.bio}</p>
          <p className="text-gray-600">Establishment Date: {profile.establishment_date}</p>
          <p className="text-gray-600">Number of Lectures: {profile.number_of_lectures}</p>
          <p className="text-gray-600">Number of Departments: {profile.number_of_departments}</p>
          <p className="text-gray-600">Number of Campuses: {profile.number_of_campuses}</p>
          <p className="text-gray-600">Number of Colleges: {profile.number_of_colleges}</p>
          <p className="text-gray-600">About: {profile.about}</p>
          <p className="text-gray-600">Location: {profile.location}</p>
          <p className="text-gray-600">Status: {profile.status}</p>
          <a href={profile.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Link</a>
          <button
            onClick={() => handleUpdateProfile(profile.id, { status: 'updated' })}
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded mt-2"
          >
            Update Profile
          </button>
        </div>
      ))}
    </div>
  );
};

export default UserProfileList;
