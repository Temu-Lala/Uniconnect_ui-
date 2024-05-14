"use client";
import { useRef, useState, RefObject } from "react";
import Image from "next/image";
import Link from "next/link";
import NewPostForm from "./NewPostForm";
import RestrictedComponent from "@/app/Components/RestrictedComponent";
import { useAuth } from "@/app/contexts/AuthContext";
const NewPost = () => {
  const newPostModalRef = useRef<HTMLDialogElement>(null);
  const loginModalRef = useRef<HTMLDialogElement>(null);
  const { isAuthenticated } = useAuth();
  
  const handleNewPostClick = () => {
    if (isAuthenticated) {
      newPostModalRef.current?.showModal();
    } else {
      loginModalRef.current?.showModal();
    }
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
          <RestrictedComponent>
            <button className="btn ">Media</button>
          </RestrictedComponent>
          <button className="btn">Event</button>
          <button className="btn">Article</button>
        </div>
      </div>

      <NewPostForm reference={newPostModalRef} />

        <LoginModal reference={loginModalRef}  />
    </>
  );
};

export default NewPost;


interface loginModalProps {
  reference: RefObject<HTMLDialogElement>;
}
const LoginModal: React.FC<loginModalProps> = ({ reference }) => {
  // Implement your login modal here
  return (
    <dialog ref={reference} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Login</h3>
        <p className="py-4">Login for will appear here alu.</p>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
      
    </dialog>
  );
};
