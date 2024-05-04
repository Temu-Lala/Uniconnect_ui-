import React, { useState } from 'react';

interface ExpandableTextProps {
  text: string;
  previewLength: number; // Number of characters in preview
}

const ExpandableText: React.FC<ExpandableTextProps> = ({ text, previewLength }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Function to find the position of the full stop near the preview length
  const findFullStop = (text: string, minLength: number) => {
    const end = text.indexOf('.', minLength);
    return end === -1 ? minLength : end + 1;
  };

  // Determine where to truncate the text
  const endOfPreview = findFullStop(text, previewLength);
  const previewText = text.substring(0, endOfPreview);

  // Toggle function for expanding and collapsing text
  const toggleText = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className=''>
      <p className="text-base inline">
        {isExpanded ? text : previewText}
      </p>
      <button
        onClick={toggleText}
        className="inline text-blue-500 hover:text-blue-600 transition-colors duration-200 ease-in-out text-sm mt-2"
      >
        {isExpanded ? ' See Less' : ' See More'}
      </button>
    </div>
  );
};

export default ExpandableText;
