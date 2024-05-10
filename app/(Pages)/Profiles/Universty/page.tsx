"use client";











// pages/profile.js
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
  const router = useRouter();
  const { id } = router.query;
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchProfile(id);
    }
  }, [id]);

  const fetchProfile = async (profileId) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/university-profiles/${profileId}`);
      setProfile(response.data);
    } catch (error) {
      console.error(
        "Error fetching university profile:",
        error.response ? error.response.data : error.message
      );
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      {profile && (
        <div>
          <h1>{profile.name}</h1>
          <p>Bio: {profile.bio}</p>
          <p>Establishment Date: {profile.establishment_date}</p>
          {/* Add other profile details here */}
        </div>
      )}
    </div>
  );
};

export default Profile;







































// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Button, Modal } from "antd";

// const UserProfile = () => {
//   const [universityProfiles, setUniversityProfiles] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetchUniversityProfiles();
//   }, []);

//   const fetchUniversityProfiles = async () => {
//     try {
//       const response = await axios.get(
//         "http://127.0.0.1:8000/university-profiles/"
//       );
//       setUniversityProfiles(response.data);
//     } catch (error) {
//       console.error(
//         "Error fetching university profiles:",
//         error.response ? error.response.data : error.message
//       );
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <h1>University Profiles</h1>
//       {loading && <p>Loading...</p>}
//       {error && <p>Error: {error}</p>}
//       {universityProfiles.map((profile) => (
//         <div key={profile.id}>
//           <h2>{profile.name}</h2>
//           <p>Bio: {profile.bio}</p>
//           <p>Link: {profile.link}</p>
//           <p>Establishment Date: {profile.establishment_date}</p>
//           <p>Number of Lectures: {profile.number_of_lectures}</p>
//           <p>Number of Departments: {profile.number_of_departments}</p>
//           <p>Number of Campuses: {profile.number_of_campuses}</p>
//           <p>Number of Colleges: {profile.number_of_colleges}</p>
//           <p>About: {profile.about}</p>
//           <p>Location: {profile.location}</p>
//           <p>Status: {profile.status}</p>
//           <p>Group: {profile.group}</p>
//           <p>User: {profile.user}</p>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default UserProfile;
