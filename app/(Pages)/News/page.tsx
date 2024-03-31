// Lala Dont forget to chenge the image into next Image 
'use client'; 
import React, { useState,ChangeEvent  } from 'react';
import { FaUser, FaThumbsUp, FaThumbsDown, FaComment, FaShare } from 'react-icons/fa';
import  Avater from '../../Components/Avater/Avater'
import ThemeController from '@/app/Components/ThemController/ThemController';
interface NewsItem {
  id: number;
  name: string;
  title: string;
  date: string;
  imageUrls: string[];
  likes: number;
  dislikes: number;
  comments: { id: number; text: string; avatar: string }[];
  shares: number;
  owner: string;
  showAllComments: boolean;
  liked: boolean;
  disliked: boolean;
}

const NewsFeed = () => {
  const [newComment, setNewComment] = useState('');
  const [newsItems, setNewsItems] = useState<NewsItem[]>([
    {
      id: 1,
      name:"Temesgen Debebe",
      title: "Scientists Discover New Exoplanet With Potential for Life",
      date: "March 25, 2024",
      imageUrls: [
        "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://via.placeholder.com/150",
      ],
      likes: 23,
      dislikes: 0,
      comments: [
        { id: 1, text: "Amazing discovery!", avatar: "https://via.placeholder.com/50" },
        { id: 2, text: "Can't wait for more details!", avatar: "https://via.placeholder.com/50" },
      ],
      shares: 10,
      owner: "John Doe",
      showAllComments: false,
      liked: false,
      disliked: false,
    },
    {
      id: 2,
      name:"Temesgen Debebe",
      title: "AI Breakthrough: Robot Solves Rubik's Cube in Record Time",
      date: "March 24, 2024",
      imageUrls: [
        "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      ],
      likes: 17,
      dislikes: 0,
      comments: [
        { id: 1, text: "Incredible technology!", avatar: "https://via.placeholder.com/50" },
        { id: 2, text: "This is the future!", avatar: "https://via.placeholder.com/50" },
      ],
      shares: 8,
      owner: "Jane Smith",
      showAllComments: false,
      liked: false,
      disliked: false,
    },
  ]);


  const handleCommentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setNewComment(e.target.value);
  };

  const handleCommentSubmit = (itemId: number) => {
    if (newComment.trim() !== '') {
      const updatedNewsItems = newsItems.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            comments: [
              ...item.comments,
              { id: item.comments.length + 1, text: newComment, avatar: "https://via.placeholder.com/50" },
            ],
          };
        }
        return item;
      });
      setNewsItems(updatedNewsItems);
      setNewComment('');
    }
  };

  const handleLike = (itemId: number) => {
    const updatedNewsItems = newsItems.map((item) => {
      if (item.id === itemId) {
        if (!item.liked) {
          return {
            ...item,
            likes: item.likes + 1,
            liked: true,
            disliked: false,
            dislikes: item.dislikes > 0 ? item.dislikes - 1 : 0,
          };
        } else {
          return {
            ...item,
            likes: item.likes - 1,
            liked: false,
          };
        }
      }
      return item;
    });
    setNewsItems(updatedNewsItems);
  };

  const handleDislike = (itemId: number) => {
    const updatedNewsItems = newsItems.map((item) => {
      if (item.id === itemId) {
        if (!item.disliked) {
          return {
            ...item,
            dislikes: item.dislikes + 1,
            disliked: true,
            liked: false,
            likes: item.likes > 0 ? item.likes - 1 : 0,
          };
        } else {
          return {
            ...item,
            dislikes: item.dislikes - 1,
            disliked: false,
          };
        }
      }
      return item;
    });
    setNewsItems(updatedNewsItems);
  };

  const toggleCommentsVisibility = (itemId: number) => {
    const updatedNewsItems = newsItems.map((item) => {
      if (item.id === itemId) {
        return {
          ...item,
          showAllComments: !item.showAllComments,
        };
      }
      return item;
    });
    setNewsItems(updatedNewsItems);
  };

  return (
    <div className="scrollbar-hide h-full overflow-y-auto p-8">
      {newsItems.map((item) => (
        <div key={item.id} className="bg-gray-800 p-4 rounded-md mb-4">
          <div className="flex  mb-2 gap-6 w-full">
            <div className=' flex gap-6 w-4/5' >
              <Avater/>
              <p className="text-gray-400">{item.name}</p>
            </div>
            <div className='' ><ThemeController/></div>
          </div>
          <h2 className="text-xl font-bold mb-2">{item.title}</h2>
          <p className="text-gray-400 mb-2">{item.date}</p>
          <div className="grid grid-cols-3 gap-4 mb-4">
            {item.imageUrls.map((imageUrl, index) => (
              <img key={index} src={imageUrl} alt={`Image ${index + 1}`} className="rounded-lg" />
            ))}
          </div>
          <div className="flex items-center justify-between text-gray-400">
            <div className="flex items-center">
              <button className="flex items-center mr-4" onClick={() => handleLike(item.id)} disabled={item.liked}>
                <FaThumbsUp className={`mr-1 ${item.liked ? 'text-blue-500' : ''}`} />
                {item.likes}
              </button>
              <button className="flex items-center mr-4" onClick={() => handleDislike(item.id)} disabled={item.disliked}>
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
                <svg className="h-6 w-6 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
                Save
              </button>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Comments</h3>
            {item.comments.slice(0, item.showAllComments ? item.comments.length : 2).map((comment) => (
              <div key={comment.id} className="flex items-center mb-2">
                <img src={comment.avatar} alt="Avatar" className="h-6 w-6 mr-2 rounded-full" />
                <p className="text-gray-400">{comment.text}</p>
              </div>
            ))}
          </div>
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