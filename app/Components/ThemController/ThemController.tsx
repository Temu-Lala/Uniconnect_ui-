"use client"
import React, { useState } from 'react';
import { SlOptions } from "react-icons/sl";

export default function ThemeController() {
    const [isChecked, setIsChecked] = useState(false);

    const handleInputChange = () => {
      setIsChecked(!isChecked); // Toggle the state value
    };

    return (
        <div className="dropdown relative">
            <div tabIndex={0} role="button" className="btn m-1" onClick={handleInputChange}>
<SlOptions/>            </div>
            {isChecked && (
                <ul tabIndex={0} className="dropdown-content z-[1] p-2 shadow-2xl bg-base-300 rounded-box w-36 absolute">
                    <li><input type="radio" name="theme-dropdown" className="theme-controller btn btn-sm btn-block btn-ghost justify-start" aria-label="Edit" value="Edit"/></li>
                    <li><input type="radio" name="theme-dropdown" className="theme-controller btn btn-sm btn-block btn-ghost justify-start" aria-label="Delete" value="Delete"/></li>
                    <li><input type="radio" name="theme-dropdown" className="theme-controller btn btn-sm btn-block btn-ghost justify-start" aria-label="Block" value="Block"/></li>
                    <li><input type="radio" name="theme-dropdown" className="theme-controller btn btn-sm btn-block btn-ghost justify-start" aria-label="Report" value="Report"/></li>
                </ul>
            )}
        </div>
    );
}
