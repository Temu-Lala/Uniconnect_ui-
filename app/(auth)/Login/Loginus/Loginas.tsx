"use client";

import React from 'react'

export default function Loginas() {
  const [selectedValue, setSelectedValue] = React.useState('Pick one');

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  return (
    <div className="form-control w-full max-w-xs">
      <div className="label">
        <span className="label-text">Login Us a </span>
      </div>
      <select
        className="select select-bordered w-full max-w-xs"
        value={selectedValue}
        onChange={handleChange}
      >
        <option disabled value="Pick one">Pick one</option>
        <option value="Campus">Campus</option>
        <option value="Collage">Collage</option>
        <option value="Department">Department</option>
        <option value="Lectures">Lectures</option>
        <option value="University">University</option>
        <option value="Users">Users</option>
      </select>
    </div>
  )
}