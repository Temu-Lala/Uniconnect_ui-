'use client'
import React, { useState } from 'react';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',

  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const authToken = localStorage.getItem('token');

      const response = await fetch('http://127.0.0.1:8000/signup/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        // Redirect to login page or handle success
      } else {
        throw new Error('Registration failed');
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle error
    }
  };

  return (
    <div className=' pt-56'>
      <h1>User Registration</h1>
      <form onSubmit={handleSubmit}>
 
        <div>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}



