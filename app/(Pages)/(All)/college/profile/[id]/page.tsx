// universities/profiles/detail.tsx

"use client"
// pages/universities/ProfileDetailPage.js

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import axios from 'axios';

const ProfileDetailPage = ({params}:{params:{id:string}}) => {
  const router = useRouter();

  const { id } = params;

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchProfile(id);
    }
  }, [id]);

  const fetchProfile = async (id) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/college-profiles/${id}/`);
      setProfile(response.data);
  
    } catch (error) {
      console.error('Error fetching profile:', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>University Profile Detail</h1>
      {profile && (
        <div>
          <p>Name: {profile.name}</p>
          <p>Bio: {profile.bio}</p>
          {/* Add other profile details here */}
        </div>
      )}
    </div>
  );
};

export default ProfileDetailPage;
