"use client"

// Import the necessary modules
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';


export default function CreatePostView() {
    const [post, setPost] = useState({ title: '', content: '', news_type: 'UNIVERSITY', university: '', campus: '', college: '', department: '' });
    const [errors, setErrors] = useState({});
    const [image, setImage] = useState(null);
    const router = useRouter();

    const createPost = async () => {
        try {

            let formData = new FormData();
            formData.append('title', post.title);
            formData.append('content', post.content);
            formData.append('news_type', post.news_type);
            formData.append('university', post.university);
            formData.append('campus', post.campus);
            formData.append('college', post.college);
            formData.append('department', post.department);
            if (image) {
                formData.append('image', image);
            }
            const authToken = localStorage.getItem('token');

            await axios.post('http://127.0.0.1:8000/university-posts/', formData, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authToken}` // Include the token in the Authorization header
          },
            });
            router.push('/feed');
        } catch (error) {
            if (error.response && (error.response.status === 400 || error.response.status === 422)) {
                setErrors(error.response.data.errors);
                alert('An error occurred while creating the post.');
            }
        }
    };

    const onFileChange = (event) => {
        setImage(event.target.files[0]);
    };

    return (
        <div className="container mx-auto flex justify-center">
            <div className="w-full md:w-6/12 sm:w-8/12 mt-20">
                <h5 className="text-center">Create a new post</h5>
                <p className="text-center">Fill the form to create a new post.</p>
                <hr className="my-4" />
                <form onSubmit={(e) => { e.preventDefault(); createPost(); }} encType="multipart/form-data">
                    <div className="mb-6">
                        <label htmlFor="title">Title</label>
                        <input
                            type="text"
                            id="title"
                            className="w-3/4 border rounded py-1 px-3 mt-2"
                            value={post.title}
                            onChange={(e) => setPost({ ...post, title: e.target.value })}
                            placeholder="Enter title"
                        />
                        {errors.title && <div className="text-red-500">{errors.title}</div>}
                    </div>
                    <div className="mb-6">
                        <label htmlFor="content">Content</label>
                        <textarea
                            id="content"
                            className="w-3/4 border rounded py-1 px-3 mt-2"
                            value={post.content}
                            onChange={(e) => setPost({ ...post, content: e.target.value })}
                            placeholder="Enter content"
                            rows={6}
                        />
                        {errors.content && <div className="text-red-500">{errors.content}</div>}
                    </div>
                    <div className="mb-6">
                        <label htmlFor="news_type">News Type</label>
                        <select
                            id="news_type"
                            className="w-3/4 border rounded py-1 px-3 mt-2"
                            value={post.news_type}
                            onChange={(e) => setPost({ ...post, news_type: e.target.value })}
                        >
                            <option value="UNIVERSITY">University News</option>
                            <option value="CAMPUS">Campus News</option>
                            <option value="COLLEGE">College News</option>
                            <option value="DEPARTMENT">Department News</option>
                        </select>
                    </div>
                    <div className="mb-6">
                        <label htmlFor="university">University</label>
                        <input
                            type="text"
                            id="university"
                            className="w-3/4 border rounded py-1 px-3 mt-2"
                            value={post.university}
                            onChange={(e) => setPost({ ...post, university: e.target.value })}
                            placeholder="Enter university"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="campus">Campus</label>
                        <input
                            type="text"
                            id="campus"
                            className="w-3/4 border rounded py-1 px-3 mt-2"
                            value={post.campus}
                            onChange={(e) => setPost({ ...post, campus: e.target.value })}
                            placeholder="Enter campus"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="college">College</label>
                        <input
                            type="text"
                            id="college"
                            className="w-3/4 border rounded py-1 px-3 mt-2"
                            value={post.college}
                            onChange={(e) => setPost({ ...post, college: e.target.value })}
                            placeholder="Enter college"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="department">Department</label>
                        <input
                            type="text"
                            id="department"
                            className="w-3/4 border rounded py-1 px-3 mt-2"
                            value={post.department}
                            onChange={(e) => setPost({ ...post, department: e.target.value })}
                            placeholder="Enter department"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="image">Post Image</label>
                        <input
                            type="file"
                            id="image"
                            onChange={onFileChange}
                            className="mt-2"
                        />
                        {errors.image && <div className="text-red-500">{errors.image}</div>}
                    </div>
                    <div className="flex justify-center">
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Create Post</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
