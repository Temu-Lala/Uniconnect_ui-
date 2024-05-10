"use client"

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { FaSave, FaWindowClose, FaTrash } from 'react-icons/fa';

const LecturerCV = () => {
  const [lecturerCV, setLecturerCV] = useState({
    name: '',
    location: '',
    job_title: '',
    skills1: '',
    skills2: '',
    skills3: '',
    skills4: '',
    about: '',
    phone: '', // Added phone property here
    email: '',
    linkedin: '',
    education_background: '',
    background_description: '',
    education_background2: '',
    background_description2: '',
    education_background3: '',
    background_description3: '',
    languages: '',
    languages2: '',
    languages3: '',
    professional_experience: '',
    professional_experience2: '',
    professional_experience3: '',
    key_responsibilities: '',
    key_responsibilities2: '',
    key_responsibilities3: '',
    project1: '',
    project_description1: '',
    project2: '',
    project_description2: '',
    project3: '',
    project_description3: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchLecturerCV = async () => {
      try {
        const authToken = localStorage.getItem('token');
        if (!authToken) {
          throw new Error('User authentication token not found. Please log in again.');
        }
        const response = await axios.get('http://localhost:8000/lecturer-cv/', {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        const userCV = response.data.find(cv => cv.user === getCurrentUserId(authToken));
        if (!userCV) {
          throw new Error('Lecturer CV not found');
        }
        setLecturerCV(userCV);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchCurrentUser = async () => {
      try {
        const authToken = localStorage.getItem('token');
        if (!authToken) {
          throw new Error('User authentication token not found. Please log in again.');
        }
        const response = await axios.get('http://127.0.0.1:8000/GustUser/', {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setCurrentUser(response.data);
      } catch (error) {
        console.error('Error fetching current user:', error.message);
      }
    };

    fetchLecturerCV();
    fetchCurrentUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLecturerCV((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const authToken = localStorage.getItem('token');
      if (!authToken) {
        throw new Error('User authentication token not found. Please log in again.');
      }

      const userId = getCurrentUserId(authToken);

      if (lecturerCV.user !== userId) {
        throw new Error('Unauthorized: You do not have permission to update this lecturer CV.');
      }

      await axios.put(`http://localhost:8000/lecturer-cv/update/${lecturerCV.id}/`, lecturerCV, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      console.log('Lecturer CV updated successfully');
    } catch (error) {
      console.error('Error updating lecturer CV:', error.message);
    }
  };

  const handleDelete = async () => {
    try {
      const authToken = localStorage.getItem('token');
      if (!authToken) {
        throw new Error('User authentication token not found. Please log in again.');
      }

      const userId = getCurrentUserId(authToken);

      if (lecturerCV.user !== userId) {
        throw new Error('Unauthorized: You do not have permission to delete this lecturer CV.');
      }

      await axios.delete(`http://localhost:8000/lecturer-cv/delete/${lecturerCV.id}/`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      console.log('Lecturer CV deleted successfully');
      // Optionally, you can clear the form fields or show a success message after deletion
    } catch (error) {
      console.error('Error deleting lecturer CV:', error.message);
    }
  };

  const getCurrentUserId = (token) => {
    try {
      const parsedToken = JSON.parse(atob(token.split('.')[1]));
      return parsedToken.user_id;
    } catch (error) {
      console.error('Error parsing JWT token:', error.message);
      return null;
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <Button variant="outlined" onClick={handleOpen}>
      Delete
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Lecturer CV Details</DialogTitle>
        <DialogContent>
          {/* Text fields here */}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleDelete}>
            <FaTrash /> Delete
          </Button>
          <Button onClick={handleClose}>
            <FaWindowClose /> Cancel
          </Button>

        </DialogActions>
      </Dialog>
    </div>
  );
};

export default LecturerCV;
