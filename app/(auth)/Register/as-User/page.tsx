'use client'
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FiUser, FiMail, FiLock, FiCamera, FiLink, FiPhone, FiArrowRight } from 'react-icons/fi';

export default function Register() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    username: '',
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

    // Check if required fields are filled
    if (
      formData.name.trim() === '' ||
      formData.email.trim() === '' ||
      formData.password.trim() === '' ||
      formData.username.trim() === ''
    ) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const data = new FormData();
      for (const key in formData) {
        data.append(key, formData[key]);
      }

      const response = await axios.post('http://127.0.0.1:8000/GustUser/', data);
      if (response.status === 201) {
        alert('You have registered successfully.');
        // Redirect to home page after successful registration
        router.push('/');
      } else {
        alert('Registration failed.');
      }
    } catch (error) {
      console.error(error);
      alert('Registration failed.');
    }

    // Clear form data after submission
    setFormData({
      name: '',
      username: '',
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
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg px-12 py-10 w-96">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Register</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <div className="flex items-center border-b border-gray-400">
              <FiUser className="w-6 h-6 mr-2 text-gray-600" />
              <input
                className="appearance-none bg-transparent border-none w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="mb-6">
            <div className="flex items-center border-b border-gray-400">
              <FiUser className="w-6 h-6 mr-2 text-gray-600" />
              <input
                className="appearance-none bg-transparent border-none w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="mb-6">
            <div className="flex items-center border-b border-gray-400">
              <FiMail className="w-6 h-6 mr-2 text-gray-600" />
              <input
                className="appearance-none bg-transparent border-none w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="mb-6">
            <div className="flex items-center border-b border-gray-400">
              <FiLock className="w-6 h-6 mr-2 text-gray-600" />
              <input
                className="appearance-none bg-transparent border-none w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="mb-6">
            <div className="flex items-center border-b border-gray-400">
              <FiUser className="w-6 h-6 mr-2 text-gray-600" />
              <select
                className="appearance-none bg-transparent border-none w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
              </select>
            </div>
          </div>
          <div className="mb-6">
            <div className="flex items-center border-b border-gray-400">
              <FiUser className="w-6 h-6 mr-2 text-gray-600" />
              <input
                className="appearance-none bg-transparent border-none w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="number"
                name="age"
                placeholder="Age"
                value={formData.age}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="mb-6">
            <div className="flex items-center border-b border-gray-400">
              <FiCamera className="w-6 h-6 mr-2 text-gray-600" />
              <input type="file" name="coverPhoto" accept="image/*" onChange={handleChange} />
            </div>
          </div>
          <div className="mb-6">
            <div className="flex items-center border-b border-gray-400">
              <FiCamera className="w-6 h-6 mr-2 text-gray-600" />
              <input type="file" name="profilePhoto" accept="image/*" onChange={handleChange} />
            </div>
          </div>
          <div className="mb-6">
            <div className="flex items-center border-b border-gray-400">
              <FiLink className="w-6 h-6 mr-2 text-gray-600" />
              <input
                className="appearance-none bg-transparent border-none w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                name="link"
                placeholder="Link"
                value={formData.link}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="mb-6">
            <div className="flex items-center border-b border-gray-400">
              <FiPhone className="w-6 h-6 mr-2 text-gray-600" />
              <input
                className="appearance-none bg-transparent border-none w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="flex items-center justify-center">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Register <FiArrowRight className="w-6 h-6 ml-2" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}