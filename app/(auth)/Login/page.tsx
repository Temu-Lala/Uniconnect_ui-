// pages/login.js
'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:8000/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        checkUserAssociation(); // Redirect after successful login
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle error (e.g., display error message to the user)
    }
  };

  const checkUserAssociation = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login'); // Redirect to login if token is not available
        return;
      }

      const response = await fetch('http://127.0.0.1:8000/api/user-profile/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        switch (data.profile_type) {
          case 'university':
            router.push('/Profiles/Universty/');
            break;
          case 'campus':
            router.push('/Profiles/Campus/');
            break;
          case 'college':
            router.push('/Profiles/Collage/');
            break;
          case 'department':
            router.push('/Profiles/Department/');
            break;
          case 'lecturer':
            router.push('/Profiles/Lectures/');
            break;
          default:
            router.push('/');
            break;
        }
      } else {
        throw new Error('Unable to fetch user profile association');
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle error (e.g., redirect to login page or display error message)
    }
  };

  return (
    <div className='mt-48'>
      <h1>User Login</h1>
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
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
