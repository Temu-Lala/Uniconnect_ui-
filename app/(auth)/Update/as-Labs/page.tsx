'use client';

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface University {
  id: number;
  name: string;
}

interface Campus {
  id: number;
  name: string;
}

interface College {
  id: number;
  name: string;
}

interface Department {
  id: number;
  name: string;
}

const NewLabProfileForm = () => {
  const [formData, setFormData] = useState({
    university_profile: '',
    campus_profile: '',
    college_profile: '',
    department_profile: '',
    name: '',
    description: '',
    files: [] as File[],
  });

  const [universities, setUniversities] = useState<University[]>([]);
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  useEffect(() => {
    const fetchUniversities = async () => {
      const authToken = localStorage.getItem('token');
      try {
        const response = await axios.get('http://127.0.0.1:8000/university-profiles/', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
        });
        setUniversities(response.data);
      } catch (error) {
        console.error('Error fetching universities:', error);
      }
    };

    fetchUniversities();
  }, []);

  const handleUniversityChange = async (e: ChangeEvent<HTMLSelectElement>) => {
    const universityId = e.target.value;
    setFormData({ ...formData, university_profile: universityId });

    try {
      const authToken = localStorage.getItem('token');
      const response = await axios.get(`http://127.0.0.1:8000/university-profiles/${universityId}/campus-profiles/`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      });
      setCampuses(response.data);
    } catch (error) {
      console.error('Error fetching campuses:', error);
    }
  };

  const handleCampusChange = async (e: ChangeEvent<HTMLSelectElement>) => {
    const campusId = e.target.value;
    setFormData({ ...formData, campus_profile: campusId });

    try {
      const authToken = localStorage.getItem('token');
      const response = await axios.get(`http://127.0.0.1:8000/campus-profiles/${campusId}/college-profiles/`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      });
      setColleges(response.data);
    } catch (error) {
      console.error('Error fetching colleges:', error);
    }
  };

  const handleCollegeChange = async (e: ChangeEvent<HTMLSelectElement>) => {
    const collegeId = e.target.value;
    setFormData({ ...formData, college_profile: collegeId });

    try {
      const authToken = localStorage.getItem('token');
      const response = await axios.get(`http://127.0.0.1:8000/college-profiles/${collegeId}/department-profiles/`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      });
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const handleDepartmentChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const departmentId = e.target.value;
    setFormData({ ...formData, department_profile: departmentId });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData({ ...formData, files });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const authToken = localStorage.getItem('token');
    const userId = parseInt(localStorage.getItem('user_id') || '0', 10); // Ensure user ID is an integer

    if (authToken) {
      const form = new FormData();
      form.append('user', userId.toString()); // Append user as a string
      form.append('university_profile', formData.university_profile);
      form.append('campus_profile', formData.campus_profile);
      form.append('college_profile', formData.college_profile);
      form.append('department_profile', formData.department_profile);
      form.append('name', formData.name);
      form.append('description', formData.description);

      for (let i = 0; i < formData.files.length; i++) {
        form.append('file_uploads', formData.files[i]);
      }

      try {
        const response = await axios.post('http://127.0.0.1:8000/lab-profiles/', form, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${authToken}`,
          },
        });
        console.log('Lab profile created:', response.data);
        setFormData({
          university_profile: '',
          campus_profile: '',
          college_profile: '',
          department_profile: '',
          name: '',
          description: '',
          files: [],
        });
        toast.success('Lab profile created successfully');
      } catch (error) {
        console.error('Error creating lab profile:', error);
        toast.error('Error creating lab profile. Please try again.');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <form onSubmit={handleSubmit} className="w-full max-w-7xl bg-gray-800 p-8 rounded-lg shadow-md">
        <ToastContainer />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-400">University</label>
            <select
              name="university_profile"
              value={formData.university_profile}
              onChange={handleUniversityChange}
              className="select select-bordered w-full bg-gray-700 text-white border-gray-600"
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
            <label className="block text-sm font-medium text-gray-400">Campus</label>
            <select
              name="campus_profile"
              value={formData.campus_profile}
              onChange={handleCampusChange}
              className="select select-bordered w-full bg-gray-700 text-white border-gray-600"
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
            <label className="block text-sm font-medium text-gray-400">College</label>
            <select
              name="college_profile"
              value={formData.college_profile}
              onChange={handleCollegeChange}
              className="select select-bordered w-full bg-gray-700 text-white border-gray-600"
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
            <label className="block text-sm font-medium text-gray-400">Department</label>
            <select
              name="department_profile"
              value={formData.department_profile}
              onChange={handleDepartmentChange}
              className="select select-bordered w-full bg-gray-700 text-white border-gray-600"
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
            <label className="block text-sm font-medium text-gray-400">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input input-bordered w-full bg-gray-700 text-white border-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="textarea textarea-bordered w-full bg-gray-700 text-white border-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400">Files</label>
            <input
              type="file"
              name="files"
              multiple
              onChange={handleFileChange}
              className="file-input file-input-bordered w-full bg-gray-700 text-white border-gray-600"
            />
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewLabProfileForm;
