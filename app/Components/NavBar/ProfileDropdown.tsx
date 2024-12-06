"use client"
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/app/contexts/AuthContext";
import { toast } from "sonner";
import Image from 'next/image'
const ProfileDropdown: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const modalRef = useRef<HTMLDialogElement>(null);
  const { user, logout } = useAuthContext();

  useEffect(() => {
    // Do something here when pathname changes...
  }, [pathname]);

  const handleNavigate = () => {
    router.push(`${pathname}/Profiles/`);
  };

  const handleLogout = () => {
    modalRef.current?.showModal();
  }

  const confirmLogout = () => {
    // logout();
    localStorage.removeItem('token')
    toast.message("Logged out sucessfully")
    router.push("/Login")
    modalRef.current?.close();
  }

  return (
    <>
      <div className="dropdown dropdown-end hidden sm:block">
        <div tabIndex={0} className="btn btn-circle avatar">
          <div className="w-10 h-10 rounded-full flex items-center justify-center">
            {/* {`${user?.username.charAt(0)} ${user?.username.charAt(1)}`} */}
            <Image alt="Avatar" src="/images/default-user-image.jpg" width={40} height={40} className="w-full h-full object-cover"/>
          </div>
        </div>
        <ul
          tabIndex={0}
          className="mt-3 p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
        >
          <li>
            <button onClick={handleNavigate}>Profiles</button>
          </li>
          <li>
            <Link href="/Setting">Setting</Link>
          </li>
          <li>
            <button onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      </div>

      <dialog ref={modalRef} id="my_modal_2" className="modal">
        <div className="modal-box ">
          <div role="alert" className="alert flex flex-col items-start space-y-2">
            <div className="flex">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="stroke-info shrink-0 w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <p>Are you sure you want to logout?</p>
            </div>

            <div className="w-full flex justify-items-end space-x-2">
              <button className="btn btn-sm ml-auto" onClick={() => modalRef.current?.close()}>Cancel</button>
              <button className="btn btn-sm bg-blue-600" onClick={confirmLogout}>Logout</button>
            </div>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>Close</button>
        </form>
      </dialog>
    </>
  );
};

export default ProfileDropdown;