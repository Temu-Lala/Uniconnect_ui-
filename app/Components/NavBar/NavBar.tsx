"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { BsBell } from "react-icons/bs";
import { IoChatbubbleEllipsesOutline, IoHomeOutline } from "react-icons/io5";
import { CiLogin } from "react-icons/ci";
import { PiNewspaper } from "react-icons/pi";

import Link from "next/link";
import Logo from "./Logo";
import SearchModal from "./SearchModal";
import Notifications from "./Notifications";
import ProfileDropdown from "./ProfileDropdown";
import Search from "../Search/Search";
import SideBar from "./SideBar";
import ThemeToggler from "../ThemeToggler/ThemeToggler";


const NavBar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const router = useRouter();

  const handleLogin = () => {
    router.push('/Login');
  }

  const toggleMenu = () => {
    // Close sidebar and uncheck the hidden checkbox
    if (isSidebarOpen) {
      setIsSidebarOpen(false);
      document.getElementById("menu-checkbox")?.click();
    } else {
      setIsSidebarOpen(true);
    }
  };

  const closeMenu = () => {
    setIsSidebarOpen(false);
    document.getElementById("menu-checkbox")?.click();
  };

  const axiosInstance = axios.create({
    withCredentials: true, // Include cookies in cross-origin requests
  });

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log(token);
      if (!token) {
        throw new Error("No token found"); // Handle case where token is not available
      }

      const response = await fetch("http://127.0.0.1:8000/logout/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include token in the Authorization header
        },
      });

      if (response.ok) {
        localStorage.removeItem("token"); // Remove token from localStorage
        router.push("/login"); // Redirect to login page after successful logout
      } else {
        throw new Error("Logout failed"); // Handle case where logout request fails
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle error (e.g., display error message to the user)
    }
  };

  return (
    <header className="z-[99999]">
      <div className="navbar fixed top-0 left-0 w-full bg-base-100 dark:bg-slate-400 flex justify-between gap-4 items-center px-4 z-[99999]">
        <Logo ctx="home" />

        <div className="hidden xl:flex ml-8 justify-center flex-1 max-w-[700px]">
          <Search />
        </div>

        {/* Center navigation link icons - hidden on small screens */}
        {/* <div clas   sName="hidden sm:flex gap-8 flex-grow flex-1 justify-center">
          <SearchModal />

          <div className="tooltip tooltip-bottom" data-tip="Home">
            <Link href="/" className="btn btn-ghost btn-circle">
              <IoHomeOutline className="text-2xl cursor-pointer" />
            </Link>
          </div>

          <div className="tooltip tooltip-bottom" data-tip="News">
            <Link href="/News" className="btn btn-ghost btn-circle">
              <PiNewspaper className="text-2xl cursor-pointer" />
            </Link>
          </div>

          <div className="tooltip tooltip-bottom" data-tip="Message">
            <Link href="/message" className="btn btn-ghost btn-circle">
              <IoChatbubbleEllipsesOutline className="text-2xl cursor-pointer" />
            </Link>
          </div>

          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle"
            >
              <div
                className="indicator tooltip tooltip-bottom"
                data-tip="Notification"
              >
                <BsBell className="text-2xl" />
                <span className="badge badge-sm indicator-item bg-blue-600 text-white">
                  5
                </span>
              </div>
            </div>
            <Notifications />
          </div>
        </div> */}

        {/* if user is not logged in */}
        <div>
          <button className="btn !min-h-8 h-10 bg-blue-600 text-white px-8" onClick={handleLogin}>
            Login
            <CiLogin className="text-lg" />
          </button>
          <div className="tooltip tooltip-bottom" data-tip="Home">
            <Link href="/" className="btn btn-ghost btn-circle">
              <IoHomeOutline className="text-xl cursor-pointer" />
            </Link>
          </div>

          <div className="tooltip tooltip-bottom" data-tip="News">
            <Link href="/News" className="btn btn-ghost btn-circle">
              <PiNewspaper className="text-2xl cursor-pointer" />
            </Link>
          </div>
        </div>

        {/* Right Profile Dropdown */}

        {/* <ProfileDropdown handler={handleLogout} /> */}

        {/* Menu Icon for Small Screens */}
        <button className="flex z-[9999] sm:hidden">
          <label className="btn btn-ghost btn-circle swap swap-rotate">
            {/* this hidden checkbox controls the state */}
            <input id="menu-checkbox" type="checkbox" onClick={toggleMenu} />
            {/* hamburger icon */}
            <svg
              className="swap-off fill-current"
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 512 512"
            >
              <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
            </svg>
            {/* close icon */}
            <svg
              className="swap-on fill-current"
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 512 512"
            >
              <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
            </svg>
          </label>
        </button>
      </div>

      {/* Hidden Sidebar Menu for Small Screens */}
      <SideBar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        closeMenu={closeMenu}
      />
    </header>
  );
};

export default NavBar;
