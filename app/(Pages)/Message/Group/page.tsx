"use client"
import React, { useState, useEffect, useRef } from 'react';
import { BiMessageSquareAdd } from 'react-icons/bi'; // Icon for "Add Member"
import { AiOutlineSend } from 'react-icons/ai'; // Icon for "Send"
import { BsImage } from 'react-icons/bs'; // Icon for "Image"
import EmojiPicker from 'emoji-picker-react'; // Emoji Picker library

// Modal Component for Adding Group
const CreateGroupModal = ({ onClose, onCreateGroup }) => {
  const [groupName, setGroupName] = useState('');
  const [memberInput, setMemberInput] = useState('');
  const [groupMembers, setGroupMembers] = useState([]);

  const handleAddMember = () => {
    if (memberInput.trim() === '') return;
    setGroupMembers(prevMembers => [...prevMembers, memberInput.trim()]);
    setMemberInput('');
  };

  const handleCreateGroup = () => {
    if (groupName.trim() === '' || groupMembers.length === 0) return;
    onCreateGroup(groupName.trim(), groupMembers);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-75">
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Create Group</h2>
        <div className="mb-4">
          <label htmlFor="group_name" className="block text-sm font-medium text-gray-700">Group Name:</label>
          <input
            id="group_name"
            type="text"
            className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:border-blue-500"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="member_name" className="block text-sm font-medium text-gray-700">Add Members:</label>
          <div className="flex items-center">
            <input
              id="member_name"
              type="text"
              className="mt-1 p-2 border border-gray-300 rounded-l w-full focus:outline-none focus:border-blue-500"
              placeholder="Enter member name..."
              value={memberInput}
              onChange={(e) => setMemberInput(e.target.value)}
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 focus:outline-none"
              onClick={handleAddMember}
            >
              Add
            </button>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Group Members:</label>
          <ul className="list-disc pl-5">
            {groupMembers.map((member, index) => (
              <li key={index}>{member}</li>
            ))}
          </ul>
        </div>
        <div className="flex justify-end">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2 focus:outline-none"
            onClick={handleCreateGroup}
          >
            Create Group
          </button>
          <button
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 focus:outline-none"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// Main GroupChat Component
const GroupChat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [groupMembers, setGroupMembers] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false); // State for showing modal
  const [selectedGroup, setSelectedGroup] = useState(null); // State for selected group
  const [selectedImage, setSelectedImage] = useState(null); // State for selected image
  const fileInputRef = useRef(null); // Ref for file input
  const messagesEndRef = useRef(null);
  const emojiPickerRef = useRef(null); // Ref for emoji picker
  const modalRef = useRef(null); // Ref for modal container

  const sendMessage = () => {
    if (newMessage.trim() === '') return;
    const message = {
      text: newMessage.trim(),
      sender: 'Me',
      type: 'text', // indicating text message
    };
    setMessages([...messages, message]);
    setNewMessage('');
  };

  const handleEmojiClick = emoji => {
    const emojiUnicode = emoji.emoji;
    setNewMessage(prevMessage => prevMessage + emojiUnicode);
  };

  const handleCreateGroup = (groupName, members) => {
    console.log("Group Name:", groupName);
    console.log("Group Members:", members);
    // Add logic to create the group
    // For demonstration, we are just updating the group members state
    setGroupMembers(members);
    setSelectedGroup({ groupName, members });
    setShowCreateGroupModal(false);
  };

  const handleFileChange = (event) => {
    const files = event.target.files;
    if (!files) return;
    const fileArray = Array.from(files);
    fileArray.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;
        const message = {
          sender: 'Me',
          type: 'image', // indicating image message
          url: imageUrl,
        };
        setMessages(prevMessages => [...prevMessages, message]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const closeModal = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setSelectedImage(null);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    document.addEventListener('mousedown', closeModal);
    return () => {
      document.removeEventListener('mousedown', closeModal);
    };
  }, [messages]);

  return (
    <div className="flex bg-gray-100 text-black min-h-screen">
      <div className="w-1/4 bg-gray-200 p-4 overflow-y-auto">
        {selectedGroup ? (
          <>
            <h2 className="text-lg font-bold mb-4 cursor-pointer" onClick={() => setSelectedGroup(null)}>{selectedGroup.groupName}</h2>
            <h3 className="text-md font-semibold mb-2">Group Members</h3>
            <ul>
              {selectedGroup.members.map((member, index) => (
                <li key={index} className="py-2">
                  {member}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none"
            onClick={() => setShowCreateGroupModal(true)}
          >
            <BiMessageSquareAdd className="mr-2" />Create Group
          </button>
        )}
      </div>

      <div className="w-3/4 flex flex-col">
        <div className="bg-white rounded-lg shadow-md overflow-hidden flex-1 relative">
          <div className="px-4 py-2  overflow-y-auto" style={{ maxHeight: '60vh' }}>
            {messages.map((message, index) => (
              <div key={index} className="mb-2">
                {message.type === 'text' ? (
                  <>
                    <span className="font-bold">{message.sender}: </span>
                    <span>{message.text}</span>
                  </>
                ) : message.type === 'image' ? (
                  <img src={message.url} alt="Uploaded" style={{ maxWidth: '100%', height: 'auto', cursor: 'pointer' }} onClick={() => handleImageClick(message.url)} />
                ) : null}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          {showEmojiPicker && (
            <div ref={emojiPickerRef} className="absolute bottom-16 right-0">
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>
          )}
        </div>
        <div className="bg-gray-200 p-4 flex items-center">
          <input
            type="text"
            className="flex-1 border border-gray-300 rounded-l px-4 py-2 focus:outline-none focus:border-blue-500"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <input
            type="file"
            className="hidden"
            onChange={handleFileChange}
            ref={fileInputRef}
            id="fileInput" // Add id attribute
            multiple // Allow multiple file selection
          />
          <label
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
            htmlFor="fileInput" // Link label to file input by id
          >
            <BsImage size={20} /> Upload Image
          </label>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none"
            onClick={sendMessage}
          >
            <AiOutlineSend size={20} />
          </button>
          <button
            className="ml-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            😀
          </button>
        </div>
      </div>

      {/* Modal for Creating Group */}
      {showCreateGroupModal && (
        <CreateGroupModal
          onClose={() => setShowCreateGroupModal(false)}
          onCreateGroup={handleCreateGroup}
        />
      )}

      {/* Modal for viewing image in larger size */}
      {selectedImage && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg" ref={modalRef}>
            <img src={selectedImage} alt="Uploaded" className="max-w-full max-h-full" />
            <button
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 mt-4 focus:outline-none"
              onClick={() => setSelectedImage(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupChat;
