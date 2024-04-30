"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';

const Register = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [groups, setGroups] = useState([]);

  // Fetch groups from backend when component mounts
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/groups/');
        setGroups(response.data);
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };

    fetchGroups();
  }, []);

  // Function to generate the path based on the selected group
  const generatePath = (groupId) => {
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
        return '/groups/'; // Default path
    }
  };

  return (
    <div className="bg-black fixed top-0 left-0 w-screen h-screen flex justify-center items-center">
      <div className="w-full max-w-xl">
        <div className="form-control w-full max-w-xs">
          <select
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
            className="select select-bordered w-full max-w-xs"
          >
            <option disabled value="">
              Pick one
            </option>
            {/* Render options based on fetched groups */}
            {groups.map((group) => (
              <option key={group.id} value={group.name}>
                {group.name}
              </option>
            ))}
          </select>
        </div>

        {selectedOption && (
          <Link href={generatePath(selectedOption)} passHref>
            <button className="btn btn-primary mt-4">Go</button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Register;
