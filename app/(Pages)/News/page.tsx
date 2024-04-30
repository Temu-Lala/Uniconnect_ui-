'use client'; 
import React, { useState, useEffect, ChangeEvent } from 'react';
import { FaThumbsUp, FaThumbsDown, FaShare, FaEdit } from 'react-icons/fa';
import Avater from '../../Components/Avater/Avater';
import ThemeController from '@/app/Components/ThemController/ThemController';

interface NewsItem {
  id: number;
  ownerName: string;
  owner: string;
  title: string;
  date: string;
  imageUrls: string[];
  likes: number;
  dislikes: number;
  shares: number;
  type: string;
  showAllComments: boolean;
  liked: boolean;
  disliked: boolean;
  comments: { id: number; body: string; author: { Username: string; Avatar: string }; created_on: string; object_id: string }[];
}
const NewsFeed = () => {
  const [comments, setComments] = useState<{ [postId: number]: string }>({});
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<{ [userId: number]: { username: string } }>({});
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editedCommentText, setEditedCommentText] = useState<string>('');
  useEffect(() => {
    fetchNewsFeed();
    fetchUsers();
  }, []);

  const fetchNewsFeed = async () => {
    try {
      const responses = await Promise.all([
        fetch('http://127.0.0.1:8000/college-posts/'),
        fetch('http://127.0.0.1:8000/campus-posts/'),
        fetch('http://127.0.0.1:8000/university-posts/'),
        fetch('http://127.0.0.1:8000/department-posts/')
      ]);
  
      if (!responses.every(resp => resp.ok)) {
        throw new Error('Failed to fetch news feed');
      }
  
      const data = await Promise.all(responses.map(resp => resp.json()));
  
      const formattedData = data.flatMap((items, index) =>
        items.map(item => formatPostItem(item, ['college', 'campus', 'university', 'department'][index]))
      );
  
      const postCommentsPromises = formattedData.map(async (item) => {
        if (!item.comments.length) {
          const response = await fetch(`http://127.0.0.1:8000/comments/?postId=${item.id}&postType=${item.type}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch comments for post ${item.id}`);
          }
          const comments = await response.json();
          return { ...item, comments };
        } else {
          return item;
        }
      });
  
      const postComments = await Promise.all(postCommentsPromises);
  
      setNewsItems(postComments);
    } catch (error) {
      console.error('Error fetching news feed:', error.message);
      setError('Failed to fetch news feed. Please try again later.');
    }
  };
  
  const fetchUsers = async () => {
    try {
      const authToken = localStorage.getItem('token');
      if (!authToken) {
        throw new Error('User authentication token not found. Please log in again.');
      }

      const response = await fetch('http://127.0.0.1:8000/GustUser/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}` // Include the token in the Authorization header
      },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      const usersMap: { [userId: number]: { username: string } } = {};
      data.forEach((user: { id: number; username: string }) => {
        usersMap[user.id] = { username: user.username };
      });

      setUsers(usersMap);
    } catch (error) {
      console.error('Error fetching users:', error.message);
      setError('Failed to fetch users. Please try again later.');
    }
  };

  const formatPostItem = (item: any, type: string): NewsItem => {
    const ownerName = users[item.owner] ? users[item.owner].username : 'Unknown';
    return {
      id: item.id,
      owner: item.owner,
      ownerName: ownerName,
      title: item.content,
      date: item.created_on,
      imageUrls: [item.file],
      likes: item.likes,
      dislikes: item.dislikes,
      shares: item.shares,
      type: type,
      showAllComments: false,
      liked: false,
      disliked: false,
      comments: []
    };
  };

  const handleCommentChange = (postId: number, e: ChangeEvent<HTMLTextAreaElement>) => {
    setComments({ ...comments, [postId]: e.target.value });
  };

  const handleCommentSubmit = async (postId: number, postType: string) => {
    try {
      const newCommentTrimmed = comments[postId]?.trim();
      if (newCommentTrimmed) {
        const authToken = localStorage.getItem('token');
        if (!authToken) {
          throw new Error('User authentication token not found. Please log in again.');
        }
        
        const response = await fetch('http://127.0.0.1:8000/add-comment/', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authToken}` // Include the token in the Authorization header
          },
          body: JSON.stringify({
            postId,
            postType,
            commentText: newCommentTrimmed,
          }),
        });
    
        if (!response.ok) {
          throw new Error('Failed to add comment');
        }
    
        const updatedCommentsResponse = await fetch(`http://127.0.0.1:8000/comments/?postId=${postId}&postType=${postType}`);
        if (!updatedCommentsResponse.ok) {
          throw new Error(`Failed to fetch updated comments for post ${postId}`);
        }
        const updatedComments = await updatedCommentsResponse.json();
  
        setNewsItems(prevItems =>
          prevItems.map(item => {
            if (item.id === postId) {
              return { ...item, comments: updatedComments };
            }
            return item;
          })
        );
  
        setComments({ ...comments, [postId]: '' });
      }
    } catch (error) {
      console.error('Error adding comment:', error.message);
      setError('Failed to add comment. Please try again later.');
    }
  };

  const handleLike = async (postId: number) => {
    const authToken = localStorage.getItem('token');

    try {
      const response = await fetch('http://127.0.0.1:8000/like-post/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}` // Include the token in the Authorization header
      },
        body: JSON.stringify({ postId }),
      });
      if (!response.ok) {
        throw new Error('Failed to like post');
      }
      const data = await response.json();
      setNewsItems(prevItems =>
        prevItems.map(item => (item.id === postId ? data : item))
      );
    } catch (error) {
      console.error('Error liking post:', error.message);
      setError('Failed to like post. Please try again later.');
    }
  };

  const handleDislike = async (postId: number) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/dislike-post/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId }),
      });
      if (!response.ok) {
        throw new Error('Failed to dislike post');
      }
      const data = await response.json();
      setNewsItems(prevItems =>
        prevItems.map(item => (item.id === postId ? data : item))
      );
    } catch (error) {
      console.error('Error disliking post:', error.message);
      setError('Failed to dislike post. Please try again later.');
    }
  };

  const toggleCommentsVisibility = (postId: number) => {
    setNewsItems(prevItems =>
      prevItems.map(item =>
        item.id === postId ? { ...item, showAllComments: !item.showAllComments } : item
      )
    );
  };

  const loadMoreComments = async (postId, postType, lastCommentTimestamp) => {
    try {
      const post = newsItems.find(item => item.id === postId);
      if (!post) {
        throw new Error(`Post with ID ${postId} not found`);
      }

      const response = await fetch(`http://127.0.0.1:8000/comments/?postId=${postId}&postType=${postType}&lastCommentTimestamp=${lastCommentTimestamp}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch more comments for post ${postId}`);
      }
      const { comments, users } = await response.json();

      const totalComments = post.totalComments + comments.length;

      const commentsWithUserDetails = comments.map(comment => {
        const user = users.find(user => user.id === comment.author);
        return {
          ...comment,
          author: {
            Username: user ? user.username : 'Unknown',
            Avatar: user ? user.avatar : '',
          }
        };
      });

      setNewsItems(prevItems =>
        prevItems.map(item => (item.id === postId ? { ...item, comments: [...item.comments, ...commentsWithUserDetails], totalComments: totalComments } : item))
      );
    } catch (error) {
      console.error('Error loading more comments:', error.message);
      setError('Failed to load more comments. Please try again later.');
    }
  };
  const handleEditComment = async (postId: number, commentId: number) => {
    try {
      const authToken = localStorage.getItem('token');
      if (!authToken) {
        throw new Error('User authentication token not found. Please log in again.');
      }
  
      const response = await fetch(`http://127.0.0.1:8000/comments/${commentId}/edit/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}` // Include the token in the Authorization header
        }
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch comment for editing');
      }
  
      const data = await response.json();
      const editedCommentText = data.body;
  
      // Set the edited comment text in the input field for editing
      setEditedCommentText(editedCommentText);
      setEditingCommentId(commentId); // Set the comment ID being edited
    } catch (error) {
      console.error('Error editing comment:', error.message);
      setError('Failed to edit comment. Please try again later.');
    }
  };
  
  const handleSendEditedComment = async (postId: number, commentId: number) => {
    try {
      const authToken = localStorage.getItem('token');
      if (!authToken) {
        throw new Error('User authentication token not found. Please log in again.');
      }
  
      const response = await fetch(`http://127.0.0.1:8000/comments/${commentId}/edit/`, {
        method: 'PUT', // Use PUT method to update the comment
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}` // Include the token in the Authorization header
        },
        body: JSON.stringify({
          commentText: editedCommentText // Use the edited comment text
        })
      });
  
      if (!response.ok) {
        throw new Error('Failed to send edited comment');
      }
  
      // Update the comment text in the UI without adding a new comment entry
      setNewsItems(prevItems =>
        prevItems.map(item => {
          if (item.id === postId) {
            const updatedComments = item.comments.map(comment => {
              if (comment.id === commentId) {
                return { ...comment, body: editedCommentText };
              }
              return comment;
            });
            return { ...item, comments: updatedComments };
          }
          return item;
        })
      );
  
      // Reset editing state
      setEditingCommentId(null);
      setEditedCommentText('');
    } catch (error) {
      console.error('Error sending edited comment:', error.message);
      setError('Failed to send edited comment. Please try again later.');
    }
  };
  
  return (
    <div className="scrollbar-hide h-full overflow-y-auto p-8">
    {newsItems.map((item) => (
      <div key={item.id} className="bg-gray-800 p-4 rounded-md mb-4">
        <div className="flex mb-2 gap-6 w-full">
          <div className="flex gap-6 w-4/5">
            <Avater />
            <p className="text-gray-400">{item.ownerName}</p>
            <p className="text-gray-400">{item.owner}</p>
          </div>
          <div>
            <ThemeController />
          </div>
        </div>
        <h2 className="text-xl font-bold mb-2">{item.title}</h2>
        <p className="text-gray-400 mb-2">{item.date}</p>
        {/* Display images */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          {item.imageUrls && Array.isArray(item.imageUrls) && item.imageUrls.map((imageUrl, index) => (
            <img key={index} src={imageUrl} alt={`Image ${index + 1}`} className="rounded-lg" />
          ))}
        </div>
        {/* Display like, dislike, share buttons */}
        <div className="flex items-center justify-between text-gray-400">
          <div className="flex items-center">
            {/* Like, Dislike, Share buttons */}
          </div>
          <div>
            {/* Toggle comments visibility */}
            <button className="flex items-center" onClick={() => toggleCommentsVisibility(item.id)}>
              {item.showAllComments ? 'Hide Comments' : 'See More'}
            </button>
          </div>
        </div>
        {/* Display comments */}
        {item.showAllComments && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Comments</h3>
            {item.comments.filter(comment => comment.object_id === item.id).map((comment) => (
              <div key={comment.id} className="flex items-center mb-2">
                <img src={comment.author.Avatar} alt="Avatar" className="h-6 w-6 mr-2 rounded-full" />
                <p className="text-gray-400">{comment.author.Username}</p>
                <p className="text-gray-400">{editingCommentId === comment.id ? 
                  <input 
                    type="text" 
                    value={editedCommentText} 
                    onChange={(e) => setEditedCommentText(e.target.value)} 
                    className="border border-gray-300 rounded-md p-1 mr-2"
                  /> 
                  : comment.body}
                </p>
                <p className="text-gray-400">{comment.created_on}</p>
                {editingCommentId === comment.id ? (
                  <button className="flex items-center" onClick={() => handleSendEditedComment(item.id, comment.id)}>
                    Send Edited Comment
                  </button>
                ) : (
                  <button className="flex items-center" onClick={() => handleEditComment(item.id, comment.id)}>
                    <FaEdit className="mr-1" />
                    Edit
                  </button>
                )}
              </div>
            ))}
            {/* Load more comments button */}
            <div className="mt-2">
              <button className="text-gray-400 hover:text-white" onClick={() => loadMoreComments(item.id, item.type)}>
                Load More Comments
              </button>
            </div>
          </div>
        )}
        {/* Add comment section */}
        <div className="mt-4">
          <textarea
            className="w-full h-16 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
            placeholder="Add a comment..."
            value={comments[item.id] || ''}
            onChange={(e) => handleCommentChange(item.id, e)}
          />
          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded-md ml-2"
            onClick={() => handleCommentSubmit(item.id, item.type)}
          >
            Send
          </button>
        </div>
      </div>
    ))}
  </div>
);
};

export default NewsFeed;