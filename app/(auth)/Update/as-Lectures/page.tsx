'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NewLecturerCVProfileForm = () => {
  const [formData, setFormData] = useState({
    university_id: '',
    campus_profile_id: '',
    college_profile_id: '',
    department_profile_id: '',
    avatar: null,
    profile_photo: null,
    name: '',
    location: '',
    job_title: '',
    skills1: '',
    skills2: '',
    skills3: '',
    skills4: '',
    about: '',
    phone: '',
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
    project_description3: ''
  });
  const [universities, setUniversities] = useState([]);
  const [campuses, setCampuses] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    const fetchUniversities = async () => {
      const authToken = localStorage.getItem('token');
      try {
        const response = await axios.get('http://127.0.0.1:8000/university-profiles/', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
        });
        setUniversities(response.data);
      } catch (error) {
        console.error('Error fetching universities:', error);
      }
    };

    fetchUniversities();
  }, []);

  const handleUniversityChange = async (e) => {
    const universityId = e.target.value;
    setFormData({ ...formData, university_id: universityId });

    try {
      const authToken = localStorage.getItem('token');
      const response = await axios.get(`http://127.0.0.1:8000/university-profiles/${universityId}/campus-profiles/`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
      });
      setCampuses(response.data);
    } catch (error) {
      console.error('Error fetching campuses:', error);
    }
  };

  const handleCampusChange = async (e) => {
    const campusId = e.target.value;
    setFormData({ ...formData, campus_profile_id: campusId });

    try {
      const authToken = localStorage.getItem('token');
      const response = await axios.get(`http://127.0.0.1:8000/campus-profiles/${campusId}/college-profiles/`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
      });
      setColleges(response.data);
    } catch (error) {
      console.error('Error fetching colleges:', error);
    }
  };

  const handleCollegeChange = async (e) => {
    const collegeId = e.target.value;
    setFormData({ ...formData, college_profile_id: collegeId });

    try {
      const authToken = localStorage.getItem('token');
      const response = await axios.get(`http://127.0.0.1:8000/college-profiles/${collegeId}/department-profiles/`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
      });
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const handleDepartmentChange = (e) => {
    const departmentId = e.target.value;
    setFormData({ ...formData, department_profile_id: departmentId });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const authToken = localStorage.getItem('token');
    if (authToken) {
      const form = new FormData();
      Object.keys(formData).forEach(key => {
        form.append(key, formData[key]);
      });

      try {
        const response = await axios.post('http://127.0.0.1:8000/create-lecturer-cv/', form, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${authToken}`
          },
        });
        console.log('Department profile created:', response.data);
        setFormData({
          university_id: '',
          campus_profile_id: '',
          college_profile_id: '',
          department_profile_id: '',
          avatar: null,
          profile_photo: null,
          name: '',
          location: '',
          job_title: '',
          skills1: '',
          skills2: '',
          skills3: '',
          skills4: '',
          about: '',
          phone: '',
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
          project_description3: ''
        });
        toast.success('Department profile created successfully');
      } catch (error) {
        console.error('Error creating department profile:', error);
        toast.error('Error creating department profile. Please try again.');
      }
    }
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const renderProgressBar = () => {
    return (
      <div className="flex justify-center mb-6">
        <div className={`h-2 w-1/4 ${currentStep === 1 ? 'bg-red-500' : 'bg-gray-300'}`} />
        <div className={`h-2 w-1/4 ${currentStep === 2 ? 'bg-yellow-500' : 'bg-gray-300'}`} />
        <div className={`h-2 w-1/4 ${currentStep === 3 ? 'bg-green-500' : 'bg-gray-300'}`} />
        <div className={`h-2 w-1/4 ${currentStep === 4 ? 'bg-green-500' : 'bg-gray-300'}`} />
      </div>
    );
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">University</label>
                <select
                  name="university_id"
                  value={formData.university_id}
                  onChange={handleUniversityChange}
                  className="select select-bordered w-full"
                >
                  <option value="">Select University</option>
                  {universities.map((university) => (
                    <option key={university.id} value={university.id}>
                      {university.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Campus</label>
                <select
                  name="campus_profile_id"
                  value={formData.campus_profile_id}
                  onChange={handleCampusChange}
                  className="select select-bordered w-full"
                >
                  <option value="">Select Campus</option>
                  {campuses.map((campus) => (
                    <option key={campus.id} value={campus.id}>
                      {campus.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">College</label>
                <select
                  name="college_profile_id"
                  value={formData.college_profile_id}
                  onChange={handleCollegeChange}
                  className="select select-bordered w-full"
                >
                  <option value="">Select College</option>
                  {colleges.map((college) => (
                    <option key={college.id} value={college.id}>
                      {college.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Department</label>
                <select
                  name="department_profile_id"
                  value={formData.department_profile_id}
                  onChange={handleDepartmentChange}
                  className="select select-bordered w-full"
                >
                  <option value="">Select Department</option>
                  {departments.map((department) => (
                    <option key={department.id} value={department.id}>
                      {department.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Avatar</label>
                <input
                  type="file"
                  name="avatar"
                  onChange={handleFileChange}
                  className="file-input file-input-bordered w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Profile Photo</label>
                <input
                  type="file"
                  name="profile_photo"
                  onChange={handleFileChange}
                  className="file-input file-input-bordered w-full"
                />
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={nextStep}
                className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Next
              </button>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Job Title</label>
                <input
                  type="text"
                  name="job_title"
                  value={formData.job_title}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Skills 1</label>
                <input
                  type="text"
                  name="skills1"
                  value={formData.skills1}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Skills 2</label>
                <input
                  type="text"
                  name="skills2"
                  value={formData.skills2}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Skills 3</label>
                <input
                  type="text"
                  name="skills3"
                  value={formData.skills3}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Skills 4</label>
                <input
                  type="text"
                  name="skills4"
                  value={formData.skills4}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="w-full px-4 py-2 mr-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="w-full px-4 py-2 ml-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Next
              </button>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">About</label>
                <textarea
                  name="about"
                  value={formData.about}
                  onChange={handleChange}
                  className="textarea textarea-bordered w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">LinkedIn</label>
                <input
                  type="text"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Education Background</label>
                <input
                  type="text"
                  name="education_background"
                  value={formData.education_background}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Background Description</label>
                <input
                  type="text"
                  name="background_description"
                  value={formData.background_description}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Education Background 2</label>
                <input
                  type="text"
                  name="education_background2"
                  value={formData.education_background2}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="w-full px-4 py-2 mr-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="w-full px-4 py-2 ml-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Next
              </button>
            </div>
          </>
        );
      case 4:
        return (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Background Description 2</label>
                <input
                  type="text"
                  name="background_description2"
                  value={formData.background_description2}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Education Background 3</label>
                <input
                  type="text"
                  name="education_background3"
                  value={formData.education_background3}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Background Description 3</label>
                <input
                  type="text"
                  name="background_description3"
                  value={formData.background_description3}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Languages</label>
                <input
                  type="text"
                  name="languages"
                  value={formData.languages}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Languages 2</label>
                <input
                  type="text"
                  name="languages2"
                  value={formData.languages2}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Languages 3</label>
                <input
                  type="text"
                  name="languages3"
                  value={formData.languages3}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Professional Experience</label>
                <input
                  type="text"
                  name="professional_experience"
                  value={formData.professional_experience}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Professional Experience 2</label>
                <input
                  type="text"
                  name="professional_experience2"
                  value={formData.professional_experience2}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Professional Experience 3</label>
                <input
                  type="text"
                  name="professional_experience3"
                  value={formData.professional_experience3}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Key Responsibilities</label>
                <input
                  type="text"
                  name="key_responsibilities"
                  value={formData.key_responsibilities}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Key Responsibilities 2</label>
                <input
                  type="text"
                  name="key_responsibilities2"
                  value={formData.key_responsibilities2}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Key Responsibilities 3</label>
                <input
                  type="text"
                  name="key_responsibilities3"
                  value={formData.key_responsibilities3}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Project 1</label>
                <input
                  type="text"
                  name="project1"
                  value={formData.project1}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Project Description 1</label>
                <input
                  type="text"
                  name="project_description1"
                  value={formData.project_description1}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Project 2</label>
                <input
                  type="text"
                  name="project2"
                  value={formData.project2}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Project Description 2</label>
                <input
                  type="text"
                  name="project_description2"
                  value={formData.project_description2}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Project 3</label>
                <input
                  type="text"
                  name="project3"
                  value={formData.project3}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Project Description 3</label>
                <input
                  type="text"
                  name="project_description3"
                  value={formData.project_description3}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="w-full px-4 py-2 mr-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Previous
              </button>
              <button
                type="submit"
                className="w-full px-4 py-2 ml-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Submit
              </button>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="w-full max-w-7xl bg-white p-8 rounded-lg shadow-md">
        <ToastContainer />
        {renderProgressBar()}
        {renderStep()}
      </form>
    </div>
  );
};

export default NewLecturerCVProfileForm;
