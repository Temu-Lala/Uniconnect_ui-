"use client";

// import React, { useState, ChangeEvent, FormEvent } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
// import { useAuth } from "@/app/contexts/AuthContext";
import LoginForm, { FormData } from "./LoginForm";
import Image from "next/image";
import Logo from "@/app/Components/NavBar/Logo";
import { toast } from "sonner";



export default function LoginPage() {
  const router = useRouter();
  // const { setAuthenticated } = useAuth();
  const [ isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (formData: FormData) => {
    // Explicitly type formData with FormData interface
    setIsLoading(true)
    try {
      const response = await fetch("http://127.0.0.1:8000/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        // setAuthenticated(true);
        checkUserAssociation(); // Redirect after successful login
        toast.success("Logged in sucessfully!");
      } else {
        toast.error("Login failed")
        throw new Error("Login failed");
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle error (e.g., display error message to the user)
    } finally {
      setIsLoading(false);
    }
  };

  const checkUserAssociation = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.replace('/Login'); // Redirect to login if token is not available
        return;
      }

      const response = await fetch('http://127.0.0.1:8000/api/user-profile/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        switch (data.profile_type) {
          case 'university':
            router.replace('/Profiles/Universty/');
            break;
          case 'campus':
            router.replace('/Profiles/Campus/');
            break;
          case 'college':
            router.replace('/Profiles/Collage/');
            break;
          case 'department':
            router.replace('/Profiles/Department/');
            break;
          case 'lecturer':
            router.replace('/Profiles/Lectures/');
            break;
            case 'labs':
              router.replace('/Profiles/lab/');
              break;
          default:
            router.replace('/');
            break;
        }
      } else {
        throw new Error('Unable to fetch user profile association');
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle error (e.g., redirect to login page or display error message)
    }
  };

  return (
    <section className="relative h-screen flex items-center justify-center bg-base-100 dark:bg-gray-900">
      <nav className="absolute top-0 left-10 w-30 h-20 z-50 flex items-center">
        <Logo />
        <h2 className="flex btn btn-ghost text-xl ">Uni Connect</h2>
      </nav>
      <div className="flex flex-col md:flex-row w-[95%] md:w-11/12 xl:w-10/12 2xl:9/12 h-[80%] rounded-lg overflow-hidden shadow-lg">
        <div className="w-full xl:w-1/2 min-w-[700] h-full xl:bg-gray-300 flex items-center justify-center">
          <div className="w-10/12 md:w-full bg-white rounded-lg shadow-md dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Sign in to your account
              </h1>
              <LoginForm onSubmit={handleSubmit} loading={isLoading} />{" "}
            </div>
          </div>
        </div>
        <div className="hidden xl:flex w-1/2 h-full bg-primary-600 bg-[url('/images/login-hero.gif)] bg-no-repeat bg-cover bg-center items-center justify-center">
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
    </section>
  );
}