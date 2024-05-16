
"use client"
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import axios from 'axios';

const CampusProfileDetailPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const { id } = params;

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [ratingsAndComments, setRatingsAndComments] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);

  useEffect(() => {
    if (id) {
      fetchProfile(id);
      fetchRatingsAndComments(id);
      checkFollowStatus(id);
      fetchFollowersCount(id);
    }
  }, [id]);

  const fetchProfile = async (id) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/campus-profiles/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRatingsAndComments = async (id) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/campus_rating/?campus_id=${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setRatingsAndComments(response.data);
    } catch (error) {
      console.error('Error fetching ratings and comments:', error.message);
    }
  };

  const fetchFollowersCount = async (id) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/campus_followers_count/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setFollowersCount(response.data.followers_count);
    } catch (error) {
      console.error('Error fetching followers count:', error.message);
    }
  };

  const checkFollowStatus = async (id) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/check-follow-campus-status/campus/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setIsFollowing(response.data.is_following);
    } catch (error) {
      console.error('Error checking follow status:', error.message);
    }
  };

  const handleFollow = async () => {
    try {
      const response = await axios.post(`http://127.0.0.1:8000/follow-campus-profile/${id}/`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setIsFollowing(true);
      setFollowersCount(followersCount + 1);
    } catch (error) {
      console.error('Error following campus:', error.message);
    }
  };

  const handleUnfollow = async () => {
    try {
      const response = await axios.post(`http://127.0.0.1:8000/unfollow-campus-profile/${id}/`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setIsFollowing(false);
      setFollowersCount(followersCount - 1);
    } catch (error) {
      console.error('Error unfollowing campus:', error.message);
    }
  };

  const handleRatingChange = (event) => {
    setRating(parseInt(event.target.value));
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://127.0.0.1:8000/campus_rating/',
        {
          campus_id: id,
          value: rating,
          comment: comment
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log('Rating and comment added successfully:', response.data);
      setRating(0);
      setComment('');
      fetchRatingsAndComments(id);
    } catch (error) {
      console.error('Error adding rating and comment:', error.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div  className=' pt-48'>
      <h1>Campus Profile Detail</h1>
      {profile && (
        <div>
          <p>Name: {profile.name}</p>
          <p>Description: {profile.description}</p>
          {/* Add other profile details here */}
        </div>
      )}
      <div>
        <h2>Followers Count: {followersCount}</h2>
        {!isFollowing ? (
          <button onClick={handleFollow}>Follow</button>
        ) : (
          <button onClick={handleUnfollow}>Unfollow</button>
        )}
      </div>
      <div>
        <h2>Rate this campus:</h2>
        <input
          type="range"
          min="0"
          max="5"
          step="1"
          value={rating}
          onChange={handleRatingChange}
        />
        <p>Selected Rating: {rating}</p>
        <textarea value={comment} onChange={handleCommentChange}></textarea>
        <button onClick={handleSubmit}>Submit Rating and Comment</button>
      </div>
      <div>
        <h2>Ratings and Comments</h2>
        <ul>
          {ratingsAndComments.map((item, index) => (
            <li key={index}>
              <p>Rating: {item.value}</p>
              <p>Comment: {item.comment}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CampusProfileDetailPage;
