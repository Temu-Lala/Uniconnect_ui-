"use client"
import React, { useState, useEffect } from 'react';

const EditCommentPage = () => {
  const [comment, setComment] = useState(null);
  const [updatedCommentText, setUpdatedCommentText] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch comment data based on postId and postType
    const fetchCommentData = async () => {
      try {
        const authToken = localStorage.getItem('token');
        if (!authToken) {
          throw new Error('User authentication token not found. Please log in again.');
        }

        const response = await fetch(`http://127.0.0.1:8000/comments/${commentId}/edit`, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch comment data');
        }
        const commentData = await response.json();
        setComment(commentData);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchCommentData();
  }, []);

  const handleUpdateComment = async () => {
    try {
      const authToken = localStorage.getItem('token');
      if (!authToken) {
        throw new Error('User authentication token not found. Please log in again.');
      }

      const response = await fetch(`http://127.0.0.1:8000/comments/${commentId}/edit`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({ commentText: updatedCommentText }),
      });

      if (!response.ok) {
        throw new Error('Failed to update comment');
      }

      // Handle successful update
    } catch (error) {
      setError(error.message);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!comment) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Edit Comment</h2>
      <textarea
        value={updatedCommentText}
        onChange={(e) => setUpdatedCommentText(e.target.value)}
      />
      <button onClick={handleUpdateComment}>Update Comment</button>
    </div>
  );
};

export default EditCommentPage;
