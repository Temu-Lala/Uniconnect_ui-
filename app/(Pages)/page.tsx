"use client"

import NewsFeed from "./News/page";
import Footer from "../Components/Footer/Footer";
import LecturesList from './LecturesList/page';
import NavBar from "../Components/NavBar/NavBar";
import NewPost from "./News/NewPost";
import { useRouter } from "next/navigation";
import React from 'react'; 

export default function Home() {
  const router = useRouter();

  return (
    <div className=" scrollbar-hide overflow-hidden">
      
      <div className="flex mt-16"> {/* Adjust margin-top to accommodate the fixed navbar */}
        {/* Left section */}
        <div className="hidden lg:flex flex-none w-1/4 flex-col mr-4">
          {/* <LecturesList />
          <LecturesList /> */}
          <LecturesList />
        </div>
        {/* News feed */}
        <div className=" w-full lg:w-1/2 mx-4">
          <NewPost />
          <NewsFeed />
        </div>
        {/* Right section */}
        <div className="hidden lg:flex flex-none w-1/4 flex-col ml-4">
          <LecturesList />
          {/* <LecturesList />
          <LecturesList /> */}
        </div>
      </div>
    </div>
  );
}
