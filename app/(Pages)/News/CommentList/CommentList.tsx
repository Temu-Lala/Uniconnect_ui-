// components/CommentList.js
import React from 'react';

const CommentList = ({ comments }) => {
  return (
    <div className="mb-4">
      <h4 className="text-lg font-semibold mb-2">Comments:</h4>
      {post.comments && post.comments.map(comment => (
  <div key={comment.id} className="border-b border-gray-600 mb-2">
    <p className="text-gray-400">{comment.body}</p>
    <p className="text-gray-500">Comment by: {comment.author}</p>
  </div>
))}

    </div>
  );
};

export default CommentList;
