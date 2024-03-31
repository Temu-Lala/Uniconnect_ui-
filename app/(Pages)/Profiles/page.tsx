import Link from 'next/link'
import React from 'react'
import Image from 'next/image';
import { IoIosAddCircle } from "react-icons/io";
import { RiPushpinFill } from "react-icons/ri";
import { FaFacebookMessenger } from "react-icons/fa";
import { MdGroupAdd } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { LuSchool } from "react-icons/lu";
import { IoMdSettings } from "react-icons/io";
import { FaAnglesDown } from "react-icons/fa6";
import { BiSolidSchool } from "react-icons/bi";
import { GiTeacher } from "react-icons/gi";

import { FaInfoCircle } from "react-icons/fa";
import { IoIosSchool } from "react-icons/io";
import { FaMapLocation } from "react-icons/fa6";
import { FaStar } from "react-icons/fa";
import Ratting from '@/app/Components/Ratting/Ratting';
export default function page() {
  return (
    
     <div>
      <div className="w-full h-96 bg-cover bg-no-repeat bg-center">
        <img className=" w-full h-full" src="https://images.pexels.com/photos/1181269/pexels-photo-1181269.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="" />
      </div>
      <div className="p-4">
        <div className="relative flex w-full">
          <div className="flex flex-1">
            <div className=' -mt-20 w-full justify-center ' >
              <div style={{ height: '9rem', width: '9rem' }} className="md rounded-full relative avatar">
                <img style={{ height: '9rem', width: '9rem' }} className="md rounded-full relative border-4 border-gray-900" src="https://images.pexels.com/photos/1181269/pexels-photo-1181269.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="" />
                <div className="absolute"></div>
              </div>
            </div>
          </div>






































          <div className="flex flex-col text-right">
            <button className=" justify-center max-h-max whitespace-nowrap focus:outline-none focus:ring  max-w-max border bg-transparent border-blue-500 text-blue-500  hover:border-blue-800 flex items-center hover:shadow-lg font-bold py-2 px-4 rounded-full mr-0 ml-auto">
              Edit Profile
            </button>
          </div>
        </div>

        <div className="space-y-1 justify-center w-full mt-3 ml-3">
          <div>
            <h2 className="text-xl leading-6 font-bold text-white">Debre Birhan University </h2>
            <p className="text-sm leading-5 font-medium text-gray-600">@dbuBTs</p>
          </div>
          <div className="mt-3">
           <span className=' text-2xl'>Bio</span>
            <p className="text-white  break-all leading-tight mb-2">Image with src "/_next/static/media/dbu.883661cd.png" has legacy prop "objectFit". Did you forget to run the codemod?
Read more: https://nextjs.org/docs/messages/next-image-upgrade-to-13     
 ⚠ Fast Refresh had to perform a full reload due to a runtime error.
 </p>
            <div className="text-gray-600 flex">
              <span className="flex mr-2">
               
                <Link href="https://dbunews/" target="#" className="leading-5 ml-1 text-blue-400">www.dbunews.com</Link>
              </span>
              <span className="flex mr-2">
                <svg viewBox="0 0 24 24" className="h-5 w-5 paint-icon">
                 
                </svg>
                <span className="leading-5 ml-1">stablised at 1990</span>
              </span>
            </div>
          </div>
          <div className="pt-3 flex flex-wrap justify-center items-center w-full divide-x divide-gray-800 divide-solid">
  <div className="text-center pr-3 mb-3 md:mb-0 md:w-1/3 lg:w-auto">
    <span className="font-bold text-white">520</span>
    <span className="text-gray-600"> lectures</span>
  </div>
  <div className="text-center pr-3 mb-3 md:mb-0 md:w-1/3 lg:w-auto">
    <span className="font-bold text-white">520</span>
    <span className="text-gray-600"> campus</span>
  </div>
  <div className="text-center pr-3 mb-3 md:mb-0 md:w-1/3 lg:w-auto">
    <span className="font-bold text-white">520</span>
    <span className="text-gray-600"> collage</span>
  </div>
  <div className="text-center pr-3 mb-3 md:mb-0 md:w-1/3 lg:w-auto">
    <span className="font-bold text-white">520</span>
    <span className="text-gray-600"> department</span>
  </div>
  <div className="text-center px-3 mb-3 md:mb-0 md:w-1/3 lg:w-auto">
    <span className="font-bold text-white">23,4m</span>
    <span className="text-gray-600"> Followers</span>
  </div>
</div>

        </div>
      </div>
    












      <div className=" bg-transparent p-1 h-auto      ">
      <div className="flex flex-wrap justify-center items-center space-x-2">
  <div className="relative flex justify-evenly w-full items-center spa mb-3 md:mb-0 md:w-1/3 lg:w-auto">
    <div className="relative group">
      <div className="group-hover:bg-gray-600 p-1 group-hover:rounded-lg transition-all ease-in-out duration-300">
        <span>News</span>
        <IoIosAddCircle />
      </div>
      <div className="absolute group-hover:border-b-2 group-hover:cursor-pointer mt-2 border-blue-500 w-full transition-all duration-100 ease-in-out "></div>
    </div>
  </div>
  <div className="relative flex justify-evenly w-full items-center spa mb-3 md:mb-0 md:w-1/3 lg:w-auto">
    <div className="relative group">
      <div className="group-hover:bg-gray-600 p-1 group-hover:rounded-lg transition-all ease-in-out duration-300">
        <span>Pin</span>
        <RiPushpinFill />
      </div>
      <div className="absolute group-hover:border-b-2 group-hover:cursor-pointer mt-2 border-blue-500 w-full transition-all duration-100 ease-in-out"></div>
    </div>
  </div>
  <div className="relative flex justify-evenly w-full items-center spa mb-3 md:mb-0 md:w-1/3 lg:w-auto">
    <div className="relative group">
      <div className="group-hover:bg-gray-600 p-1 group-hover:rounded-lg transition-all ease-in-out duration-300">
        <span>Messages</span>
        <FaFacebookMessenger />
      </div>
      <div className="absolute group-hover:border-b-2 group-hover:cursor-pointer mt-2 border-blue-500 w-full transition-all duration-100 ease-in-out "></div>
    </div>
  </div>
  <div className="relative flex justify-evenly w-full items-center spa mb-3 md:mb-0 md:w-1/3 lg:w-auto">
    <div className="relative group">
      <div className="group-hover:bg-gray-600 p-1 group-hover:rounded-lg transition-all ease-in-out duration-300">
        <span>Notifications</span>
        <IoNotifications />
      </div>
      <div className="absolute group-hover:border-b-2 group-hover:cursor-pointer mt-2 border-blue-500 w-full transition-all duration-100 ease-in-out "></div>
    </div>
  </div>
  <div className="relative flex justify-evenly w-full items-center spa mb-3 md:mb-0 md:w-1/3 lg:w-auto">
    <div className="relative group">
      <div className="group-hover:bg-gray-600 p-1 group-hover:rounded-lg transition-all ease-in-out duration-300">
        <span>Followers</span>
        <MdGroupAdd />
      </div>
      <div className="absolute group-hover:border-b-2 group-hover:cursor-pointer mt-2 border-blue-500 w-full transition-all duration-100 ease-in-out "></div>
    </div>
  </div>
  <div className="relative flex justify-evenly w-full items-center spa mb-3 md:mb-0 md:w-1/3 lg:w-auto">
    <div className="relative group">
      <div className="group-hover:bg-gray-600 p-1 group-hover:rounded-lg transition-all ease-in-out duration-300">
        <span>Location</span>
        <FaMapLocation />
      </div>
      <div className="absolute group-hover:border-b-2 group-hover:cursor-pointer mt-2 border-blue-500 w-full transition-all duration-100 ease-in-out "></div>
    </div>
  </div>
</div>
<div className="flex flex-col justify-center">
  <div className="flex items-center justify-center ">
    <div className="relative inline-block text-left dropdown">
      <span className="rounded-md shadow-sm">
        <button className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800" 
          type="button" aria-haspopup="true" aria-expanded="true" aria-controls="headlessui-menu-items-117">
          <span>More <FaAnglesDown /></span>
        </button>
      </span>
      <div className="invisible dropdown-menu transition-all duration-300 transform origin-top-right">
        <div className="absolute right-0 w-56 mt-2 origin-top-right border bg-gray-800 border-gray-200 divide-gray-100 rounded-md shadow-lg outline-none">
          <div className="py-1 flex flex-col">
            <Link href="#" className="hover:bg-slate-500 text-white flex w-full px-4 py-2 text-sm"><FaInfoCircle /> About</Link>
            <Link href="#" className="hover:bg-slate-500 text-white w-full px-4 py-2 text-sm leading-5"><LuSchool /> Collage</Link>
            <Link href="#" className="hover:bg-slate-500 text-white px-4 py-2 text-sm"><BiSolidSchool /> Campus</Link>
            <Link href="#" className="hover:bg-slate-500 text-white px-4 py-2 text-sm"><IoIosSchool /> Department</Link>
            <Link href="#" className="hover:bg-slate-500 text-white px-4 py-2 text-sm"><GiTeacher /> Lectures</Link>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>


  
<div className=" py-6 flex flex-col justify-center sm:py-12">
  <div className="py-3 sm:max-w-xl sm:mx-auto">
    <div className=" bg-transparent border text-white min-w-1xl flex flex-col rounded-xl shadow-lg">
      <div className="px-12 py-5">
        <h2 className=" text-3xl font-semibold">Please Give A Rating</h2>
      </div>
      <div className=" bg-transparent w-full flex flex-col items-center">
        <div className="flex flex-col items-center py-6 space-y-3">
          <span className="text-lg ">How was quality of theis University ?</span>
          <div className="flex flex-row-reverse justify-end items-center">
 <Ratting/>
</div>
        </div>
        <div className="w-3/4 flex flex-col">
            <span>Leave a message, if you want</span>
          <textarea rows={3} className="p-4 text-gray-500 rounded-xl resize-none  "></textarea>
          <button className="py-3 my-8 text-lg bg-black border-yellow-500 text-white">Rate now</button>
        </div>
      </div>
     
    </div>

  
  </div>
</div>


</div>










    
    
    </div> 
  )
}