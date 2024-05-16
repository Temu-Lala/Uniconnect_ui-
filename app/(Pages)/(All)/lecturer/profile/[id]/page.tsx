// universities/profiles/detail.tsx

"use client"
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import axios from 'axios';

const LecturerProfileDetailPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const { id } = params;

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    if (id) {
      fetchProfile(id);
      if (token) {
        checkFollowStatus(id, token);
        fetchFollowersCount(id, token);
      }
    }
  }, [id]);

  const fetchProfile = async (id: string) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/lecturer-cv/${id}/`);
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const checkFollowStatus = async (id: string, token: string) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/check-follow-status/lecturer/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setIsFollowing(response.data.is_following);
    } catch (error) {
      console.error('Error checking follow status:', error.message);
    }
  };

  const fetchFollowersCount = async (id: string, token: string) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/followers_count/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setFollowersCount(response.data.followers_count);
    } catch (error) {
      console.error('Error fetching followers count:', error.message);
    }
  };

  const handleFollow = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.post(`http://127.0.0.1:8000/follow-lecturer-profile/${id}/`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setIsFollowing(true);
      setFollowersCount((prevCount) => prevCount + 1);
    } catch (error) {
      console.error('Error following lecturer:', error.message);
    }
  };

  const handleUnfollow = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.post(`http://127.0.0.1:8000/unfollow-lecturer-profile/${id}/`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setIsFollowing(false);
      setFollowersCount((prevCount) => Math.max(prevCount - 1, 0)); // Ensure followers count is not negative
    } catch (error) {
      console.error('Error unfollowing lecturer:', error.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Lecturer Profile Detail</h1>
      {profile && (
        <div>
          <p>Name: {profile.name}</p>
          <p>Bio: {profile.bio}</p>
          {/* Add other profile details here */}
        </div>
      )}
      {isLoggedIn && (
        <div>
          {isFollowing ? (
            <button onClick={handleUnfollow}>Unfollow</button>
          ) : (
            <button onClick={handleFollow}>Follow</button>
          )}
          <p>Followers Count: {followersCount}</p>
        </div>
      )}
    </div>
  );
};

export default LecturerProfileDetailPage;
