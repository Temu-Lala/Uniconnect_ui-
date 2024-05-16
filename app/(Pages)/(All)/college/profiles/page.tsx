// pages/universities/UniversityList.tsx


"use client"
// pages/universities/ProfileListPage.js

import Link from 'next/link';
import { useState, useEffect } from 'react';
import axios from 'axios';
const ProfileListPage = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/college-profiles/');
      setProfiles(response.data);
    } catch (error) {
      console.error('Error fetching profiles:', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className=' pt-60'>
      <h1>University Profiles List</h1>
      {profiles.map((profile) => (
        <div key={profile.id}>
          <Link href={`../../college/profile/${profile.id}/`}>
            <p>{profile.id}</p>
            <p>{profile.name}</p>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ProfileListPage;
