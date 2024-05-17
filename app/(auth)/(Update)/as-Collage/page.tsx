"use client"

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NewCollegeProfileForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    link: '',
    establishment_date: '',
    number_of_lectures: 0,
    number_of_departments: 0,
    number_of_campuses: 0,
    number_of_colleges: 0,
    about: '',
    location: '',
    group: '',
    university_id: '', // Corrected to 'university_id'
    campus_profile_id: '',
    universities: [],
    campuses: []
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const authToken = localStorage.getItem('token');
        if (authToken) {
          const response = await axios.get('http://127.0.0.1:8000/university-profiles/', {
            headers: {
              'Authorization': `Bearer ${authToken}`
            },
          });
          setFormData(prevFormData => ({
            ...prevFormData,
            universities: response.data
          }));
        }
      } catch (error) {
        console.error('Error fetching universities:', error);
      }
    };

    fetchUniversities();
  }, []);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'university_id') { // Update to 'university_id'
      try {
        const authToken = localStorage.getItem('token');
        const selectedUniversityId = value;
        const response = await axios.get(`http://127.0.0.1:8000/university-profiles/${selectedUniversityId}/campus-profiles/`, {
          headers: {
            'Authorization': `Bearer ${authToken}`
          },
        });
        const campuses = response.data;
        setFormData(prevFormData => ({
          ...prevFormData,
          campus_profile_id: '', // Reset selected campus ID when changing university
          campuses: campuses
        }));
      } catch (error) {
        console.error('Error fetching campuses:', error);
      }
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const authToken = localStorage.getItem('token');
      if (authToken) {
        const response = await axios.post('http://127.0.0.1:8000/college_profiles/', formData, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
        });
        console.log('College profile created:', response.data);
        
        setFormData({
          name: '',
          bio: '',
          link: '',
          establishment_date: '',
          number_of_lectures: 0,
          number_of_departments: 0,
          number_of_campuses: 0,
          number_of_colleges: 0,
          about: '',
          location: '',
          group: '',
          university_id: '', // Corrected to 'university_id'
          campus_profile_id: '',
          universities: [],
          campuses: []
        });
      }
    } catch (error) {
      console.error('Error creating college profile:', error);
    }
  };
  
  return (
    <div className=' pt-56'>
      <h2>Create College Profile</h2>
      <form onSubmit={handleSubmit}>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <label>
          Name:
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
        </label>
        <label>
          Bio:
          <textarea name="bio" value={formData.bio} onChange={handleChange} />
        </label>
        <label>
          Link:
          <input type="text" name="link" value={formData.link} onChange={handleChange} />
        </label>
        <label>
          Establishment Date:
          <input type="date" name="establishment_date" value={formData.establishment_date} onChange={handleChange} />
        </label>
        <label>
          Number of Lectures:
          <input type="number" name="number_of_lectures" value={formData.number_of_lectures} onChange={handleChange} />
        </label>
        <label>
          Number of Departments:
          <input type="number" name="number_of_departments" value={formData.number_of_departments} onChange={handleChange} />
        </label>
        <label>
          Number of Campuses:
          <input type="number" name="number_of_campuses" value={formData.number_of_campuses} onChange={handleChange} />
        </label>
        <label>
          Number of Colleges:
          <input type="number" name="number_of_colleges" value={formData.number_of_colleges} onChange={handleChange} />
        </label>
        <label>
          About:
          <textarea name="about" value={formData.about} onChange={handleChange} />
        </label>
        <label>
          Location:
          <input type="text" name="location" value={formData.location} onChange={handleChange} />
        </label>
        <label>
          Group:
          <input type="text" name="group" value={formData.group} onChange={handleChange} />
        </label>
        <label>
          University:
          <select name="university_id" value={formData.university_id} onChange={handleChange}>
            <option value="">Select University</option>
            {formData.universities.map(university => (
              <option key={university.id} value={university.id}>{university.name}</option>
            ))}
          </select>
        </label>
        <label>
          Campus:
          <select name="campus_profile_id" value={formData.campus_profile_id} onChange={handleChange}>
            <option value="">Select Campus</option>
            {formData.campuses.map(campus => (
              <option key={campus.id} value={campus.id}>{campus.name}</option>
            ))}
          </select>
        </label>
        <button type="submit">Create College Profile</button>
      </form>
    </div>
  );
};

export default NewCollegeProfileForm;











