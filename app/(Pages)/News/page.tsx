"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import {
  FaThumbsUp,
  FaThumbsDown,
  FaShare,
  FaEdit,
  FaRegUser,
} from "react-icons/fa";
import Avater from "../../Components/Avater/Avater";
import ThemeController from "@/app/Components/ThemController/ThemController";
import Link from "next/link";
import { CiCircleInfo, CiUser } from "react-icons/ci";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { BiUser } from "react-icons/bi";
import Image from "next/image";
import {
  MdOutlineAddBox,
  MdOutlineDomainVerification,
  MdOutlineLocalPhone,
} from "react-icons/md";
import { BsThreeDots, BsThreeDotsVertical } from "react-icons/bs";
import { LuThumbsUp } from "react-icons/lu";
import { IoAlertCircleOutline } from "react-icons/io5";
import ExpandableText from "./ExpandableText";

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
  comments: {
    id: number;
    body: string;
    author: { Username: string; Avatar: string };
    created_on: string;
    object_id: string;
  }[];
}

const PostSkeleton = () => (
  <div className="flex flex-col gap-4 w-full mb-8">
    <div className="flex gap-4 items-center">
      <div className="skeleton w-16 h-16 rounded-full shrink-0"></div>
      <div className="flex flex-col gap-4">
        <div className="skeleton h-4 w-28"></div>
        <div className="skeleton h-4 w-40"></div>
      </div>
    </div>
    <div className="skeleton h-48 w-full"></div>
  </div>
);

const NewsFeed = () => {
  const [comments, setComments] = useState<{ [postId: number]: string }>({});
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<{
    [userId: number]: { username: string };
  }>({});
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editedCommentText, setEditedCommentText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
      // Fetch newsItems and setNewsItems
      fetchNewsFeed();
      fetchUsers();
    }, 2000); // Adjust the timeout duration as needed

    // Cleanup function to clear timeout if component unmounts
    return () => clearTimeout(timeout);
  }, []);

  const fetchNewsFeed = async () => {
    try {
      const responses = await Promise.all([
        fetch('http://127.0.0.1:8000/university-profiles/'),
        fetch('http://127.0.0.1:8000/campus-profiles/'),
        fetch('http://127.0.0.1:8000/college-profiles/'),
        fetch('http://127.0.0.1:8000/department-profiles/'),
        fetch('http://127.0.0.1:8000/lecturer-posts/')
      ]);

      if (!responses.every((resp) => resp.ok)) {
        throw new Error("Failed to fetch news feed");
      }

      const data = await Promise.all(responses.map((resp) => resp.json()));

      const formattedData = data.flatMap((items, index) =>
        items.map((item) =>
          formatPostItem(
            item,
            ["university", "campus", "college", "department"][index]
          )
        )
      );
  
      // Fetch comments for each post individually
      const postCommentsPromises = formattedData.map(async (item) => {
        const response = await fetch(`http://127.0.0.1:8000/comments/?postId=${item.id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch comments for post ${item.id}`);
        }
        const comments = await response.json();
        const specificComments = comments.filter(comment => comment.post_id === item.id);
        return { ...item, comments: specificComments };
      });

      const postComments = await Promise.all(postCommentsPromises);

      setNewsItems(postComments);
    } catch (error) {
      console.error("Error fetching news feed:", error.message);
      setError("Failed to fetch news feed. Please try again later.");
    }
  };

  const fetchUsers = async () => {
    try {
      const authToken = localStorage.getItem("token");
      if (!authToken) {
        throw new Error(
          "User authentication token not found. Please log in again."
        );
      }

      const response = await fetch("http://127.0.0.1:8000/GustUser/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`, // Include the token in the Authorization header
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      const usersMap: { [userId: number]: { username: string } } = {};
      data.forEach((user: { id: number; username: string }) => {
        usersMap[user.id] = { username: user.username };
      });

      setUsers(usersMap);
    } catch (error) {
      console.error("Error fetching users:", error.message);
      setError("Failed to fetch users. Please try again later.");
    }
  };


  const formatPostItem = (item: any, type: string): NewsItem => {

    const ownerName = item.user ? item.user.username : 'Unknown';

    return {
      id: item.id,
      owner: type,
      ownerName,
      title: item.title,
      content: item.description,
      link: item.url,
      created_at: item.created_at,
      date: new Date(item.created_at).toLocaleDateString(),
      imageUrls: item.images.map((image: any) => image.url),
      likes: item.likes,
      dislikes: item.dislikes,
      shares: item.shares,
      type,
      showAllComments: false,
      liked: item.liked,
      disliked: item.disliked,
      comments: []
    };
  };

  const handleCommentChange = (
    postId: number,
    event: ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { value } = event.target;
    setComments((prevComments) => ({
      ...prevComments,
      [postId]: value,
    }));
  };

  const handleCommentSubmit = async (postId: number) => {
    const comment = comments[postId];
    if (!comment || comment.trim() === "") {
      alert("Please enter a comment");
      return;
    }

    const authToken = localStorage.getItem("token");
    if (!authToken) {
      alert("User authentication token not found. Please log in again.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/add-comment/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`, // Include the token in the Authorization header
        },
        body: JSON.stringify({
          post_id: postId,
          body: comment,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit comment");
      }

      // Refresh the news feed after submitting the comment
      await fetchNewsFeed();
      setComments((prevComments) => ({
        ...prevComments,
        [postId]: "",
      }));
    } catch (error) {
      console.error("Error submitting comment:", error.message);
      alert("Failed to submit comment. Please try again later.");
    }
  };

  const handleEditComment = (commentId: number, commentBody: string) => {
    setEditingCommentId(commentId);
    setEditedCommentText(commentBody);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditedCommentText("");
  };

  const handleSaveEdit = async (commentId: number, postId: number) => {
    if (!editedCommentText || editedCommentText.trim() === "") {
      alert("Please enter a comment");
      return;
    }

    const authToken = localStorage.getItem("token");
    if (!authToken) {
      alert("User authentication token not found. Please log in again.");
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/comments/${commentId}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`, // Include the token in the Authorization header
          },
          body: JSON.stringify({
            body: editedCommentText,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to edit comment");
      }

      // Refresh the news feed after editing the comment
      await fetchNewsFeed();
      setEditingCommentId(null);
      setEditedCommentText("");
    } catch (error) {
      console.error("Error editing comment:", error.message);
      alert("Failed to edit comment. Please try again later.");
    }
  };

  const handleDeleteComment = async (commentId: number, postId: number) => {
    const authToken = localStorage.getItem("token");
    if (!authToken) {
      alert("User authentication token not found. Please log in again.");
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/comments/${commentId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${authToken}`, // Include the token in the Authorization header
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete comment");
      }

      // Refresh the news feed after deleting the comment
      await fetchNewsFeed();
    } catch (error) {
      console.error("Error deleting comment:", error.message);
      alert("Failed to delete comment. Please try again later.");
    }
  };

  const handleLikeDislike = async (
    postId: number,
    action: "like" | "dislike"
  ) => {
    const authToken = localStorage.getItem("token");
    if (!authToken) {
      alert("User authentication token not found. Please log in again.");
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/posts/${action}/${postId}/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`, // Include the token in the Authorization header
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to ${action} post`);
      }

      // Refresh the news feed after liking/disliking the post
      await fetchNewsFeed();
    } catch (error) {
      console.error(`Error ${action} post:`, error.message);
      alert(`Failed to ${action} post. Please try again later.`);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      {isLoading && <PostSkeleton />}
      {newsItems.map((item) => (
        <div className="flex flex-col gap-4 w-full mb-8" key={item.id}>
          <div className="flex gap-4 items-center">
            <div className="h-16 w-16 rounded-full overflow-hidden">
              <img
                className="object-cover w-full h-full"
                src={item.owner === "university" ? "/images/uni.jpg" : ""}
                alt="Avatar"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Link href="#">
                <a className="text-sm font-semibold text-gray-800">
                  {item.ownerName}
                </a>
              </Link>
              <span className="text-xs text-gray-500">{item.date}</span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold text-gray-900">{item.title}</h2>
            <p className="text-gray-800">
              <ExpandableText maxChars={200} text={item.content} />
            </p>
            {item.imageUrls.map((imageUrl, index) => (
              <Image
                key={index}
                src={imageUrl}
                alt="Post Image"
                width={400}
                height={200}
                className="rounded-md"
              />
            ))}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex gap-4 items-center">
              <button
                onClick={() => handleLikeDislike(item.id, "like")}
                className={`flex gap-1 items-center ${
                  item.liked ? "text-primary-500" : "text-gray-500"
                }`}
              >
                <ThumbUpIcon className="h-5 w-5" />
                <span>{item.likes}</span>
              </button>
              <button
                onClick={() => handleLikeDislike(item.id, "dislike")}
                className={`flex gap-1 items-center ${
                  item.disliked ? "text-red-500" : "text-gray-500"
                }`}
              >
                <ThumbDownIcon className="h-5 w-5" />
                <span>{item.dislikes}</span>
              </button>
              <button
                onClick={() => handleDeletePost(item.id)}
                className="text-gray-500 hover:text-red-500"
              >
                Delete
              </button>
            </div>
            <button
              onClick={() => toggleComments(item.id)}
              className="text-primary-500 hover:underline"
            >
              {item.showAllComments ? "Hide" : "Show"} Comments ({item.comments.length})
            </button>
          </div>
          {item.showAllComments && (
            <div className="flex flex-col gap-4 mt-4">
              {item.comments.map((comment) => (
                <div
                  className="flex gap-4 items-start pb-4 border-b border-gray-200"
                  key={comment.id}
                >
                  <div className="h-12 w-12 rounded-full overflow-hidden">
                    <img
                      className="object-cover w-full h-full"
                      src={comment.user === "university" ? "/images/uni.jpg" : ""}
                      alt="Avatar"
                    />
                  </div>
                  <div className="flex flex-col gap-1 w-full">
                    <div className="flex items-center justify-between">
                      <Link href="#">
                        <a className="text-sm font-semibold text-gray-800">
                          {comment.userName}
                        </a>
                      </Link>
                      <span className="text-xs text-gray-500">
                        {comment.date}
                      </span>
                    </div>
                    {editingCommentId === comment.id ? (
                      <div className="flex gap-2 items-center">
                        <textarea
                          className="flex-1 border rounded-md px-2 py-1"
                          value={editedCommentText}
                          onChange={(e) => setEditedCommentText(e.target.value)}
                        ></textarea>
                        <button
                          onClick={() => handleCancelEdit()}
                          className="text-xs text-gray-500 hover:text-gray-700"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveEdit(comment.id, item.id)}
                          className="text-xs text-primary-500 hover:text-primary-700"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <p className="text-gray-800">{comment.body}</p>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          handleEditComment(comment.id, comment.body)
                        }
                        className="text-xs text-gray-500 hover:text-gray-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteComment(comment.id, item.id)
                        }
                        className="text-xs text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex gap-4 items-start pb-4 border-b border-gray-200">
                <div className="h-12 w-12 rounded-full overflow-hidden">
                  <img
                    className="object-cover w-full h-full"
                    src="/images/uni.jpg"
                    alt="Avatar"
                  />
                </div>
                <div className="flex flex-col gap-1 w-full">
                  <textarea
                    className="flex-1 border rounded-md px-2 py-1"
                    placeholder="Write a comment..."
                    value={comments[item.id] || ""}
                    onChange={(e) => handleCommentChange(item.id, e)}
                  ></textarea>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCommentSubmit(item.id)}
                      className="text-xs text-primary-500 hover:text-primary-700"
                    >
                      Comment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default NewsFeed;
