// universities/profiles/detail.tsx

"use client"
// universities/profiles/detail.tsx

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import axios from 'axios';

const DepartmentProfileDetailPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const { id } = params;

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [ratingsAndComments, setRatingsAndComments] = useState([]);

  useEffect(() => {
    if (id) {
      fetchProfile(id);
      fetchRatingsAndComments(id);
    }
  }, [id]);

  const fetchProfile = async (id) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/department-profiles/${id}/`, {
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
      const response = await axios.get(`http://127.0.0.1:8000/department_rating/?department_id=${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setRatingsAndComments(response.data);
    } catch (error) {
      console.error('Error fetching ratings and comments:', error.message);
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
        'http://127.0.0.1:8000/department_rating/',
        {
          department_id: id,
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
    <div>
      <h1>Department Profile Detail</h1>
      {profile && (
        <div>
          <p>Name: {profile.name}</p>
          <p>Description: {profile.description}</p>
          {/* Add other profile details here */}
        </div>
      )}
      <div>
        <h2>Rate this department:</h2>
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

export default DepartmentProfileDetailPage;
