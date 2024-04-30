import Image from "next/image";
import Link from "next/link";

const Logo = () => (
    <div className="flex items-center mr-2">
      <div tabIndex={0} className="btn btn-ghost btn-circle avatar mr-2 cursor-pointer">
        <Link href="/">
          <Image src="/images/logo.png" fill quality={100} alt="Uniconnect Logo" className="w-10 rounded-full" />
        </Link>
      </div>
      <Link href="/" className="hidden md:flex btn btn-ghost text-xl">Uni Connect</Link>
    </div>
  );
  
  export default Logo;
  