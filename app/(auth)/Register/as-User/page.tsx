'use client'

import React, { useState } from 'react';
import axios from 'axios';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    age: '',
    email: '',
    password: '',
    coverPhoto: null,
    profilePhoto: null,
    link: '',
    phone: '',
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({ ...formData, [name]: type === 'file' ? e.target.files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.name.length === 0 || formData.email.length === 0 || formData.password.length === 0) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const data = new FormData();
      for (const key in formData) {
        data.append(key, formData[key]);
      }

      const response = await axios.post('http://127.0.0.1:8000/user-profiles/', data);
      if (response.status === 201) {
        alert("You have registered successfully.");
      } else {
        alert("Registration failed.");
      }
    } catch (error) {
      console.error(error);
      alert("Registration failed.");
    }

    // Clear form data after submission
    setFormData({
      name: '',
      gender: '',
      age: '',
      email: '',
      password: '',
      coverPhoto: null,
      profilePhoto: null,
      link: '',
      phone: '',
    });
  };

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
        <select name="gender" value={formData.gender} onChange={handleChange} required>
          <option value="">Select Gender</option>
          <option value="M">Male</option>
          <option value="F">Female</option>
        </select>
        <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
        <input type="file" name="coverPhoto" accept="image/*" onChange={handleChange} />
        <input type="file" name="profilePhoto" accept="image/*" onChange={handleChange} />
        <input type="text" name="link" placeholder="Link" value={formData.link} onChange={handleChange} />
        <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
