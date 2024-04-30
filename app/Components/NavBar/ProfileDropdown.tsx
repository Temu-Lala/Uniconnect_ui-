import Link from "next/link";

const ProfileDropdown = () => {
  return (
    <div className="dropdown dropdown-end hidden sm:block">
      <div tabIndex={0} className="btn btn-ghost btn-circle avatar">
        <div className="w-10 rounded-full">
          <img alt="Avatar" src="/images/lectures/temesgen.jfif" />
        </div>
      </div>
      <ul
        tabIndex={0}
        className="mt-3 p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
      >
        <li>
          <Link href="/Profiles">Profile</Link>
        </li>
        <li>
          {" "}
          <Link href="/Setting">Setting</Link>
        </li>
        <li>
          <Link href="/Login">Logout</Link>
        </li>
      </ul>
    </div>
  );
};

export default ProfileDropdown;
