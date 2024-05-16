"use client"
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const CollegeProfileDetailPage = ({ params }) => {
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
      checkFollowingStatus(id);
      fetchFollowersCount(id);
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

  const fetchRatingsAndComments = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://127.0.0.1:8000/college_rating/?college_id=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setRatingsAndComments(response.data);
    } catch (error) {
      console.error('Error fetching ratings and comments:', error.message);
    }
  };

  const checkFollowingStatus = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://127.0.0.1:8000/check-follow-status/college/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setIsFollowing(response.data.is_following);
    } catch (error) {
      console.error('Error checking following status:', error.message);
    }
  };

  const fetchFollowersCount = async (id) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/collage_followers_count/${id}/`);
      setFollowersCount(response.data.followers_count);
    } catch (error) {
      console.error('Error fetching followers count:', error.message);
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
        'http://127.0.0.1:8000/college_rating/',
        {
          college_id: id,
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

  const handleFollow = async () => {
    try {
      const token = localStorage.getItem('token');
      const action = isFollowing ? 'unfollow' : 'follow';
      const response = await axios.post(
        `http://127.0.0.1:8000/${action}-college-profile/${id}/`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setIsFollowing(action === 'follow');
      fetchFollowersCount(id);
    } catch (error) {
      console.error('Error following/unfollowing profile:', error.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className='pt-8 px-4'>
      <h1 className='text-2xl font-bold mb-4'>College Profile Detail</h1>
      {profile && (
        <div className='mb-4'>
          <p className='font-bold'>Name:</p>
          <p>{profile.name}</p>
          <p className='font-bold mt-2'>Description:</p>
          <p>{profile.description}</p>
        </div>
      )}
      <div className='mb-4'>
        <h2 className='text-lg font-bold mb-2'>Rate this college:</h2>
        <input
          type="range"
          min="0"
          max="5"
          step="1"
          value={rating}
          onChange={handleRatingChange}
          className='w-full'
        />
        <p className='text-sm'>Selected Rating: {rating}</p>
        <textarea
          value={comment}
          onChange={handleCommentChange}
          className='w-full h-24 px-3 py-2 border border-gray-300 rounded mt-2'
          placeholder='Write your comment here...'
        ></textarea>
        <button onClick={handleSubmit} className='mt-2 px-4 py-2 bg-blue-500 text-white rounded'>
          Submit Rating and Comment
        </button>
      </div>
      <div className='mb-4'>
        <h2 className='text-lg font-bold mb-2'>Ratings and Comments</h2>
        <ul>
          {ratingsAndComments.map((item, index) => (
            <li key={index} className='mb-2'>
              <p className='font-bold'>Rating: {item.value}</p>
              <p>Comment: {item.comment}</p>
            </li>
          ))}
        </ul>
      </div>
      <div className='mb-4'>
       
        <p>{followersCount}Followers</p>
      </div>
      <div className='mb-4'>
        <button onClick={handleFollow} className='px-4 py-2 bg-blue-500 text-white rounded'>
          {isFollowing ? 'Unfollow' : 'Follow'}
        </button>
      </div>
    </div>
  );
};

export default CollegeProfileDetailPage;
