"use client";
// components/LoginAsDropdown.js
import React from 'react';
import { useClient } from 'your-client-package'; // Import your client package

export default function LoginAsDropdown({ onLoginAsChange }) {
  const [selectedValue, setSelectedValue] = React.useState('Pick one');
  const client = useClient(); // Initialize your client

  const handleChange = (event) => {
    const selected = event.target.value;
    setSelectedValue(selected);
    onLoginAsChange(selected); // Call the parent component's callback function
  };

  return (
    <div className="form-control w-full max-w-xs">
      <div className="label">
        <span className="label-text">Login As</span>
      </div>
      <select
        className="select select-bordered w-full max-w-xs"
        value={selectedValue}
        onChange={handleChange}
      >
        <option disabled value="Pick one">Pick one</option>
        <option value="Campus">Campus</option>
        <option value="College">College</option>
        <option value="Department">Department</option>
        <option value="Lectures">Lectures</option>
        <option value="University">University</option>
        <option value="Users">Users</option>
      </select>
    </div>
  );
}
