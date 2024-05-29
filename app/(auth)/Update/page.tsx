'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

interface Group {
  id: number;
  name: string;
}

const Register = () => {
  const [selectedOption, setSelectedOption] = useState<string | undefined>(undefined);
  const [groups, setGroups] = useState<Group[]>([]);

  // Fetch groups from the backend when the component mounts
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

  // Function to handle the Go button click
  const handleGoButtonClick = async () => {
    try {
      const authToken = localStorage.getItem('token');
      // Store the user into the selected group
      await axios.post(
        'http://127.0.0.1:8000/store-user-into-group/',
        { group: selectedOption },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      // Redirect the user to the registration page for the selected group
      window.location.href = `/Update/as-${selectedOption}`;
    } catch (error) {
      console.error('Error storing user into group:', error);
      // Handle error if needed
    }
  };

  return (
    <div className="bg-white h-screen mt-[67px] p-4">
      <h2>Transform Your account to the next level.</h2>
      <div className="w-full max-w-xl">
        <div className="form-control w-full max-w-xs">
          <select
            value={selectedOption ?? ''}
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
          <button className="btn btn-primary mt-4" onClick={handleGoButtonClick}>Go</button>
        )}
      </div>
    </div>
  );
};

export default Register;
