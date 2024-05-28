'use client';
import React, { useState, useEffect, ChangeEvent, useRef } from 'react';
import { FaThumbsUp, FaShare, FaEdit, FaCopy, FaDownload, FaComments, FaExpand, FaSearchPlus, FaEllipsisV, FaTrash } from 'react-icons/fa';
import { LiaTimesSolid } from "react-icons/lia";
import Image from 'next/image';
import 'tailwindcss/tailwind.css';

interface Comment {
  id: number;
  body: string;
  author: { Username: string; Avatar: string };
  created_on: string;
}

interface NewsItem {
  id: number;
  ownerName: string;
  owner: string;
  title: string;
  content: string;
  link: string;
  created_at: string;
  date: string;
  imageUrls: string[];
  fileUrl: string;
  likes: number;
  dislikes: number;
  shares: number;
  type: string;
  showAllComments: boolean;
  liked: boolean;
  disliked: boolean;
  comments: Comment[];
}

const CampusNewsFeed = () => {
  const [comments, setComments] = useState<{ [postId: number]: string }>({});
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editedCommentText, setEditedCommentText] = useState<string>('');
  const [shareLink, setShareLink] = useState<string>('');
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [showCommentsModal, setShowCommentsModal] = useState<{ [postId: number]: boolean }>({});
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [expandedPost, setExpandedPost] = useState<{ [postId: number]: boolean }>({});
  const [dropdownOpen, setDropdownOpen] = useState<{ [postId: number]: boolean }>({});
  const commentsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchNewsFeed();
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown-menu') && !target.closest('.modal-box')) {
        setDropdownOpen({});
        setShowShareModal(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (commentsEndRef.current) {
      commentsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [comments]);

  const fetchNewsFeed = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/campus-posts/');
      if (!response.ok) {
        throw new Error('Failed to fetch news feed');
      }
      const data = await response.json();
      const formattedData = data.map((item: any) => formatPostItem(item, 'campus'));
      setNewsItems(formattedData);
    } catch (error) {
      console.error('Error fetching news feed:', error.message);
      setError('Failed to fetch news feed. Please try again later.');
    }
  };

  const formatPostItem = (item: any, type: string): NewsItem => ({
    id: item.id,
    ownerName: item.campus_name || 'Unknown',
    owner: item.user,
    title: item.title,
    content: item.content,
    link: item.link,
    created_at: item.created_at,
    date: new Date(item.created_at).toLocaleDateString(),
    imageUrls: [item.file],
    fileUrl: item.file,
    likes: item.likes,
    dislikes: item.dislikes,
    shares: item.shares,
    type,
    showAllComments: false,
    liked: false,
    disliked: false,
    comments: []
  });

  const toggleComments = async (postId: number, type: string) => {
    const postIndex = newsItems.findIndex(item => item.id === postId && item.type === type);
    if (postIndex === -1) return;

    const updatedNewsItems = [...newsItems];
    const post = updatedNewsItems[postIndex];

    if (post.showAllComments) {
      post.showAllComments = false;
      setShowCommentsModal({ ...showCommentsModal, [postId]: false });
      setNewsItems(updatedNewsItems);
    } else {
      try {
        const response = await fetch(`http://127.0.0.1:8000/comments/${type}/${postId}/`);
        if (!response.ok) {
          throw new Error('Failed to fetch comments');
        }
        const data = await response.json();
        post.comments = data.comments;
        post.showAllComments = true;
        setShowCommentsModal({ ...showCommentsModal, [postId]: true });
        setNewsItems(updatedNewsItems);
        setTimeout(() => {
          if (commentsEndRef.current) {
            commentsEndRef.current.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      } catch (error) {
        console.error('Error fetching comments:', error.message);
        setError('Failed to fetch comments. Please try again later.');
      }
    }
  };

  const handleCommentChange = (e: ChangeEvent<HTMLTextAreaElement>, postId: number) => {
    setComments({ ...comments, [postId]: e.target.value });
  };

  const handleAddComment = async (postId: number, type: string) => {
    if (!comments[postId]?.trim()) {
      alert('Comment cannot be empty.');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/add-comment/', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          postId,
          postType: type,
          commentText: comments[postId]
        })
      });

      if (response.status === 401) {
        alert('You must be logged in to add a comment.');
        window.location.href = '/Login/';
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to add comment');
      }

      setComments({ ...comments, [postId]: '' });
      toggleComments(postId, type);
      setTimeout(() => {
        if (commentsEndRef.current) {
          commentsEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } catch (error) {
      console.error('Error adding comment:', error.message);
      setError('Failed to add comment. Please try again later.');
    }
  };

  const handleEditComment = (commentId: number, text: string) => {
    setEditingCommentId(commentId);
    setEditedCommentText(text);
  };

  const handleSaveEditedComment = async (commentId: number) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/comments/${commentId}/edit/`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          commentText: editedCommentText
        })
      });

      if (!response.ok) {
        throw new Error('Failed to edit comment');
      }

      setEditingCommentId(null);
      setEditedCommentText('');
      fetchNewsFeed();
    } catch (error) {
      console.error('Error saving edited comment:', error.message);
      setError('Failed to save edited comment. Please try again later.');
    }
  };

  const handleDeleteComment = async (commentId: number, postId: number, type: string) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/comments/${commentId}/delete/`, {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete comment');
      }

      toggleComments(postId, type);
    } catch (error) {
      console.error('Error deleting comment:', error.message);
      setError('Failed to delete comment. Please try again later.');
    }
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditedCommentText('');
  };

  const handleLikePost = async (postId: number, type: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to like a post.');
        window.location.href = '/login';
        return;
      }

      const response = await fetch('http://127.0.0.1:8000/like-post/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          postId,
          postType: type
        })
      });

      if (!response.ok) {
        throw new Error('Failed to like post');
      }

      const updatedNewsItems = newsItems.map(item =>
        item.id === postId && item.type === type ? { ...item, liked: !item.liked, likes: item.liked ? item.likes - 1 : item.likes + 1 } : item
      );

      setNewsItems(updatedNewsItems);
    } catch (error) {
      console.error('Error liking post:', error.message);
      setError('Failed to like post. Please try again later.');
    }
  };

  const handleDislikePost = async (postId: number, type: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to dislike a post.');
        window.location.href = '/login';
        return;
      }

      const response = await fetch('http://127.0.0.1:8000/dislike-post/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          postId,
          postType: type
        })
      });

      if (!response.ok) {
        throw new Error('Failed to dislike post');
      }

      fetchNewsFeed();
    } catch (error) {
      console.error('Error disliking post:', error.message);
      setError('Failed to dislike post. Please try again later.');
    }
  };

  const handleSharePost = async (postId: number, postType: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to share a post.');
        window.location.href = '/login';
        return;
      }

      const response = await fetch(
        `http://127.0.0.1:8000/share-post/${postType}/${postId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to share post');
      }

      const data = await response.json();
      setShareLink(data.shareLink);
      setShowShareModal(true);
    } catch (error) {
      console.error('Error sharing post:', error.message);
      setError('Failed to share post. Please try again later.');
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      alert('Link copied to clipboard');
    } catch (error) {
      console.error('Error copying link:', error.message);
      setError('Failed to copy link. Please try again later.');
    }
  };

  const handleCloseShareModal = () => {
    setShowShareModal(false);
  };

  const handleImageClick = (url: string) => {
    setSelectedImage(url);
  };

  const handleFileClick = (url: string) => {
    setSelectedFile(url);
  };

  const handleCloseImageModal = () => {
    setSelectedImage(null);
  };

  const handleCloseFileModal = () => {
    setSelectedFile(null);
  };

  const handleOutsideClick = (event: React.MouseEvent) => {
    if ((event.target as HTMLElement).classList.contains('modal')) {
      setShowCommentsModal({});
    }
  };

  const toggleExpandPost = (postId: number) => {
    setExpandedPost({ ...expandedPost, [postId]: !expandedPost[postId] });
  };

  const toggleDropdown = (postId: number) => {
    setDropdownOpen({ ...dropdownOpen, [postId]: !dropdownOpen[postId] });
  };

  const handleDropdownOption = (option: string, postId: number) => {
    alert(`Selected ${option} for post ${postId}`);
    setDropdownOpen({ ...dropdownOpen, [postId]: false });
  };

  const hidePost = (postId: number) => {
    const updatedNewsItems = newsItems.filter(item => item.id !== postId);
    setNewsItems(updatedNewsItems);
  };

  return (
    <div className="container mx-auto p-14">
      {error && <div className="alert alert-error shadow-lg mb-4">{error}</div>}
      {newsItems.map(item => (
        <div className="card w-full bg-base-100 shadow-xl mb-4" key={item.id}>
          <div className="card-body">
            <div className="flex items-center mb-4">
              <div className="avatar">
                <div className="w-12 h-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <Image src={"/images/lectures/temesgen.jfif"} alt={item.ownerName} width={48} height={48} className="rounded-full" />
                </div>
              </div>
              <div className="ml-4">
                <p className="font-bold">{item.ownerName}</p>
                <p className="text-sm text-gray-500">{item.date}</p>
              </div>
              <div className="ml-auto relative flex items-center">
                <div className="dropdown-menu">
                  <button className="btn btn-sm btn-circle btn-outline" onClick={() => toggleDropdown(item.id)}>
                    <FaEllipsisV />
                  </button>
                  {dropdownOpen[item.id] && (
                    <div className="absolute right-0 mt-2 w-48 bg-gray-800 text-white border border-gray-700 rounded-lg shadow-lg z-10">
                      <ul className="py-1">
                        <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer" onClick={() => handleDropdownOption('Save Post', item.id)}>Save Post</li>
                        <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer" onClick={() => handleDropdownOption('Hide Post', item.id)}>Hide Post</li>
                        <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer" onClick={() => handleDropdownOption('Report', item.id)}>Report</li>
                        <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer" onClick={() => handleDropdownOption('Other Option', item.id)}>Other Option</li>
                      </ul>
                    </div>
                  )}
                </div>
                <button className="btn btn-sm btn-circle btn-outline ml-2" onClick={() => hidePost(item.id)}>
                  <LiaTimesSolid />
                </button>
              </div>
            </div>
            <h2 className="card-title">{item.title}</h2>
            <p>
              {expandedPost[item.id] ? item.content : `${item.content.slice(0, 150)}...`}
              {item.content.length > 150 && (
                <button onClick={() => toggleExpandPost(item.id)} className="link link-primary ml-2">
                  {expandedPost[item.id] ? 'See Less' : 'See More'}
                </button>
              )}
            </p>
            {item.imageUrls.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {item.imageUrls.map((url, index) => (
                  <div key={index} className="relative">
                    <img src={url} alt={`Image ${index + 1}`} className="rounded-lg cursor-pointer" onClick={() => handleImageClick(url)} />
                    <div className="absolute bottom-2 right-2 bg-white rounded-full p-1 cursor-pointer" onClick={() => handleImageClick(url)}>
                      <FaExpand />
                    </div>
                  </div>
                ))}
              </div>
            )}
            {item.fileUrl && (
              <div className="mt-4">
                <a href="#" onClick={() => handleFileClick(item.fileUrl)} className="link link-primary flex items-center">
                  <FaSearchPlus className="mr-1" /> View File
                </a>
                <div className="mt-2">
                  <a href={item.fileUrl} download className="link link-primary flex items-center">
                    <FaDownload className="mr-1" /> Download File
                  </a>
                </div>
              </div>
            )}
            <div className="card-actions justify-between items-center mt-4">
              <div className="flex items-center space-x-4">
                <button className={`btn btn-ghost btn-sm ${item.liked ? 'text-blue-500' : ''}`} onClick={() => handleLikePost(item.id, item.type)}>
                  <FaThumbsUp className="mr-1" /> {item.likes}
                </button>
                <button className="btn btn-ghost btn-sm" onClick={() => handleSharePost(item.id, item.type)}>
                  <FaShare className="mr-1" /> {item.shares}
                </button>
                <button className="btn btn-ghost btn-sm" onClick={() => setShowShareModal(true)}>
                  <FaCopy className="mr-1" />
                </button>
                <button className="btn btn-ghost btn-sm" onClick={() => toggleComments(item.id, item.type)}>
                  <FaComments className="mr-1" /> Show Comments
                </button>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center space-x-2">
                <textarea
                  value={comments[item.id] || ''}
                  onChange={e => handleCommentChange(e, item.id)}
                  placeholder="Add a comment..."
                  rows={1}
                  className="textarea textarea-bordered w-full"
                />
                <button className="btn btn-primary btn-sm" onClick={() => handleAddComment(item.id, item.type)}>
                  <FaEdit />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
      {showShareModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <button className="btn btn-sm btn-circle absolute right-2 top-2" onClick={handleCloseShareModal}>
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-2">Share Link</h2>
            <input type="text" value={shareLink} readOnly className="input input-bordered w-full mb-2" />
            <button className="btn btn-primary w-full" onClick={copyLink}>Copy Link</button>
          </div>
        </div>
      )}
      {selectedImage && (
        <div className="modal modal-open" onClick={handleCloseImageModal}>
          <div className="modal-box">
            <button className="btn btn-sm btn-circle absolute right-2 top-2" onClick={handleCloseImageModal}>
              &times;
            </button>
            <img src={selectedImage} alt="Selected" className="w-full h-auto" />
          </div>
        </div>
      )}
      {selectedFile && (
        <div className="modal modal-open" onClick={handleCloseFileModal}>
          <div className="modal-box">
            <button className="btn btn-sm btn-circle absolute right-2 top-2" onClick={handleCloseFileModal}>
              &times;
            </button>
            <iframe src={selectedFile} className="w-full h-96" />
            <div className="mt-4">
              <a href={selectedFile} download className="link link-primary flex items-center">
                <FaDownload className="mr-1" /> Download File
              </a>
            </div>
          </div>
        </div>
      )}
      {Object.keys(showCommentsModal).map(postId => (
        showCommentsModal[postId] && (
          <div className="modal modal-open" key={postId} onClick={handleOutsideClick}>
            <div className="modal-box w-11/12 max-w-5xl relative bg-gray-800 text-white" onClick={(e) => e.stopPropagation()}>
              <button className="btn btn-sm btn-circle absolute right-2 top-2 text-white" onClick={() => toggleComments(Number(postId), newsItems.find(item => item.id === Number(postId))!.type)}>
                &times;
              </button>
              <h3 className="text-lg font-semibold mb-4">Comments</h3>
              <div className="overflow-y-auto max-h-96 pr-4">
                {newsItems.find(item => item.id === Number(postId))!.comments.map(comment => (
                  <div key={comment.id} className="mb-4 group">
                    <div className="flex items-start space-x-3">
                      <div className="avatar">
                        <div className="w-10 h-10 rounded-full">
                          <img src={comment.author.Avatar} alt={comment.author.Username} />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-bold">{comment.author.Username}</p>
                            <p className="text-gray-300">{comment.body}</p>
                          </div>
                          <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="btn btn-xs btn-outline btn-primary" onClick={() => handleEditComment(comment.id, comment.body)}>
                              <FaEdit />
                            </button>
                            <button className="btn btn-xs btn-outline btn-danger" onClick={() => handleDeleteComment(comment.id, Number(postId), newsItems.find(item => item.id === Number(postId))!.type)}>
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                        {editingCommentId === comment.id && (
                          <div className="mt-2">
                            <textarea
                              value={editedCommentText}
                              onChange={e => setEditedCommentText(e.target.value)}
                              rows={3}
                              className="textarea textarea-bordered w-full"
                            />
                            <div className="flex items-center space-x-2 mt-2">
                              <button className="btn btn-primary btn-sm" onClick={() => handleSaveEditedComment(comment.id)}>Save</button>
                              <button className="btn btn-secondary btn-sm" onClick={handleCancelEdit}>Cancel</button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={commentsEndRef} />
              </div>
              <div className="sticky bottom-0 left-0 w-full p-4 bg-gray-800">
                <div className="flex items-center space-x-2">
                  <textarea
                    value={comments[Number(postId)] || ''}
                    onChange={e => handleCommentChange(e, Number(postId))}
                    placeholder="Add a comment..."
                    rows={1}
                    className="textarea textarea-bordered w-full bg-gray-700 text-white placeholder-gray-400"
                  />
                  <button className="btn btn-primary btn-sm" onClick={() => handleAddComment(Number(postId), newsItems.find(item => item.id === Number(postId))!.type)}>
                    <FaEdit />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      ))}
    </div>
  );
};

export default CampusNewsFeed;
