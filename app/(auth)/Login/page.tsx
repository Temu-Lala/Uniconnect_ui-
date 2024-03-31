import React from 'react'
import GovernorNot from './GovernorNot/GovernorNot'
import Loginas from './Loginus/Loginas'
import Register from '../Register/page'
import Link from 'next/link'
import Button from '../../Components/Button/WideButton/WideButton'
export default function page() {
  return (
<div className="hero min-h-screen bg-base-200">
  <div className="hero-content flex-col lg:flex-row-reverse">
    <div className="text-center lg:text-left">
      <h1 className="text-5xl font-bold">Login now!</h1>
      <p className="py-6">
The release for DV-2025 isn't quite a release in the traditional sense, but the results will be available soon. Here's the breakdown:

The application period for DV-2025 was in October and November of 2023.
You can check the results for DV-2025 starting on May 4, 2024. This is when the "release" happens - by checking the website, you'll find out if you were selected.</p>
    </div>
    <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
      <form className="card-body">
        <div>
            <GovernorNot/>
        </div>
        <div>
            <Loginas/>
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">User Name</span>
          </label>
          <input type="text" placeholder="User Name" className="input input-bordered" required />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input type="email" placeholder="email" className="input input-bordered" required />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Password</span>
          </label>
          <input type="password" placeholder="password" className="input input-bordered" required />
          <label className="label">
            <a href="#" className="label-text-alt link link-hover">Forgot password?</a>
          </label>
        </div>
        <div className="form-control mt-6">
          <button className="btn btn-primary">Login</button>
        </div>
      </form>
    
      <div className=' flex   gap-12'>
<span className=' flex align-bottom bottom-auto relative'> If You Dont Have An Account </span>
<Link href = '/Register' className=' flex justify-center items-center'>  <button className="btn    bg-blue-600 ">Register </button>
 </Link>  
 </div>
    </div>
  </div>
</div>  )
}
