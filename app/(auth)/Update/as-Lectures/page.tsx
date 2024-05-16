"use client"

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LecturerFormData, initialFormData } from '@/app/types/types'

const LecturerForm: React.FC = () => {
  const [formData, setFormData] = useState<LecturerFormData>(initialFormData);
  const [universities, setUniversities] = useState<any[]>([]);
  const [campuses, setCampuses] = useState<any[]>([]);
  const [colleges, setColleges] = useState<any[]>([]);
  const [selectedUniversityId, setSelectedUniversityId] = useState<string>('');
  const [selectedCampusId, setSelectedCampusId] = useState<string>('');

  // Fetch universities from API
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/university-profiles/')
      .then(response => {
        setUniversities(response.data);
      })
      .catch(error => {
        console.error('Error fetching universities:', error);
      });
  }, []);

  // Fetch campuses when a university is selected
  useEffect(() => {
    if (selectedUniversityId) {
      axios.get(`http://127.0.0.1:8000/university-profiles/${selectedUniversityId}/campus-profiles/`)
        .then(response => {
          setCampuses(response.data);
        })
        .catch(error => {
          console.error('Error fetching campuses:', error);
        });
    }
  }, [selectedUniversityId]);

  // Fetch colleges when a campus is selected
  useEffect(() => {
    if (selectedCampusId) {
      axios.get(`http://127.0.0.1:8000/campus-profiles/${selectedCampusId}/college-profiles/`)
        .then(response => {
          setColleges(response.data);
        })
        .catch(error => {
          console.error('Error fetching colleges:', error);
        });
    }
  }, [selectedCampusId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUniversityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const universityId = e.target.value;
    setSelectedUniversityId(universityId);
  };

  const handleCampusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const campusId = e.target.value;
    setSelectedCampusId(campusId);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Send formData to backend
    console.log(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* University Select */}
      <label>
        University:
        <select value={selectedUniversityId} onChange={handleUniversityChange}>
          <option value="">Select University</option>
          {universities.map(university => (
            <option key={university.id} value={university.id}>{university.name}</option>
          ))}
        </select>
      </label>

      {/* Campus Select */}
      <label>
        Campus:
        <select value={selectedCampusId} onChange={handleCampusChange} disabled={!selectedUniversityId}>
          <option value="">Select Campus</option>
          {campuses.map(campus => (
            <option key={campus.id} value={campus.id}>{campus.name}</option>
          ))}
        </select>
      </label>

      {/* College Select */}
      {/* Add similar select for colleges based on the selected campus */}

      {/* Other Form Fields */}
      {/* Add input fields for other form fields, e.g., name, job_title, etc. */}

      <button type="submit">Submit</button>
    </form>
  );
};

export default LecturerForm;
