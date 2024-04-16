import React from 'react';

interface Comment {
  id: number;
  user?: { name: string }; // Ensure user is optional
  content: string;
}

interface CommentSectionProps {
  comments?: Comment[]; // Ensure comments is optional
}

const CommentSection: React.FC<CommentSectionProps> = ({ comments }) => {
  if (!comments || comments.length === 0) {
    return <p>No comments</p>;
  }

  return (
    <ul>
      {comments.map((comment) => (
        <li key={comment.id}>
          <strong>{comment.user?.name || 'Anonymous'}</strong>: {comment.content}
        </li>
      ))}
    </ul>
  );
};

export default CommentSection;
