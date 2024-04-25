"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter from next/router
import axios from 'axios';

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const router = useRouter(); // Get router object from Next.js

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://127.0.0.1:8000/Universitylogin/', {
                username,
                password,
            });

            if (response.data.status === 'success') {
                const accessToken = response.data.access;
                localStorage.setItem('accessToken', accessToken); // Store access token in local storage
                setError(null); // Clear any previous errors
                router.push('/'); // Redirect to home page
            } else {
                setError(response.data.error || 'Invalid credentials'); // Display specific error message or default "Invalid credentials"
            }
        } catch (error) {
            console.error(error);
            setError('An unexpected error occurred.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            {error && <p className="error">{error}</p>}
            <button type="submit">Login</button>
        </form>
    );
};

export default LoginForm;
