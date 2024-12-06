"use client";

import React, { useState } from "react";
import RegisterForm, { FormData } from "./RegisterForm";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Toast from "@/app/Components/Toast/Toast";
import Logo from "@/app/Components/NavBar/Logo";
import { toast } from "sonner";

export default function Register() {
  const router = useRouter();
  const [showToast, setShowToast] = useState(false); // State for showing toast message
  const [active, setActive] = useState(false);
  const [error, setError] = useState<string | null>(null); // State for error messages
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (formData: FormData) => {
    setLoading(true)
    try {
      const response = await fetch("http://127.0.0.1:8000/signup/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        // Show toast message
        // setActive(true);
        toast.success("Registration successful. Redirecting to login page...")
        setError(null); // Clear any previous errors
        // Redirect to login page after a delay
        setTimeout(() => {
          router.push("/Login");
        }, 3000); // Redirect after 3 seconds
      } else {
        const errorData = await response.json();
        // Extract and handle specific error messages
        if (errorData.errors) {
          if (errorData.errors.username) {
            setError("Username already exists.");
          } else if (errorData.errors.email) {
            setError("Email already exists.");
          } else {
            setError("Registration failed. Please try again.");
          }
        } else {
          setError("Registration failed. Please try again.");
        }
        // setShowToast(true);
        toast.error("Registration failed")
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An unexpected error occurred. Please try again.");
      // setShowToast(true);
      toast.error("An unexpected error occurred")
    } finally{
      setLoading(false)
    }
  };

  return (
    <section className="relative h-screen flex items-center justify-center bg-base-100 dark:bg-gray-900">
      <nav className="absolute top-0 left-10 w-30 h-20 z-50 flex items-center">
        <Logo />
        <h2 className="flex btn btn-ghost text-xl">Uni Connect</h2>
      </nav>
      <div className="flex flex-col md:flex-row w-[95%] md:w-11/12 xl:w-10/12 2xl:9/12 h-[80%] rounded-lg overflow-hidden shadow-lg">
        <div className="w-full xl:w-1/2 min-w-[700] h-full xl:bg-gray-300 flex items-center justify-center">
          <div className="w-10/12 md:w-full bg-white rounded-lg shadow-md dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Sign up to Uni Connect
              </h1>
              {error && <p className="text-red-500">{error}</p>} {/* Display error message */}
              <RegisterForm onSubmit={handleSubmit} isLoading={loading} />
            </div>
          </div>
        </div>
        <div className="hidden xl:flex w-1/2 h-full bg-primary-600 bg-[url('/images/login-hero.gif')] bg-no-repeat bg-cover bg-center items-center justify-center">
          <div className="relative w-full h-full">
            <Image
              src="/images/login-bg.gif"
              alt="uniconnect logo"
              className="w-full h-full"
              layout="fill"
              objectFit="cover"
              quality={100}
            />
          </div>
        </div>
      </div>
      {/* <Toast
        title="Success"
        description="Registration successful. Redirecting to login page..."
        activeState={active}
      /> */}
    </section>
  );
}
