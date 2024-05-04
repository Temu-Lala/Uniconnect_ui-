"use client"
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import NewPostForm from "./NewPostForm";
const NewPost = () => {
  const newPostModalRef = useRef<HTMLDialogElement>(null);

  const handleNewPostClick = () => {
    newPostModalRef.current?.showModal();
  };
  return (
    <>
      <div className="card bg-base-300 flex flex-col w-full my-4">
        <div className="flex gap-8 items-center p-4 px-6 h-20  rounded-box">
          <div className="w-14 h-14">
            <Link href="#">
              <Image
                src="/images/universities/dbu.jpg"
                alt="dbu"
                width={56}
                height={56}
                className="w-14 h-14 rounded-full"
              />
            </Link>
          </div>
          <div className="flex-1" onClick={handleNewPostClick}>
            <input
              type="text"
              placeholder="Type your post"
              className="input input-bordered w-full"
            />
          </div>
        </div>
        <div className="divider m-1"></div>
        <div className="h-20 rounded-box flex justify-between px-16">
          <button className="btn ">Media</button>
          <button className="btn">Event</button>
          <button className="btn">Article</button>
        </div>
      </div>

      <NewPostForm reference={newPostModalRef} />
    </>
  );
};

export default NewPost;
