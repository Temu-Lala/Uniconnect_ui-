import React from 'react'
import Image from 'next/image'
export default function Footer() {
  return (
    <footer className="footer p-10 bg-base-200 text-base-content mt-auto">
      <aside>
        <Image
          src="/images/logo.jpg"
          width={100}
          height={100}
          alt="footer logo"
          className='rounded-full'
        />
        <p>Uniconnect Ltd.</p>
      </aside> 
      <nav>
        <h6 className="footer-title">Services</h6> 
        <a className="link link-hover">Advertisement</a>
      </nav> 
      <nav>
   
        <a className="link link-hover">About us</a>
        <a className="link link-hover">Contact</a>

      </nav> 
      <nav>
        <h6 className="footer-title">Legal</h6> 
        <a className="link link-hover">Terms of use</a>
        <a className="link link-hover">Privacy policy</a>
     
      </nav>
    </footer>
  )
}
