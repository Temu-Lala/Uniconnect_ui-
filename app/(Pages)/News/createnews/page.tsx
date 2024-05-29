"use client";
import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Define the types for post and error
interface Post {
  title: string;
  content: string;
  link: string;
  file: File | null;
}

const CreatePostView: React.FC = () => {
  const [post, setPost] = useState<Post>({ title: '', content: '', link: '', file: null });
  const [error, setError] = useState<string | null>(null);
  const userId = localStorage.getItem('userId'); // Retrieve user ID from local storage

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const authToken = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('title', post.title);
      formData.append('content', post.content);
      formData.append('link', post.link);
      if (post.file) {
        formData.append('file', post.file);
      }
      formData.append('user', String(userId)); // Convert user ID to string before appending
      const response = await axios.post('http://127.0.0.1:8000/create-post/', formData, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
      });
      console.log(response.data);
      toast.success('Post created successfully!');
      setPost({ title: '', content: '', link: '', file: null }); // Clear the form after successful submission
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.error);
        toast.error(`Error: ${err.response.data.error}`);
      } else {
        setError('An unexpected error occurred. Please try again later.');
        toast.error('An unexpected error occurred. Please try again later.');
      }
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPost({ ...post, file: e.target.files[0] });
    }
  };

  const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setPost({ ...post, content: e.target.value });
  };

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPost({ ...post, title: e.target.value });
  };

  const handleLinkChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPost({ ...post, link: e.target.value });
  };

  return (
    <div className='pt-20 min-h-screen flex items-center justify-center bg-base-200 dark:bg-gray-900'>
      <div className="card w-full max-w-lg bg-base-100 shadow-xl dark:bg-gray-800">
        <div className="card-body">
          <h2 className="card-title text-2xl text-center dark:text-white">Create Post</h2>
          {error && <p className="text-red-500">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text dark:text-gray-300">Title:</span>
              </label>
              <input 
                type="text" 
                value={post.title} 
                onChange={handleTitleChange} 
                className="input input-bordered w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text dark:text-gray-300">Content:</span>
              </label>
              <textarea 
                value={post.content} 
                onChange={handleContentChange} 
                className="textarea textarea-bordered w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text dark:text-gray-300">Link:</span>
              </label>
              <input 
                type="text" 
                value={post.link} 
                onChange={handleLinkChange} 
                className="input input-bordered w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text dark:text-gray-300">Upload File:</span>
              </label>
              <input 
                type="file" 
                onChange={handleFileChange} 
                className="file-input w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div className="form-control mt-6">
              <button 
                type="submit" 
                className="btn btn-primary w-full dark:bg-blue-600"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default CreatePostView;
