// universities/profiles/detail.tsx

"use client"
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit } from 'react-icons/fa';


const ProfileDetailPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const { id } = params;

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [ratingsAndComments, setRatingsAndComments] = useState([]);
  const [showAllComments, setShowAllComments] = useState(false);
  const [editCommentId, setEditCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState('');

  useEffect(() => {
      if (id) {
          fetchProfile(id);
          fetchRatingsAndComments(id);
      }
  }, [id]);

  const fetchProfile = async (id) => {
      try {
          const response = await axios.get(`http://127.0.0.1:8000/university-profiles/${id}/`, {
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
          const response = await axios.get(`http://127.0.0.1:8000/university_rating/?university_id=${id}`, {
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
          const response = await axios.post(
              'http://127.0.0.1:8000/university_rating/',
              {
                  university_id: id,
                  value: rating,
                  comment: comment
              },
              {
                  headers: {
                      Authorization: `Bearer ${localStorage.getItem('token')}`
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

  const handleLoadMoreComments = () => {
      setShowAllComments(true);
  };

  const handleEditComment = async (commentId, newComment) => {
      try {
          const response = await axios.put(
              `http://127.0.0.1:8000/edit_comment/${commentId}/`,
              { comment: newComment },
              {
                  headers: {
                      Authorization: `Bearer ${localStorage.getItem('token')}`
                  }
              }
          );
          console.log('Comment updated successfully:', response.data);
          fetchRatingsAndComments(id);
          setEditCommentId(null);
      } catch (error) {
          console.error('Error updating comment:', error.message);
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
                  <p>Rate this university:</p>
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
          )}
          <div>
              <h2>Ratings and Comments</h2>
              <ul>
                  {ratingsAndComments.slice(0, showAllComments ? undefined : 5).map((item, index) => (
                      <li key={index}>
                          <p>Rating: {item.value}</p>
                          {item.user_id === localStorage.getItem('userId') && editCommentId === item.comment_id ? (
                              <div>
                                  <textarea defaultValue={item.comment} onChange={(e) => setEditCommentText(e.target.value)}></textarea>
                                  <button onClick={() => handleEditComment(item.comment_id, editCommentText)}>Update Comment</button>
                                  <button onClick={() => setEditCommentId(null)}>Cancel</button>
                              </div>
                          ) : (
                              <div>
                                  <p>Comment: {item.comment}</p>
                                  {item.user_id === localStorage.getItem('userId') && (
                                      <FaEdit onClick={() => setEditCommentId(item.comment_id)} />
                                  )}
                              </div>
                          )}
                      </li>
                  ))}
              </ul>
              {!showAllComments && (
                  <button onClick={handleLoadMoreComments}>Load More</button>
              )}
          </div>
      </div>
  );
};

export default ProfileDetailPage;
