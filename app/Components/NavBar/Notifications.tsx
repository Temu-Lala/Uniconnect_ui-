import Link from "next/link";
import Image from "next/image";
import React from "react";
import { BsThreeDots } from "react-icons/bs";
import { FaCog, FaRegTimesCircle, FaUniversity } from "react-icons/fa";
import { IoMdCheckmark } from "react-icons/io";
import { IoDesktop } from "react-icons/io5";
import { notificationData, Notification } from "./notificationData";
import { GiTeacher } from "react-icons/gi";

const Notifications = () => {
  const notification = true;
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
        {notification && (
          <ul className="h-96 w-full overflow-y-auto p-1 shadow !flex !flex-col bg-base-100 rounded-box scrollbar-styled">
            {/* map through the notification object or JSON here */}
            {notificationData.map((notify: Notification) => {
              return (
                <li
                  className="relative group p-2 hover:bg-white hover:bg-opacity-5 rounded-md"
                  key={notify.id}
                >
                  <Link href="">
                    <div className="flex gap-4 p-1 min-h-12">
                      <div className="w-16 h-16 relative">
                        <div className="absolute -right-2 -bottom-1 bg-purple-500 w-8 h-8 flex items-center justify-center rounded-full p-1">
                          {notify.type === "university" ? (
                            <FaUniversity />
                          ) : notify.type === "lecture" ? (
                            <GiTeacher />
                          ) : (
                            ""
                          )}
                        </div>
                        <Image
                          src={notify.imgPath}
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
                            {notify.name}
                          </span>
                          {notify.notification}
                        </p>
                        <p className="text-sm text-blue-500">
                          {notify.time}Hrs
                        </p>
                      </div>
                    </div>
                  </Link>
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
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Notifications;
