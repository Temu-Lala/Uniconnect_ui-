// Import necessary components and hooks
"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Use axios for making HTTP requests

// Define the NewsFeed component
const NewsFeed = () => {
  // State variables
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  // Fetch user posts on component mount
  useEffect(() => {
    fetchUserPosts();
  }, []);

  // Function to fetch user posts
  const fetchUserPosts = async () => {
    try {
      // Fetch user token from local storage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('User token not found. Please log in.');
      }

      // Make HTTP request to fetch user posts
      const response = await axios.get('http://127.0.0.1:8000/GustUser/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Check if request was successful
      if (response.status !== 200) {
        throw new Error('Failed to fetch user posts');
      }

      // Extract user ID from response data
      const userId = response.data.user_id;

      // Define API endpoints for user posts
      const endpoints = [
        'http://127.0.0.1:8000/college-posts/',
        'http://127.0.0.1:8000/campus-posts/',
        'http://127.0.0.1:8000/university-posts/',
        'http://127.0.0.1:8000/department-posts/',
        'http://127.0.0.1:8000/lecturer-posts/',
      ];

      // Fetch user posts from each endpoint
      const userPosts = await Promise.all(
        endpoints.map(async (endpoint) => {
          const response = await axios.get(`${endpoint}${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          return response.data;
        })
      );

      // Flatten the array of posts
      const flattenedPosts = userPosts.reduce((acc, curr) => acc.concat(curr), []);

      // Set the posts state variable with user posts
      setPosts(flattenedPosts);
    } catch (error) {
      // Handle errors
      console.error('Error fetching user posts:', error.message);
      setError('Failed to fetch user posts. Please try again later.');
    }
  };

  // Render the NewsFeed component
  return (
    <div>
      <h1>User Posts</h1>
      {error && <p>{error}</p>}
      {posts.map((post) => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          {/* Add more fields as needed */}
        </div>
      ))}
    </div>
  );
};

export default NewsFeed;
