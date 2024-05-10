"use client"
import React, { useState } from 'react';
import axios from 'axios';


const CreatePostView = () => {
    const [post, setPost] = useState({ title: '', content: '', link: '', file: null });
    const [error, setError] = useState(null);
    const userId = localStorage.getItem('userId'); // Retrieve user ID from local storage

    const handleSubmit = async (e) => {
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
        } catch (err) {
            setError(err.response.data.error);
        }
    };

    const handleFileChange = (e) => {
        setPost({ ...post, file: e.target.files[0] });
    };

    const handleContentChange = (e) => {
        setPost({ ...post, content: e.target.value });
    };

    const handleTitleChange = (e) => {
        setPost({ ...post, title: e.target.value });
    };

    const handleLinkChange = (e) => {
        setPost({ ...post, link: e.target.value });
    };

    return (
        <div className=' pt-52'>
            <h1>Create Post</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title:</label>
                    <input type="text" value={post.title} onChange={handleTitleChange} />
                </div>
                <div>
                    <label>Content:</label>
                    <textarea value={post.content} onChange={handleContentChange} />
                </div>
                <div>
                    <label>Link:</label>
                    <input type="text" value={post.link} onChange={handleLinkChange} />
                </div>
                <div>
                    <label>Upload File:</label>
                    <input type="file" onChange={handleFileChange} />
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default CreatePostView;
