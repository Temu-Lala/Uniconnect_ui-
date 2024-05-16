"use client";

// import React, { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import LoginForm, { FormData } from "./LoginForm";
import Image from "next/image";
import Logo from "@/app/Components/NavBar/Logo";

// interface FormData {
//   username: string;
//   password: string;
// }

// export default function Login(): JSX.Element {
//   const router = useRouter();
//   const { login } = useAuth();
//   const [formData, setFormData] = useState<FormData>({
//     username: "",
//     password: "",
//   });

//   const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
//     e.preventDefault();
//     try {
//       // Call login function and wait for response
//       await login(formData);

//       // If login succeeds, redirect to '/'
//       router.push("/");
//     } catch (error) {
//       console.error("Error:", error);
//       // Handle error (e.g., display error message to the user)
//     }
//   };

//   return (
//     // <div classNameName="mt-48">
//     //   <h1>User Login</h1>
//     //   <form onSubmit={handleSubmit}>
//     //     <Input
//     //       placeholder="Username"
//     //       type="text"
//     //       name="username"
//     //       value={formData.username}
//     //       onChange={handleChange}
//     //     />
//     //     ;
//     // <Input.Password
//     //   placeholder="input password"
//     //   iconRender={(visible) =>
//     //     visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
//     //   }
//     // />
//     //     <button type="submit">Login</button>
//     //   </form>
//     // </div>

// <section className=" h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
//   <div className="flex w-9/12 h-[80%] rounded-lg overflow-hidden shadow-lg">
//     <div className="w-1/2 h-full bg-gray-300 flex items-center justify-center">
//       <div className="w-full bg-white rounded-lg shadow-md dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
//         <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
//           <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
//             Sign in to your account
//           </h1>
//           <form
//             className="space-y-4 md:space-y-6"
//             method="POST"
//             onSubmit={handleSubmit}
//           >
//             <div>
//               <label
//                 htmlFor="email"
//                 className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
//               >
//                 Username
//               </label>
//               <Input
//                 type="text"
//                 name="username"
//                 id="username"
//                 className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//                 placeholder="Username"
//                 required
//                 value={formData.username}
//                 onChange={handleChange}
//               />
//             </div>
//             <div>
//               <label
//                 htmlFor="password"
//                 className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
//               >
//                 Password
//               </label>
//               <Input.Password
//                 type="password"
//                 name="password"
//                 id="password"
//                 placeholder="••••••••"
//                 className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//                 iconRender={(visible) =>
//                   visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
//                 }
//                 required
//                 value={formData.password}
//                 onChange={handleChange}
//               />
//             </div>
//             <div className="flex items-center justify-between">
//               <div className="flex items-start">
//                 <div className="flex items-center h-5">
//                   <Input
//                     id="remember"
//                     aria-describedby="remember"
//                     type="checkbox"
//                     className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
//                     required
//                   />
//                 </div>
//                 <div className="ml-3 text-sm">
//                   <label
//                     htmlFor="remember"
//                     className="text-gray-500 dark:text-gray-300"
//                   >
//                     Remember me
//                   </label>
//                 </div>
//               </div>
//               <a
//                 href="#"
//                 className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
//               >
//                 Forgot password?
//               </a>
//             </div>
//             <button
//               type="submit"
//               className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
//             >
//               Sign in
//             </button>
//             <p className="text-sm font-light text-gray-500 dark:text-gray-400">
//               Don’t have an account yet?{" "}
//               <a
//                 href="#"
//                 className="font-medium text-primary-600 hover:underline dark:text-primary-500"
//               >
//                 Sign up
//               </a>
//             </p>
//           </form> 

//         </div>
//       </div>
//     </div>

//     <div className="w-1/2 h-full border border-gray-800"></div>
//   </div>
// </section>
//   );
// }

export default function LoginPage() {
  const router = useRouter();
  const { setAuthenticated } = useAuth();

  const handleSubmit = async (formData: FormData) => {
    // Explicitly type formData with FormData interface
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
        setAuthenticated(true);
        checkUserAssociation(); // Redirect after successful login
      } else {
        throw new Error("Login failed");
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle error (e.g., display error message to the user)
    }
  };

  const checkUserAssociation = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login'); // Redirect to login if token is not available
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
            router.push('/Profiles/Universty/');
            break;
          case 'campus':
            router.push('/Profiles/Campus/');
            break;
          case 'college':
            router.push('/Profiles/Collage/');
            break;
          case 'department':
            router.push('/Profiles/Department/');
            break;
          case 'lecturer':
            router.push('/Profiles/Lectures/');
            break;
          default:
            router.push('/');
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
              <LoginForm onSubmit={handleSubmit} />{" "}
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