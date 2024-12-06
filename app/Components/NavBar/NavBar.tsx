"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { BsBell } from "react-icons/bs";
import { IoChatbubbleEllipsesOutline, IoHomeOutline } from "react-icons/io5";
import { CiLogin } from "react-icons/ci";
import { PiNewspaper } from "react-icons/pi";
import { useAuthContext } from "@/app/contexts/AuthContext";

import Link from "next/link";
import Logo from "./Logo";
import SearchModal from "./SearchModal";
import Notifications from "./Notifications";
import ProfileDropdown from "./ProfileDropdown";
import Search from "../Search/Search";
import SideBar from "./SideBar";
import ThemeToggler from "../ThemeToggler/ThemeToggler";
import { toast } from "sonner";
import Register from "@/app/(auth)/Update/page";

interface Notification {
  id: number;
  recipient: number;
  sender: string;
  message: string;
  type: string;
  imgPath: string;
  timestamp: string;
}
const NavBar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [notificationCount, setNotificationCount] = useState<number>(0);
  const { user, isLoggedIn, logout } = useAuthContext();
  const router = useRouter();


  const getNotificationCount = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get("http://127.0.0.1:8000/notifications/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }); 

      if (response.status === 200) {
        const userNotifications = response.data.filter((notification: Notification) => notification.recipient === user?.id);
        setNotificationCount(userNotifications.length);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getNotificationCount();
  }, [notificationCount]);

  const handleLogin = () => {
    router.push("/Login");
  };

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


  return (
    <>
      <header className="navbar fixed top-0 left-0 w-full bg-base-100 dark:bg-slate-400 flex justify-between gap-4 items-center px-4 z-[99999]">
        <Logo ctx="home" />

        <div className="hidden xl:flex ml-8 justify-center flex-1 max-w-[700px]">
          <Search />
        </div>

        {/* Center navigation link icons - hidden on small screens */}
        {isLoggedIn && (
          <div className="hidden sm:flex gap-8 flex-grow flex-1 justify-center">
            <SearchModal />

            <div className="tooltip tooltip-bottom" data-tip="Home">
              <Link href="/" className="btn btn-ghost btn-circle">
                <IoHomeOutline className="text-2xl cursor-pointer" />
              </Link>
            </div>

            <div className="tooltip tooltip-bottom" data-tip="Posts">
              <Link href="/News" className="btn btn-ghost btn-circle">
                <PiNewspaper className="text-2xl cursor-pointer" />
              </Link>
            </div>

            <div className="tooltip tooltip-bottom" data-tip="Message">
              <Link href="/Message" className="btn btn-ghost btn-circle">
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
                  {notificationCount > 0 ? (
                    <span className="badge badge-sm indicator-item bg-blue-600 text-white">
                      {notificationCount}
                    </span>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
              <Notifications />
            </div>
            <Register />
          </div>
        )}

        {/* if user is not logged in */}
        {!isLoggedIn && (
          <div>
            <button
              className="btn !min-h-8 h-10 bg-blue-600 text-white px-8"
              onClick={handleLogin}
            >
              Login
              <CiLogin className="text-lg" />
            </button>
            <div className="tooltip tooltip-bottom" data-tip="Home">
              <Link href="/" className="btn btn-ghost btn-circle">
                <IoHomeOutline className="text-xl cursor-pointer" />
              </Link>
            </div>

            <div className="tooltip tooltip-bottom" data-tip="Posts">
              <Link href="/News" className="btn btn-ghost btn-circle">
                <PiNewspaper className="text-2xl cursor-pointer" />
              </Link>
            </div>
          </div>
        )}

        {/* Right Profile Dropdown */}
        {isLoggedIn && <ProfileDropdown />}

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
      </header>

      {/* Hidden Sidebar Menu for Small Screens */}
      <SideBar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        closeMenu={closeMenu}
      />
    </>
  );
};

export default NavBar;
