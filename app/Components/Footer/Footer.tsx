import React from "react";
import Image from "next/image";
import Link from "next/link";
export default function Footer() {
  return (
    <footer className="footer p-10 bg-base-200 text-base-content mt-auto">
      <aside>
        <Image
          src="/images/logo.png"
          width={100}
          height={100}
          alt="footer logo"
          className="rounded-full"
        />
        <p>Uniconnect Ltd.</p>
      </aside>
      <nav>
        <h6 className="footer-title">Legal</h6>
        <a className="link link-hover">Terms of use</a>
        <a className="link link-hover">Privacy policy</a>
      </nav>
      <div className="app">
        <Link href="https://play.google.com/store/apps/" target="_blank">
          <Image
            src="/images/app-tag.webp"
            width={300}
            height={200}
            alt="download app banner"
            className="object-contain"
          />
        </Link>
      </div>
    </footer>
  );
}
