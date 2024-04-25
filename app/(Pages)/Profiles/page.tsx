"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Modal, Input, Select } from 'antd';

const { Option } = Select;

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    gender: '',
    age: '',
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://127.0.0.1:8000/user-profile/', {
        headers: {
          Authorization: `Token ${token}`,
          'X-CSRFToken': getCSRFToken(), // Include CSRF token in headers
        }
      });
      setUserData(response.data);
      setUpdatedProfile(response.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const getCSRFToken = () => {
    const csrfCookie = document.cookie.split(';').find(c => c.trim().startsWith('csrftoken='));
    if (csrfCookie) {
      return csrfCookie.split('=')[1];
    }
    return null;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProfile({ ...updatedProfile, [name]: value });
  };

  const handleModalOk = async () => {
    try {
      const token = localStorage.getItem('token');
      const csrfToken = getCSRFToken(); // Retrieve CSRF token
      await axios.put('http://127.0.0.1:8000/user-profile/', updatedProfile, {
        headers: {
          Authorization: `Token ${token}`,
          'X-CSRFToken': csrfToken, // Include CSRF token in headers
        }
      });
      setIsModalVisible(false);
      fetchUserData(); // Refresh user data after update
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };
  

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  return (
    <div>
      <h1>User Profile</h1>
      {userData && (
        <div>
          <p>Username: {userData.username}</p>
          <p>Email: {userData.email}</p>
          <p>First Name: {userData.first_name}</p>
          <p>Last Name: {userData.last_name}</p>
          <p>Gender: {userData.gender}</p>
          <p>Age: {userData.age}</p>
          <Button type="primary" onClick={showModal}>
            Update Profile
          </Button>
        </div>
      )}
      <Modal title="Update Profile" visible={isModalVisible} onOk={handleModalOk} onCancel={handleModalCancel}>
        <Input placeholder="Username" name="username" value={updatedProfile.username} onChange={handleInputChange} />
        <Input placeholder="Email" name="email" value={updatedProfile.email} onChange={handleInputChange} />
        <Input placeholder="First Name" name="first_name" value={updatedProfile.first_name} onChange={handleInputChange} />
        <Input placeholder="Last Name" name="last_name" value={updatedProfile.last_name} onChange={handleInputChange} />
        <Select placeholder="Gender" value={updatedProfile.gender} onChange={(value) => setUpdatedProfile({ ...updatedProfile, gender: value })}>
          <Option value="male">Male</Option>
          <Option value="female">Female</Option>
        </Select>
        <Input placeholder="Age" name="age" value={updatedProfile.age} onChange={handleInputChange} />
      </Modal>
    </div>
  );
};

export default UserProfile;
