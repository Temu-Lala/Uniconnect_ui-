// components/AddCommentForm.js
import React, { useState } from 'react';
import axios from 'axios';

const AddCommentForm = ({ postId, postType }) => {
  const [commentText, setCommentText] = useState('');

  const handleCommentSubmit = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/add-comment/', {
        postId,
        postType,
        commentText
      });
      // Assuming your backend returns the newly created comment
      console.log('New comment:', response.data);
      // Clear the comment text field after submission
      setCommentText('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div className="mb-4">
      <h4 className="text-lg font-semibold mb-2">Add a Comment:</h4>
      <textarea
        className="border border-gray-400 rounded-md p-2 w-full"
        rows="3"
        placeholder="Write your comment here..."
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
      ></textarea>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2"
        onClick={handleCommentSubmit}
      >
        Add Comment
      </button>
    </div>
  );
};

export default AddCommentForm;
