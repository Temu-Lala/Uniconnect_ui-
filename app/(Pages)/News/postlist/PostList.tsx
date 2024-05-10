'use client'; 

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PostPage = ({ postId }) => {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        const lecturerPostsResponse = await axios.get(`http://127.0.0.1:8000/lecturer-posts/${postId}`);
        const collegePostsResponse = await axios.get(`http://127.0.0.1:8000/college-posts/${postId}`);
        const campusPostsResponse = await axios.get(`http://127.0.0.1:8000/campus-posts/${postId}`);
        const universityPostsResponse = await axios.get(`http://127.0.0.1:8000/university-posts/${postId}`);
        const departmentPostsResponse = await axios.get(`http://127.0.0.1:8000/department-posts/${postId}`);

        const allPosts = [
          ...lecturerPostsResponse.data,
          ...collegePostsResponse.data,
          ...campusPostsResponse.data,
          ...universityPostsResponse.data,
          ...departmentPostsResponse.data,
        ];

        setPost(allPosts.find(post => post.id === postId));

        const commentsResponse = await axios.get(`http://127.0.0.1:8000/posts/${postId}/comments`);
        setComments(commentsResponse.data);
      } catch (error) {
        console.error('Error fetching post and comments:', error);
      }
    };

    fetchPostAndComments();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://127.0.0.1:8000/posts/${postId}/comments`, {
        body: commentText,
      });
      setCommentText('');
      // Refresh comments
      const response = await axios.get(`http://127.0.0.1:8000/posts/${postId}/comments`);
      setComments(response.data);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div>
      {post && (
        <div className="mb-4">
          <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
          <p className="mb-4">{post.content}</p>
        </div>
      )}
      <h2 className="text-lg font-semibold mb-2">Comments:</h2>
      <div>
        {comments.map((comment) => (
          <div key={comment.id} className="border-b border-gray-400 mb-4">
            <p className="text-gray-700">{comment.body}</p>
            <p className="text-gray-500">Comment by: {comment.author}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="mt-8">
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Write your comment..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
        ></textarea>
        <button type="submit" className="mt-2 bg-indigo-500 text-white px-4 py-2 rounded-md">
          Add Comment
        </button>
      </form>
    </div>
  );
};

export default PostPage;
