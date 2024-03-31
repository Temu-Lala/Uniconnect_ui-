"use client";
import { useState } from 'react';
import Link from 'next/link';

const Register = () => {
  const [selectedOption, setSelectedOption] = useState(null);

  const options = [
    {
      label: 'Select One ',
     
    },
    {
      label: 'Campus',
      value: '/Register/as-Campus',
    },
    {
      label: 'Collage',
      value: '/Register/as-Collage',
    },
    {
      label: 'Department',
      value: '/Register/as-Department',
    },
    {
      label: 'Lectures',
      value: '/Register/as-Lectures',
    },
    {
      label: 'University',
      value: '/Register/as-Universty',
    },
    {
      label: 'Users',
      value: '/Register/as-User',
    },
  ];

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
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>


        <></>

        {selectedOption && (
          <Link href={selectedOption}>
            <button
              className="btn btn-primary mt-4"
              onClick={() => setSelectedOption(null)}
            >
              Go
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default Register;