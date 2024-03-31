"use client";

import React from 'react'

export default function GovernorNot() {
  const [selectedValue, setSelectedValue] = React.useState('Pick one');

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  return (
    <div className="form-control w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl">
      <div className="label">
        <span className="label-text">Governmental Or Non-Governmental</span>
      </div>
      <select
        className="select select-bordered w-full max-w-xs"
        value={selectedValue}
        onChange={handleChange}
      >
        <option disabled value="Pick one">Pick one</option>
        <option value="Governmental">Governmental</option>
        <option value="Non Governmental">Non Governmental</option>
      </select>
    </div>
  )
}