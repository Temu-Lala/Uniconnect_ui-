'use client';
import React, { useState, useEffect, ChangeEvent } from 'react';
import { FaThumbsUp, FaThumbsDown, FaShare, FaEdit } from 'react-icons/fa';
import Avater from '../../Components/Avater/Avater';
import ThemeController from '@/app/Components/ThemController/ThemController';
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

  const formatPostItem = (item: any, type: string): NewsItem => {
    const ownerName = item.user ? item.user.username : 'Unknown';
    return {
      id: item.id,
      owner: item.user,
      ownerName: ownerName,
      title: item.title,
      link: item.link,
      content: item.content,
      created_at: item.created_at,
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

  const handleCommentSubmit = async (postId: number, postType: string, e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault(); // Prevent default form submission

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
            'Authorization': `Bearer ${authToken}`
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

        const updatedCommentsResponse = await fetch(`http://127.0.0.1:8000/get_post_comments/${item.type}/${item.id}/`);
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
          'Authorization': `Bearer ${authToken}`
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

  const loadMoreComments = async (postId, lastCommentTimestamp) => {
    try {
      const post = newsItems.find(item => item.id === postId);
      if (!post) {
        throw new Error(`Post with ID ${postId} not found`);
      }

      const response = await fetch(`http://127.0.0.1:8000/comments/?postId=${postId}&lastCommentTimestamp=${lastCommentTimestamp}`);
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
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch comment for editing');
      }

      const data = await response.json();
      const editedCommentText = data.body;

      setEditedCommentText(editedCommentText);
      setEditingCommentId(commentId);
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
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          commentText: editedCommentText
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send edited comment');
      }

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
            <Avater src={item.owner ? item.owner.avatar : '/images/default-avatar.png'} alt="User Avatar" />
            <div className="flex flex-col w-full">
              <p className="text-white">{item.ownerName}</p>
              <p className="text-gray-500">{item.date}</p>
            </div>
          </div>
          <ThemeController />
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">{item.title}</h2>
        {item.imageUrls.length > 0 && (
          <img src={item.imageUrls[0]} alt="Post" className="rounded-md mb-2" />
        )}
        <p className="text-gray-300 mb-4">{item.content}</p>
        <div className="flex items-center gap-4 text-gray-400">
          <button className="flex items-center gap-2" onClick={() => handleLike(item.id)}>
            <FaThumbsUp className="text-xl" />
            <span>{item.likes}</span>
          </button>
          <button className="flex items-center gap-2" onClick={() => handleDislike(item.id)}>
            <FaThumbsDown className="text-xl" />
            <span>{item.dislikes}</span>
          </button>
          <button className="flex items-center gap-2">
            <FaShare className="text-xl" />
            <span>{item.shares}</span>
          </button>
          <button className="flex items-center gap-2" onClick={() => toggleCommentsVisibility(item.id)}>
            <FaEdit className="text-xl" />
            <span>{item.comments.length}</span>
          </button>
        </div>
        {item.showAllComments && (
          <div className="mt-4">
            {item.comments.map(comment => (
              <div key={comment.id} className="flex items-center gap-4 mb-4">
                <Avater src={comment.author.Avatar} alt="User Avatar" />
                <div className="flex flex-col">
                  <p className="text-white font-semibold">{comment.author.Username}</p>
                  <p className="text-gray-400">{comment.body}</p>
                  {editingCommentId === comment.id ? (
                    <div className="flex gap-4 mt-2">
                      <input
                        type="text"
                        className="px-2 py-1 rounded-md border border-gray-500"
                        value={editedCommentText}
                        onChange={(e) => setEditedCommentText(e.target.value)}
                      />
                      <button
                        className="px-4 py-1 rounded-md bg-green-500 text-white"
                        onClick={() => handleSendEditedComment(item.id, comment.id)}
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <button
                      className="text-blue-500 mt-2"
                      onClick={() => handleEditComment(item.id, comment.id)}
                    >
                      Edit
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button
              className="text-blue-500 mt-2"
              onClick={() => loadMoreComments(item.id, item.comments[item.comments.length - 1].created_on)}
            >
              Load more comments
            </button>
            <textarea
              className="w-full px-2 py-1 rounded-md border border-gray-500 mt-4"
              placeholder="Write a comment..."
              value={comments[item.id] || ''}
              onChange={(e) => handleCommentChange(item.id, e)}
            />
            <button
              className="px-4 py-1 rounded-md bg-blue-500 text-white mt-2"
              onClick={(e) => handleCommentSubmit(item.id, item.type, e)}
            >
              Comment
            </button>
          </div>
        )}
      </div>
    ))}
    {error && <p className="text-red-500">{error}</p>}
  </div>
);
};

export default NewsFeed;