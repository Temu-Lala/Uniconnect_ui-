"use client"

import React, { useState, useEffect, ChangeEvent, MouseEvent } from 'react';
import axios from 'axios';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { FaSave, FaWindowClose } from 'react-icons/fa';

interface LecturerCVData {
  id?: number;
  name: string;
  location: string;
  job_title: string;
  skills1: string;
  skills2: string;
  skills3: string;
  skills4: string;
  about: string;
  phone: string; // Added phone property here
  email: string;
  linkedin: string;
  education_background: string;
  background_description: string;
  education_background2: string;
  background_description2: string;
  education_background3: string;
  background_description3: string;
  languages: string;
  languages2: string;
  languages3: string;
  professional_experience: string;
  professional_experience2: string;
  professional_experience3: string;
  key_responsibilities: string;
  key_responsibilities2: string;
  key_responsibilities3: string;
  project1: string;
  project_description1: string;
  project2: string;
  project_description2: string;
  project3: string;
  project_description3: string;
  user?: number; // Added user property here
}

const LecturerCV = () => {
  const [lecturerCV, setLecturerCV] = useState<LecturerCVData>({
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
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
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
        const userCV = response.data.find((cv: LecturerCVData) => cv.user === getCurrentUserId(authToken));
        if (!userCV) {
          throw new Error('Lecturer CV not found');
        }
        setLecturerCV(userCV);
      } catch (error) {
        setError((error as Error).message);
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
        console.error('Error fetching current user:', (error as Error).message);
      }
    };

    fetchLecturerCV();
    fetchCurrentUser();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLecturerCV((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
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
      console.error('Error updating lecturer CV:', (error as Error).message);
    }
  };

  const getCurrentUserId = (token: string) => {
    try {
      const parsedToken = JSON.parse(atob(token.split('.')[1]));
      return parsedToken.user_id;
    } catch (error) {
      console.error('Error parsing JWT token:', (error as Error).message);
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
        View / Update
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Lecturer CV Details</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            name="name"
            value={lecturerCV.name}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Location"
            name="location"
            value={lecturerCV.location}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Job Title"
            name="job_title"
            value={lecturerCV.job_title}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Skills 1"
            name="skills1"
            value={lecturerCV.skills1}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Skills 2"
            name="skills2"
            value={lecturerCV.skills2}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Skills 3"
            name="skills3"
            value={lecturerCV.skills3}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Skills 4"
            name="skills4"
            value={lecturerCV.skills4}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="About"
            name="about"
            value={lecturerCV.about}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Phone"
            name="phone"
            value={lecturerCV.phone}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Email"
            name="email"
            value={lecturerCV.email}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="LinkedIn"
            name="linkedin"
            value={lecturerCV.linkedin}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Education Background"
            name="education_background"
            value={lecturerCV.education_background}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Background Description"
            name="background_description"
            value={lecturerCV.background_description}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Education Background 2"
            name="education_background2"
            value={lecturerCV.education_background2}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Background Description 2"
            name="background_description2"
            value={lecturerCV.background_description2}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Education Background 3"
            name="education_background3"
            value={lecturerCV.education_background3}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Background Description 3"
            name="background_description3"
            value={lecturerCV.background_description3}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Languages"
            name="languages"
            value={lecturerCV.languages}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Languages 2"
            name="languages2"
            value={lecturerCV.languages2}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Languages 3"
            name="languages3"
            value={lecturerCV.languages3}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Professional Experience"
            name="professional_experience"
            value={lecturerCV.professional_experience}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Professional Experience 2"
            name="professional_experience2"
            value={lecturerCV.professional_experience2}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Professional Experience 3"
            name="professional_experience3"
            value={lecturerCV.professional_experience3}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Key Responsibilities"
            name="key_responsibilities"
            value={lecturerCV.key_responsibilities}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Key Responsibilities 2"
            name="key_responsibilities2"
            value={lecturerCV.key_responsibilities2}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Key Responsibilities 3"
            name="key_responsibilities3"
            value={lecturerCV.key_responsibilities3}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Project 1"
            name="project1"
            value={lecturerCV.project1}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Project Description 1"
            name="project_description1"
            value={lecturerCV.project_description1}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Project 2"
            name="project2"
            value={lecturerCV.project2}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Project Description 2"
            name="project_description2"
            value={lecturerCV.project_description2}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Project 3"
            name="project3"
            value={lecturerCV.project3}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Project Description 3"
            name="project_description3"
            value={lecturerCV.project_description3}
            onChange={handleChange}
            fullWidth
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>
            <FaWindowClose /> Cancel
          </Button>
          <Button onClick={handleSubmit}>
            <FaSave /> Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default LecturerCV;
