"use client";

import NewsFeed from "./News/page";
import UniversityList from "./UnivesityList/page";
import LecturesList from "./LecturesList/page";
import NavBar from "../Components/NavBar/NavBar";
import NewPost from "./News/NewPost";
import { useRouter } from "next/navigation";
import React from "react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col h-screen">
      <NavBar />
      <div className="flex flex-1 pt-16 bg-[#292a2c]">
        <aside className="hidden xl:flex fixed top-0 left-0 pt-20 w-[360px] h-screen shadow overflow-hidden flex-col justify-between">
          <LecturesList />
          <div className="flex flex-wrap gap-1 text-gray-500 text-sm p-3">
            <Link href="#">Privacy</Link>·<Link href="#">Terms</Link>·
            <Link href="#">Advertising</Link>·<Link href="#">Ad Choices</Link>·
            <Link href="#">Uniconnect © 2024</Link>·
          </div>
        </aside>
        <main className="flex-1 overflow-y-auto lg:pr-[300px] xl:px-[360px]">
          <div className="max-w-[700px] mx-auto px-4 sm:px-6 md:px-0 xl:px-6 2xl:px-0 ">
            <NewPost />
            <NewsFeed />
          </div>
        </main>
        <aside className="hidden lg:flex flex-col fixed pt-16 top-0 right-0 w-[300px] xl:w-[360px] h-screen shadow overflow-hidden">
          <div className="ad-sec w-11/12 h-40 flex items-center justify-center rounded-lg mx-auto my-3 bg-gray-500">
            <p className="text-2xl font-bold text-white">AD</p>
          </div>
          <div className="ml-4 py-2">
            <h3 className="font-bold text-md">Universities</h3>
          </div>
          <div className="uv-wrap flex w-full flex-1 p-3 overflow-y-scroll overflow-x-hidden">
            <UniversityList />
          </div>
        </aside>
      </div>
    </div>
  );
}
