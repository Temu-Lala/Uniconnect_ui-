"use client"
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Send a request to the backend API to authenticate the user
      const response = await axios.post('http://127.0.0.1:8000/login/', {
        username,
        password,
      });

      // If authentication is successful, fetch the user's profile data
      const userProfileResponse = await axios.get('http://127.0.0.1:8000/GustUser/', {
        headers: {
          Authorization: `Bearer ${response.data.token}`, // Include the authentication token in the request headers
        },
      });

      // Check if the user profile exists in the database
      if (userProfileResponse.data.length > 0) {
        // User is registered, redirect to the home page
        router.push('/');
      } else {
        // User is not registered, display an error message
        setError('User not registered');
      }
    } catch (error) {
      // Handle login error
      console.error('Login error:', error);
      setError('Login failed');
    }
  };

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Login now!</h1>
          <p className="py-6">Your login form content...</p>
        </div>
        <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
          <form className="card-body" onSubmit={handleLogin}>
            {/* Your login form fields */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Username</span>
              </label>
              <input
                type="text"
                placeholder="Username"
                className="input input-bordered"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="Password"
                className="input input-bordered"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary">
                Login
              </button>
            </div>
          </form>
          {error && <p className="text-red-500">{error}</p>}
        </div>
      </div>
    </div>
  );
}