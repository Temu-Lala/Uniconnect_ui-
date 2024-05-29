"use client"
import React, { useEffect, useState, Fragment } from 'react';
import axios from 'axios';
import Link from "next/link";
import Image from "next/image";
import { BsThreeDots } from "react-icons/bs";
import { FaCog, FaRegTimesCircle, FaUniversity } from "react-icons/fa";
import { IoMdCheckmark } from "react-icons/io";
import { IoDesktop } from "react-icons/io5";
import { GiTeacher } from "react-icons/gi";
import { Dialog, Transition } from '@headlessui/react';

interface Notification {
  id: number;
  recipient: number;
  sender: string;
  message: string;
  timestamp: string;
  type: string;
  imgPath: string;
}

const formatDate = (timestamp: string) => {
  const date = new Date(timestamp);
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return date.toLocaleDateString('en-US', options);
};

const decodeToken = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = decodeToken(token);
      console.log('Decoded Token:', decodedToken);
      if (decodedToken && decodedToken.user_id) {
        setCurrentUser(decodedToken.user_id);
        fetchNotifications(decodedToken.user_id, token);
      } else {
        console.error('User ID not found in token');
      }
    } else {
      console.error('Token not found in localStorage');
    }
  }, []);

  const fetchNotifications = async (userId: number, token: string) => {
    try {
      console.log('Fetching notifications for user ID:', userId);
      const response = await axios.get('http://127.0.0.1:8000/notifications/', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Fetched Notifications:', response.data);
      const userNotifications = response.data.filter((notification: Notification) => notification.recipient === userId);
      console.log('Filtered Notifications:', userNotifications);
      setNotifications(userNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      if (axios.isAxiosError(error) && error.response) {
        console.error('Server Response:', error.response.data);
      }
    }
  };

  const openModal = (notification: Notification) => {
    setSelectedNotification(notification);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedNotification(null);
    setIsModalOpen(false);
  };

  return (
    <div
      tabIndex={0}
      className="mt-3 z-[1] card card-compact dropdown-content w-[30rem] bg-base-100 shadow"
    >
      <div className="card-body w-full">
        <div className="flex justify-between items-center pb-2 border-b border-gray-500 mb-3">
          <h2 className="font-bold text-xl">Notifications</h2>

          <details className="dropdown dropdown-end">
            <summary className="btn btn-circle">
              <BsThreeDots />
            </summary>
            <ul className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52">
              <li>
                <a className="flex gap-2">
                  <span>
                    <IoMdCheckmark />
                  </span>
                  <span> Mark all as read</span>
                </a>
              </li>
              <li>
                <a className="flex gap-2">
                  <span>
                    <FaCog />
                  </span>
                  <span> Notification Setting</span>
                </a>
              </li>
              <li>
                <Link href="/notification" className="flex gap-2">
                  <span>
                    <IoDesktop />
                  </span>
                  <span> Open notifications</span>
                </Link>
              </li>
            </ul>
          </details>
        </div>
        {notifications.length > 0 && (
          <ul className="h-96 w-full overflow-y-auto p-1 shadow !flex !flex-col bg-base-100 rounded-box scrollbar-styled">
            {notifications.map(notification => (
              <li
                className="relative group p-2 hover:bg-white hover:bg-opacity-5 rounded-md"
                key={notification.id}
                onClick={() => openModal(notification)} // Open modal on click
              >
                <div className="flex gap-4 p-1 min-h-12 cursor-pointer">
                  <div className="w-16 h-16 relative">
                    <div className="absolute -right-2 -bottom-1 bg-purple-500 w-8 h-8 flex items-center justify-center rounded-full p-1">
                      {notification.type === "university" ? (
                        <FaUniversity />
                      ) : notification.type === "lecture" ? (
                        <GiTeacher />
                      ) : (
                        ""
                      )}
                    </div>
                    <Image
                      src={notification.imgPath}
                      width={100}
                      height={100}
                      quality={100}
                      alt="notification avatar"
                      className="w-full h-full rounded-full"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p>
                      <span className="text-md font-bold">
                        {notification.sender}
                      </span>
                      <span className="block text-ellipsis overflow-hidden">
                        {notification.message}
                      </span>
                    </p>
                    <p className="text-sm text-blue-500">
                      {formatDate(notification.timestamp)}
                    </p>
                  </div>
                </div>
                <div className="hidden group-hover:block z-50 absolute right-3 top-1/2 -translate-y-1/2 hover:bg-transparent focus-within:bg-transparent">
                  <details className="dropdown dropdown-end">
                    <summary className="btn btn-circle">
                      <BsThreeDots />
                    </summary>
                    <ul className="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52">
                      <li>
                        <a className="flex gap-2">
                          <span>
                            <IoMdCheckmark />
                          </span>
                          <span> Mark as read</span>
                        </a>
                      </li>
                      <li>
                        <a className="flex gap-2">
                          <span>
                            <FaRegTimesCircle />
                          </span>
                          <span> Remove this notification</span>
                        </a>
                      </li>
                    </ul>
                  </details>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Modal for selected notification */}
      {selectedNotification && (
        <Transition appear show={isModalOpen} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={closeModal}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                      Notification Details
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Sender: {selectedNotification.sender}
                      </p>
                      <p className="text-sm text-gray-500 break-words">
                        Content: {selectedNotification.message}
                      </p>
                      <p className="text-sm text-gray-500">
                        Timestamp: {formatDate(selectedNotification.timestamp)}
                      </p>
                    </div>

                    <div className="mt-4">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={closeModal}
                      >
                        Close
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      )}
    </div>
  );
};

export default Notifications;
