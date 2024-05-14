import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { MouseEventHandler } from 'react';
import { useRouter } from 'next/navigation';

interface ProfileDropdownProps {
  handler: MouseEventHandler<HTMLButtonElement>;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ handler }) => {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Do something here when pathname changes...
  }, [pathname]);

  const handleNavigate = () => {
    router.push(`${pathname}/Profiles/`);
  };

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
          <button onClick={handleNavigate}>Profiles</button>
        </li>
        <li>
          <Link href="/Setting">Setting</Link>
        </li>
        <li>
          <button onClick={handler}>Logout</button>
        </li>
      </ul>
    </div>
  );
};

export default ProfileDropdown;
