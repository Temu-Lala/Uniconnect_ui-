'use client';
import React, { useState, useEffect, ChangeEvent } from 'react';
import { FaThumbsUp, FaThumbsDown, FaShare, FaEdit, FaCopy } from 'react-icons/fa';
import Avatar from '../../Components/Avater/Avater';
import ThemeController from '../../Components/ThemController/ThemController';
import Link from 'next/link';

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

const NewsFeed = () => {
  const [comments, setComments] = useState<{ [postId: number]: string }>({});
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editedCommentText, setEditedCommentText] = useState<string>('');
  const [shareLink, setShareLink] = useState<string>('');
  const [showShareModal, setShowShareModal] = useState<boolean>(false);

  useEffect(() => {
    fetchNewsFeed();
  }, []);

  const fetchNewsFeed = async () => {
    try {
      const responses = await Promise.all([
        fetch('http://127.0.0.1:8000/college-posts/'),
        fetch('http://127.0.0.1:8000/campus-posts/'),
        fetch('http://127.0.0.1:8000/university-posts/'),
        fetch('http://127.0.0.1:8000/department-posts/'),
        fetch('http://127.0.0.1:8000/lecturer-posts/')
      ]);

      if (!responses.every(resp => resp.ok)) {
        throw new Error('Failed to fetch news feed');
      }

      const data = await Promise.all(responses.map(resp => resp.json()));

      const formattedData = data.flatMap((items, index) =>
        items.map(item => formatPostItem(item, ['college', 'campus', 'university', 'department', 'lecturer'][index]))
      );

      setNewsItems(formattedData);
    } catch (error) {
      console.error('Error fetching news feed:', error.message);
      setError('Failed to fetch news feed. Please try again later.');
    }
  };

  const formatPostItem = (item: any, type: string): NewsItem => ({
    id: item.id,
    ownerName: item.owner_name,
    owner: item.owner,
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
        setNewsItems(updatedNewsItems);
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
        window.location.href = '/login';
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to add comment');
      }

      setComments({ ...comments, [postId]: '' });
      toggleComments(postId, type);
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

      fetchNewsFeed();
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

// NewsFeed.js (or relevant component)

const handleSharePost = async (postId, postType) => {
  try {
      const token = localStorage.getItem('token');
      if (!token) {
          alert('You must be logged in to share a post.');
          window.location.href = '/login'; // Redirect to login page
          return;
      }

      const response = await fetch(`http://127.0.0.1:8000/share-post/${postType}/${postId}`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          }
      });

      if (!response.ok) {
          throw new Error('Failed to share post');
      }

      const data = await response.json();
      setShareLink(data.shareLink); // Update state with share link
      setShowShareModal(true); // Show share modal
      fetchNewsFeed(); // Refresh news feed after sharing
  } catch (error) {
      console.error('Error sharing post:', error.message);
      setError('Failed to share post. Please try again later.');
  }
};

  
  
// NewsFeed.js (or relevant component)

const copyLink = async () => {
  try {
      navigator.clipboard.writeText(shareLink);
      alert('Link copied to clipboard');
  } catch (error) {
      console.error('Error copying link:', error.message);
      setError('Failed to copy link. Please try again later.');
  }
};

  const handleCloseShareModal = () => {
    setShowShareModal(false);
  };
  useEffect(() => {
    return () => {
      setShowShareModal(false);
    };
  }, []);
  return (
    <div className="news-feed-container">
      {error && <div className="error-message">{error}</div>}
      {newsItems.map(item => (
        <div className="news-item" key={item.id}>
          <div className="news-item-header">
            <Avatar username={item.ownerName} avatarUrl={item.ownerAvatar} />
            <div className="owner-name">{item.ownerName}</div>
            <div className="post-date">{item.date}</div>
          </div>
          <div className="news-item-content">
            <h2>{item.title}</h2>
            <p>{item.content}</p>
            {item.imageUrls.length > 0 && (
              <div className="image-container">
                {item.imageUrls.map((url, index) => (
                  <img key={index} src={url} alt={`Image ${index + 1}`} />
                ))}
              </div>
            )}
            {item.fileUrl && (
              <div className="file-container">
                <a href={item.fileUrl} target="_blank" rel="noopener noreferrer">
                  Download File
                </a>
              </div>
            )}
            <div className="news-item-actions">
              <button onClick={() => handleLikePost(item.id, item.type)}>
                <FaThumbsUp /> {item.likes}
              </button>
              {/* <button onClick={() => handleDislikePost(item.id, item.type)}>
                <FaThumbsDown /> {item.dislikes}
              </button> */}
              <button onClick={() => handleSharePost(item.id, item.type)}>
                <FaShare /> {item.shares}
              </button>
              <button onClick={() => setShowShareModal(true)}>
                <FaCopy />
              </button>
            </div>
          </div>
          <div className="comments-section">
            <h3>Comments</h3>
            {item.comments.map(comment => (
              <div key={comment.id} className="comment">
                <Avatar username={comment.author.Username} avatarUrl={comment.author.Avatar} />
                {editingCommentId === comment.id ? (
                  <>
                    <textarea
                      value={editedCommentText}
                      onChange={e => setEditedCommentText(e.target.value)}
                      rows={3}
                      cols={50}
                    />
                    <button onClick={() => handleSaveEditedComment(comment.id)}>Save</button>
                    <button onClick={handleCancelEdit}>Cancel</button>
                  </>
                ) : (
                  <>
                    <p>{comment.body}</p>
                    <div className="comment-actions">
                      <button onClick={() => handleEditComment(comment.id, comment.body)}>Edit</button>
                    </div>
                  </>
                )}
              </div>
            ))}
            <div className="add-comment">
              <textarea
                value={comments[item.id] || ''}
                onChange={e => handleCommentChange(e, item.id)}
                placeholder="Add a comment..."
                rows={3}
                cols={50}
              />
              <button onClick={() => handleAddComment(item.id, item.type)}>Add Comment</button>
            </div>
            <div className="toggle-comments">
              <button onClick={() => toggleComments(item.id, item.type)}>
                {item.showAllComments ? 'Hide Comments' : 'Show Comments'}
              </button>
            </div>
          </div>
        </div>
      ))}
      {showShareModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseShareModal}>&times;</span>
            <h2>Share Link</h2>
            <input type="text" value={shareLink} readOnly />
            <button onClick={copyLink}>Copy Link</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsFeed;
