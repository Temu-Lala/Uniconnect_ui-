import Link from "next/link";
import { useEffect, Fragment } from "react";
import {
  FaRegNewspaper,
  FaRegBell,
} from "react-icons/fa";
import { BsBell } from "react-icons/bs";
import { HiOutlineCog8Tooth } from "react-icons/hi2";
import { FaRegUser } from "react-icons/fa6";
import { IoChatbubbleEllipsesOutline, IoHomeOutline } from "react-icons/io5";
import { IoIosLogOut } from "react-icons/io";
import { TbLetterU } from "react-icons/tb";
import Image from "next/image";
import Search from "../Search/Search";

const SideBar = (props: { isSidebarOpen: boolean; setIsSidebarOpen: Function;  closeMenu: () => void }) => {
  useEffect(() => {
    // Manage scrollbar visibility
    document.body.style.overflow = props.isSidebarOpen ? "hidden" : "auto";

    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // Close the sidebar if clicking outside the sidebar and menu button
      if (props.isSidebarOpen && !target.closest(".sidebar") && !target.closest(".btn")) {
        props.closeMenu();
      }
    };

    // Add event listener to handle outside clicks
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      // Remove event listener when component unmounts or dependencies change
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [props.isSidebarOpen, props.closeMenu]);

  const handleOverlayClick = () => {
    props.closeMenu(); // Close the menu when clicking the overlay
  };

  return (
    <Fragment>
      {/* Sidebar */}
      <div
        className={`sidebar fixed inset-y-0 right-0 w-72 h-screen flex flex-col bg-black text-white p-4 transform transition-transform z-[9999] ${
          props.isSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="sidebar-head mt-[67px] flex flex-col gap-2 align-center justify-center py-6 border-b-1 border-gray-700">
          <div className="relative w-12 h-12 mx-auto btn btn-outlined">
            <Link href="/images/lectures/temesgen.jfif">
                <Image
                  alt="Avatar"
                  src="/images/lectures/temesgen.jfif"
                  fill
                  className="rounded-full"
                />
            </Link>
          </div>
          <p className="text-center font-light text-gray-600">@johndoe</p>
        </div>
        <div className="sidebar-body">
          <ul className="menu mb-4 border-b-1 border-gray-700">
            <li className="">
              <Link href="/" className="flex gap-4 items-center py-4">
                <IoHomeOutline className="text-2xl cursor-pointer" />
                <span className="ml-2">Home</span>
              </Link>
            </li>
            <li className="">
              <Link href="/News" className="flex gap-4 items-center py-4">
                <FaRegNewspaper className="text-2xl cursor-pointer" />
                <span className="ml-2">News</span>
              </Link>
            </li>
            <li className="">
              <Link href="/Message" className="flex gap-4 items-center py-4">
                <IoChatbubbleEllipsesOutline className="text-2xl cursor-pointer" />
                <span className="ml-2">Messages</span>
              </Link>
            </li>
            <li className="">
              <Link href="/notification" className="flex gap-4 items-center py-4">
                <BsBell className="text-2xl cursor-pointer" />
                <span className="ml-2">Notification</span>
              </Link>
            </li>
          </ul>

          <ul className="menu">
            <li className="">
              <Link href="/profile" className="flex gap-4 items-center py-4">
                <FaRegUser className="text-2xl cursor-pointer" />
                <span className="ml-2">Profile</span>
              </Link>
            </li>
            <li className="">
              <Link href="/setting" className="flex gap-4 items-center py-4">
                <HiOutlineCog8Tooth className="text-2xl cursor-pointer" />
                <span className="ml-2">Settings</span>
              </Link>
            </li>
            <li className="">
              <Link href="/logout" className="flex gap-4 items-center py-4">
                <IoIosLogOut className="text-2xl cursor-pointer" />
                <span className="ml-2">Logout</span>
              </Link>
            </li>
          </ul>
        </div>
        <div className="mt-4">
          <Search customStyles="flex-col gap-1" ctx="portrait"/>
        </div>
        <div className="sidebar-foot mt-auto py-4">
            <p className="font-light text-gray-700 text-center ">&copy; Uniconnect LLC.</p>
        </div>
      </div>

      {/* Overlay */}
      {props.isSidebarOpen && (
        <div
          id="overlay"
          className="fixed inset-0 bg-black opacity-50 z-[999]"
          onClick={handleOverlayClick}
        ></div>
      )}
    </Fragment>
  );
};

export default SideBar;
