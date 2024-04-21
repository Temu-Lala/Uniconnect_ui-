"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { AuthActions } from '../utils';

type FormData = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const [error, setError] = useState<string>('');
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const { login } = AuthActions();

  const onSubmit = async (data: FormData) => {
    try {
      const { email, password } = data;
      await login(email, password);
      router.push('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid email or password');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg w-1/3">
        <h3 className="text-2xl font-semibold">Login to your account</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
          <div>
            <label className="block" htmlFor="email">Email</label>
            <input
              type="text"
              placeholder="Email"
              {...register("email", { required: true })}
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
            {errors.email && (
              <span className="text-xs text-red-600">Email is required</span>
            )}
          </div>
          <div className="mt-4">
            <label className="block" htmlFor="password">Password</label>
            <input
              type="password"
              placeholder="Password"
              {...register("password", { required: true })}
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
            {errors.password && (
              <span className="text-xs text-red-600">Password is required</span>
            )}
          </div>
          <div className="flex items-center justify-between mt-4">
            <button className="px-12 py-2 leading-5 text-white transition-colors duration-200 transform bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-700">
              Login
            </button>
          </div>
          {error && (
            <span className="text-xs text-red-600">{error}</span>
          )}
        </form>
        <div className="mt-6 text-center">
          <a href="/auth/password/reset-password" className="text-sm text-blue-600 hover:underline">Forgot password?</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
