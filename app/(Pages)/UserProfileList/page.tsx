"use client"
import React, { useState, useEffect } from 'react';
import Avatar from '../../Components/Avater/Avater';

const UserProfileList = () => {
  const [userProfiles, setUserProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [profilesPerPage] = useState(5);
  const [zoomedImage, setZoomedImage] = useState(null);

  useEffect(() => {
    const fetchUserProfiles = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/user-profiles/');
        if (!response.ok) {
          throw new Error('Failed to fetch user profiles');
        }
        const data = await response.json();
        setUserProfiles(data);
        setFilteredProfiles(data);
      } catch (error) {
        console.error('Error fetching user profiles:', error.message);
      }
    };
    fetchUserProfiles();
  }, []);

  useEffect(() => {
    const filtered = userProfiles.filter(profile =>
      profile.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProfiles(filtered);
  }, [searchQuery, userProfiles]);

  const handleDetailsClick = (profile) => {
    setSelectedProfile(profile);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleAvatarClick = (imageUrl) => {
    setZoomedImage(imageUrl);
  };

  const indexOfLastProfile = currentPage * profilesPerPage;
  const indexOfFirstProfile = indexOfLastProfile - profilesPerPage;
  const currentProfiles = filteredProfiles.slice(indexOfFirstProfile, indexOfLastProfile);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  const handleFindNearbyClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const response = await fetch(`http://127.0.0.1:8000/user-profiles/nearby?latitude=${latitude}&longitude=${longitude}`);
            if (!response.ok) {
              throw new Error('Failed to fetch nearby user profiles');
            }
            const data = await response.json();
            setUserProfiles(data);
            setFilteredProfiles(data);
          } catch (error) {
            console.error('Error fetching nearby user profiles:', error.message);
          }
        },
        (error) => {
          console.error('Error getting geolocation:', error.message);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">User Profiles</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
        />
      </div>
      <div className="mb-4">
        <button
          onClick={handleFindNearbyClick}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Find Nearby Profiles
        </button>
      </div>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 border border-gray-300">Profile Photo</th>
            <th className="py-2 px-4 border border-gray-300">Name</th>
            <th className="py-2 px-4 border border-gray-300">Details</th>
          </tr>
        </thead>
        <tbody>
          {currentProfiles.map((profile) => (
            <tr key={profile.id} className="border-b border-gray-300">
              <td className="py-2 px-4 border border-gray-300">
                <img
                  src={profile.profile_photo}
                  alt={profile.name}
                  onClick={() => handleAvatarClick(profile.profile_photo)}
                  className="cursor-pointer"
                />
              </td>
              <td className="py-2 px-4 border border-gray-300">{profile.name}</td>
              <td className="py-2 px-4 border border-gray-300">
                <button
                  onClick={() => handleDetailsClick(profile)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {filteredProfiles.length === 0 && (
        <p className="mt-4">No profiles found.</p>
      )}
      <div className="flex justify-center mt-4">
        <ul className="flex">
          {Array.from({ length: Math.ceil(filteredProfiles.length / profilesPerPage) }).map((_, index) => (
            <li key={index}>
              <button
                onClick={() => paginate(index + 1)}
                className={`${
                  currentPage === index + 1
                    ? 'bg-blue-500 text-white'
                    : 'bg-white hover:bg-gray-200'
                } font-semibold px-4 py-2 border border-gray-300 focus:outline-none`}
              >
                {index + 1}
              </button>
            </li>
          ))}
        </ul>
      </div>
      {selectedProfile && isModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 transition-opacity" onClick={closeModal}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
              <div className="bg-cover bg-center h-64" style={{ backgroundImage: `url(${selectedProfile.cover_photo})` }}>
                <div className="bg-gray-800 bg-opacity-50 py-4 px-6 text-white text-lg font-semibold">{selectedProfile.name}</div>
              </div>
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Avatar profilePhoto={selectedProfile.profile_photo} name={selectedProfile.name} />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">{selectedProfile.name}</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">Gender: {selectedProfile.gender}</p>
                      <p className="text-sm text-gray-500">Age: {selectedProfile.age}</p>
                      <p className="text-sm text-gray-500">Phone: {selectedProfile.phone}</p>
                      <p className="text-sm text-gray-500">Link: <a href={selectedProfile.link} target="_blank" rel="noopener noreferrer">{selectedProfile.link}</a></p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={closeModal}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base leading-6 font-medium text-white hover:bg-blue-700 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {zoomedImage && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 transition-opacity" onClick={() => setZoomedImage(null)}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
              <img src={zoomedImage} alt="Zoomed Image" className="w-full" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileList;
