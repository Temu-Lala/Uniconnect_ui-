"use client";
import React, { useState, useEffect } from 'react';
import { BsFillBellFill } from 'react-icons/bs';
import { FaHome, FaFacebookMessenger, FaNewspaper } from "react-icons/fa";
import { RiUserFollowFill } from "react-icons/ri";
import AlertError from '../Alert/Error/Error';
import Search from '../Search/Search';
import Link from 'next/link';

export default function NavBar() {
  const [selectedAlert, setSelectedAlert] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMenuOpen && !(event.target as HTMLElement).closest('.navbar')) {
        setIsMenuOpen(false);
        setIsOffcanvasOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleAlertClick = (alertType: string) => {
    setSelectedAlert(prevAlert => prevAlert === alertType ? null : alertType);
    setIsMenuOpen(false);
    setIsOffcanvasOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(prevState => !prevState);
    setIsOffcanvasOpen(true);
  };

  return (
    <div>
      <div className="navbar bg-base-100 flex justify-between items-center">
        {/* Left Avatar and Logo */}
        <div className="hidden md:flex items-center ml-4">
          <div tabIndex={0} className="btn btn-ghost btn-circle avatar mr-2 cursor-pointer" onClick={() => console.log('Left Avatar clicked')}>
            <div className="w-10 rounded-full">
              <img alt="Avatar" src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
            </div>
          </div>
          <a className="btn btn-ghost text-xl">Uni Connect</a>
        </div>
        <div className="w-1/3 md:w-auto"> {/* Adjust width for small screens */}
          <Search />
        </div>
        {/* Menu Icon for Small Screens */}
        <div className="md:hidden" onClick={toggleMenu}>
          <svg className={`h-6 w-6 text-white focus:outline-none transition duration-200 ease-in-out ${isOffcanvasOpen ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16m6 0H4m6 0v12m6-6h12m-6 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
            )}
          </svg>
        </div>
        {/* Center Notification Icons - hidden on small screens */}
        <div className="hidden md:flex gap-12 flex-grow justify-center">
          <BsFillBellFill className={`text-3xl cursor-pointer ${selectedAlert === 'bell' ? 'text-primary' : ''}`} onClick={() => handleAlertClick('bell')} />
         <FaHome className="text-3xl cursor-pointer" />
          <FaFacebookMessenger className="text-3xl cursor-pointer" />
          <RiUserFollowFill className="text-3xl cursor-pointer" />
          <FaNewspaper className="text-3xl cursor-pointer" />
        </div>
        {/* Right Profile Dropdown */}
        <div className="dropdown dropdown-end hidden md:block">
          <div tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img alt="Avatar" src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
            </div>
          </div>
          <ul tabIndex={0} className="mt-3 p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
            <li>
            <Link href='/Profiles'>Profile</Link>
            </li>
            <li>  <Link href='/Setting'>Setting</Link></li>
            <li>
              <Link href='/Login'>Logout</Link>
            </li>
          </ul>
        </div>
      </div>
      {/* Display selected alert component */}
      {selectedAlert && (
        <div className="w-96 h-48 rounded-lg bg-gray-800 flex justify-center items-center">
          <AlertError />
        </div>
      )}
      {/* Hidden Menu for Small Screens */}
      {isOffcanvasOpen && (
        <div className="md:hidden fixed top-0 bottom-0 right-0 left-0 h-full bg-black bg-opacity-50">
          <div className="flex flex-col justify-center items-center h-full">
            <BsFillBellFill className={`text-3xl cursor-pointer ${selectedAlert === 'bell' ? 'text-primary' : ''}`} onClick={() => handleAlertClick('bell')} />
            <FaHome className="text-3xl cursor-pointer mt-6" />
            <FaFacebookMessenger className="text-3xl cursor-pointer mt-6" />
            <RiUserFollowFill className="text-3xl cursor-pointer mt-6" />
            <FaNewspaper className="text-3xl cursor-pointer mt-6" />
          </div>
        </div>
      )}
    </div>
  );
}
