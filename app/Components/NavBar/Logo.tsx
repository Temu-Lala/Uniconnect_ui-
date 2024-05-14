import Image from "next/image";
import Link from "next/link";

interface LogoProps{
  ctx?: string;
}

const Logo = ({ ctx }: LogoProps) => (
    <div className="flex items-center mr-2">
      <div tabIndex={0} className=" btn-circle avatar cursor-pointer">
        <Link href={ctx === 'home' ? '/' : '#'} className="p-2" title="Uni-Connect">
          <Image src="/images/logo.png" fill quality={100} alt="Uniconnect Logo" className="w-10 rounded-full" />
        </Link>
      </div>
    </div>
  );
  
  export default Logo;
  