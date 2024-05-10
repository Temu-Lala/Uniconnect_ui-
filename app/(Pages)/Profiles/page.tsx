"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Modal, Input, Select } from 'antd';
import Link from 'next/link';
const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [associations, setAssociations] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    gender: '',
    age: '',
    group: null,
  });
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    fetchUserData();
    fetchGroups();
    fetchUserAssociations();
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

  const fetchUserAssociations = async () => {
    try {
      const authToken = localStorage.getItem('token');
      const userId = JSON.parse(atob(authToken.split('.')[1])).user_id;
  
      const associationEndpoints = [
        'university-profiles',
        'campus-profiles',
        'college-profiles',
        'department-profiles',
        'lecturer-cv'
      ];
  
      const associations = await Promise.all(
        associationEndpoints.map(async endpoint => {
          const response = await axios.get(`http://127.0.0.1:8000/${endpoint}/user/${userId}/`);
          return { endpoint, profile: response.data };
        })
      );
  
      setAssociations(associations);
    } catch (error) {
      console.error('Error fetching user associations:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProfile({ ...updatedProfile, [name]: value });
  };

  const handleGroupChange = (value) => {
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

  // Function to generate path based on group ID (unchanged)...

  return (
    <div>
      <h1>User Profile</h1>
      {userData && (
        <div>
          <p>Username: {userData.username}</p>
          <p>Email: {userData.email}</p>
          <p>First Name: {userData.first_name}</p>
          <p>Last Name: {userData.last_name}</p>

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
          value={updatedProfile.group}
          onChange={handleGroupChange}
        >
          {groups.map(group => (
            <Option key={group.id} value={group.id}>{group.name}</Option>
          ))}
        </Select>
      </Modal>

      {/* Display user profile associations */}
      {associations.map(assoc => (
        <div key={assoc.endpoint}>
          {assoc.hasProfile ? (
            <p>You have a {assoc.endpoint} profile</p>
          ) : (
            <Link href={`/create-profile?type=${assoc.endpoint}`}>
              <a>Create {assoc.endpoint} profile</a>
            </Link>
          )}
        </div>
      ))}
    </div>
  );
};

export default UserProfile;