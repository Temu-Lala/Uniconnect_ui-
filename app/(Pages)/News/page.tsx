'use client'; 
import React, { useState, useEffect, ChangeEvent } from 'react';
import { FaThumbsUp, FaThumbsDown, FaShare } from 'react-icons/fa';
import Avater from '../../Components/Avater/Avater';
import ThemeController from '@/app/Components/ThemController/ThemController';

interface NewsItem {
  id: number;
  name: string;
  title: string;
  date: string;
  imageUrls: string[];
  likes: number;
  dislikes: number;
  shares: number;
  owner: string;
  showAllComments: boolean;
  liked: boolean;
  disliked: boolean;
  comments: { id: number; text: string; avatar: string }[];
}

const NewsFeed = () => {
  const [newComment, setNewComment] = useState('');
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);

  useEffect(() => {
    fetchNewsFeed();
  }, []);

  const fetchNewsFeed = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/posts/');
      if (!response.ok) {
        throw new Error('Failed to fetch news feed');
      }
      const data = await response.json();
      const formattedData = await Promise.all(data.map(async (item: any) => {
        const commentsResponse = await fetch(`http://127.0.0.1:8000/comments/?post=${item.id}`);
        if (!commentsResponse.ok) {
          throw new Error(`Failed to fetch comments for post ${item.id}`);
        }
        const commentsData = await commentsResponse.json();
        return {
          id: item.id,
          name: item.owner,
          title: item.content,
          date: item.created_at,
          imageUrls: [item.file],
          likes: item.likes,
          dislikes: item.dislikes,
          shares: item.shares,
          owner: item.owner,
          showAllComments: false,
          liked: false,
          disliked: false,
          comments: commentsData,
        };
      }));
      setNewsItems(formattedData);
    } catch (error) {
      console.error('Error fetching news feed:', error.message);
    }
  };
  
  const handleCommentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setNewComment(e.target.value);
  };

  const handleCommentSubmit = async (postId: number) => {
    try {
      if (newComment.trim() !== '') {
        const response = await fetch('http://127.0.0.1:8000/comments/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ postId: postId, commentText: newComment }), // Include postId in the request body
        });
        if (!response.ok) {
          throw new Error('Failed to add comment');
        }
        const data = await response.json();
        setNewsItems((prevItems) =>
          prevItems.map((item) => (item.id === postId ? { ...item, comments: [...item.comments, data] } : item))
        );
        setNewComment('');
      }
    } catch (error) {
      console.error('Error adding comment:', error.message);
    }
  };
  

  const handleLike = async (postId: number) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/like-post/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId }),
      });
      if (!response.ok) {
        throw new Error('Failed to like post');
      }
      const data = await response.json();
      setNewsItems((prevItems) =>
        prevItems.map((item) => (item.id === postId ? data : item))
      );
    } catch (error) {
      console.error('Error liking post:', error.message);
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
      setNewsItems((prevItems) =>
        prevItems.map((item) => (item.id === postId ? data : item))
      );
    } catch (error) {
      console.error('Error disliking post:', error.message);
    }
  };

  const toggleCommentsVisibility = (postId: number) => {
    setNewsItems((prevItems) =>
      prevItems.map((item) =>
        item.id === postId ? { ...item, showAllComments: !item.showAllComments } : item
      )
    );
  };

  return (
    <div className="scrollbar-hide h-full overflow-y-auto p-8">
      {newsItems.map((item) => (
        <div key={item.id} className="bg-gray-800 p-4 rounded-md mb-4">
          <div className="flex mb-2 gap-6 w-full">
            <div className="flex gap-6 w-4/5">
              <Avater />
              <p className="text-gray-400">{item.name}</p>
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

          <div className="flex items-center justify-between text-gray-400">
            <div className="flex items-center">
              <button
                className="flex items-center mr-4"
                onClick={() => handleLike(item.id)}
                disabled={item.liked}
              >
                <FaThumbsUp className={`mr-1 ${item.liked ? 'text-blue-500' : ''}`} />
                {item.likes}
              </button>
              <button
                className="flex items-center mr-4"
                onClick={() => handleDislike(item.id)}
                disabled={item.disliked}
              >
                <FaThumbsDown className={`mr-1 ${item.disliked ? 'text-red-500' : ''}`} />
                {item.dislikes}
              </button>
              <button className="flex items-center">
                <FaShare className="mr-1" />
                {item.shares}
              </button>
            </div>
            <div>
              <button className="flex items-center" onClick={() => toggleCommentsVisibility(item.id)}>
                {item.showAllComments ? 'Hide Comments' : 'See More'}
              </button>
              <button className="flex items-center">
                <svg
                  className="h-6 w-6 mr-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                  <path
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
                Save
              </button>
            </div>
          </div>
          {item.showAllComments && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Comments</h3>
              {item.comments.map((comment) => (
                <div key={comment.id} className="flex items-center mb-2">
                  <img src={comment.avatar} alt="Avatar" className="h-6 w-6 mr-2 rounded-full" />
                  <p className="text-gray-400">{comment.body}</p>
                </div>
              ))}
            </div>
          )}
          {!item.showAllComments && item.comments.length > 2 && (
            <div className="mt-2">
              <button className="text-gray-400 hover:text-white" onClick={() => toggleCommentsVisibility(item.id)}>
                See More Comments
              </button>
            </div>
          )}
          <div className="mt-4">
            <textarea
              className="w-full h-16 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
              placeholder="Add a comment..."
              value={newComment}
              onChange={handleCommentChange}
            />
            <button
              className="px-4 py-2 bg-indigo-600 text-white rounded-md ml-2"
              onClick={() => handleCommentSubmit(item.id)}
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
