// pages/login.js
'use client'
// pages/login.js
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:8000/loginas/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        router.push('/profile-selection'); // Redirect to profile selection page
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle error (e.g., display error message to the user)
    }
  };

  return (
    <div className=' pt-48'>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input type="text" name="username" value={formData.username} onChange={handleChange} />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
