"use client";

import React, { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';
import { Button, Modal, Input, Select } from 'antd';
import Link from 'next/link'; // Import Link from Next.js

const { Option } = Select;

// Define types for user profile and groups
interface UserProfileType {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  gender: string;
  age: string;
  group: number | null;
}

interface GroupType {
  id: number;
  name: string;
}

const UserProfile: React.FC = () => {
  const [userData, setUserData] = useState<UserProfileType | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState<UserProfileType>({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    gender: '',
    age: '',
    group: null,
  });
  const [groups, setGroups] = useState<GroupType[]>([]);

  useEffect(() => {
    fetchUserData();
    fetchGroups();
  }, []);

  const fetchUserData = async () => {
    try {
      const authToken = localStorage.getItem('token');
      const response = await axios.get('http://127.0.0.1:8000/user-profile/', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
      });
      setUserData(response.data);
      setUpdatedProfile(response.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchGroups = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/groups/');
      setGroups(response.data);
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedProfile({ ...updatedProfile, [name]: value });
  };

  const handleGroupChange = (value: number) => {
    setUpdatedProfile({ ...updatedProfile, group: value });
  };

  const handleModalOk = async () => {
    try {
      const authToken = localStorage.getItem('token');
      await axios.put('http://127.0.0.1:8000/user-profile/', updatedProfile, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
      });
      setIsModalVisible(false);
      fetchUserData();
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

  // Function to generate path based on group ID
  const generatePath = (groupId: string) => {
    switch (groupId) {
      case 'Campus':
        return '/Register/as-Campus';
      case 'Collage':
        return '/Register/as-Collage';
      case 'Department':
        return '/Register/as-Department';
      case 'Lectures':
        return '/Register/as-Lectures';
      case 'University':
        return '/Register/as-University';
      default:
        return '/groups/';
    }
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
          <p>Group: {userData.group}</p>
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
        <Select
          placeholder="Gender"
          value={updatedProfile.gender}
          onChange={(value) => setUpdatedProfile({ ...updatedProfile, gender: value })}
        >
          <Option value="male">Male</Option>
          <Option value="female">Female</Option>
        </Select>
        <Input placeholder="Age" name="age" value={updatedProfile.age} onChange={handleInputChange} />
        <Select
          placeholder="Group"
          value={updatedProfile.group ?? undefined} // Ensure the value is a number or undefined
          onChange={handleGroupChange}
        >
          {groups.map(group => (
            <Option key={group.id} value={group.id}>{group.name}</Option>
          ))}
        </Select>
      </Modal>
    </div>
  );
};

export default UserProfile;
