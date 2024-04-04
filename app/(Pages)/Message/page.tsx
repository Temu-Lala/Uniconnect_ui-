"use client"
import React, { useState, useEffect, useRef } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { MdEmojiEmotions } from "react-icons/md";

// Contact List Component
const ContactList = ({ onContactSelect }) => {
  // Dummy data for contacts
  const contacts = [
    { id: 1, name: 'John Doe', avatar: 'https://via.placeholder.com/40' },
    { id: 2, name: 'Jane Smith', avatar: 'https://via.placeholder.com/40' },
    { id: 3, name: 'Alice Johnson', avatar: 'https://via.placeholder.com/40' },
    { id: 4, name: 'Bob Williams', avatar: 'https://via.placeholder.com/40' },
    { id: 5, name: 'Eve Brown', avatar: 'https://via.placeholder.com/40' },
  ];

  const handleContactClick = (contact) => {
    onContactSelect(contact);
  };

  return (
    <div className="w-1/4 bg-gray-200 p-4 overflow-y-auto">
      <h2 className="text-lg font-bold mb-4">Contacts</h2>
      <ul>
        {contacts.map(contact => (
          <li key={contact.id} className="flex items-center py-2 hover:bg-gray-300 cursor-pointer" onClick={() => handleContactClick(contact)}>
            <img className="w-8 h-8 rounded-full mr-2" src={contact.avatar} alt="Avatar" />
            <span className="text-gray-800">{contact.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Main ChatApp Component
const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showChatOptions, setShowChatOptions] = useState(false);
  const [isContactSelected, setIsContactSelected] = useState(false); // New state variable
  const messagesEndRef = useRef(null);
  const emojiPickerRef = useRef(null); // Ref for emoji picker

  // Dummy initial messages for demonstration
  useEffect(() => {
    setMessages([
      { id: 1, text: 'Hey there!', sender: 'user' },
      { id: 2, text: 'Hi! How can I help you?', sender: 'bot' },
    ]);
  }, []);

  // Function to handle sending a message
  const sendMessage = () => {
    if (newMessage.trim() === '') return; // Ignore empty messages
    const message = {
      id: messages.length + 1,
      text: newMessage.trim(),
      sender: 'user',
    };
    setMessages([...messages, message]);
    setNewMessage('');
  };

  // Function to handle emoji selection
  const handleEmojiClick = emoji => {
    const emojiUnicode = emoji.emoji;
    setNewMessage(prevMessage => prevMessage + emojiUnicode);
  };

  // Function to handle contact selection
  const handleContactSelect = (contact) => {
    setSelectedContact(contact);
    setShowChatOptions(true);
    setIsContactSelected(true); // Set the flag to indicate contact selection
  };

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target) && emojiPickerVisible) {
        setEmojiPickerVisible(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [emojiPickerVisible]);

  // Scroll to the latest message when new message arrives
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex bg-gray-100 text-black min-h-screen">
      {/* Contact List */}
      <ContactList onContactSelect={handleContactSelect} />

      {/* Chat Section - Render only if a contact is selected */}
      {isContactSelected && (
        <div className="w-3/4 flex flex-col">
          <div className="bg-white rounded-lg shadow-md overflow-hidden flex-1 relative">
            {/* Chat header */}
            <div className="bg-teal-500 text-white p-4 flex justify-between items-center">
              <div className="flex items-center">
                {selectedContact && (
                  <>
                    <img className="w-10 h-10 rounded-full mr-2" src={selectedContact.avatar} alt="Avatar" />
                    <p className="font-bold">{selectedContact.name}</p>
                  </>
                )}
              </div>
              <div className="flex items-center">
                {showChatOptions && (
                  <>
                    <button className="mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                        {/* Add SVG for video call */}
                      </svg>
                    </button>
                    <button className="mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                        {/* Add SVG for voice call */}
                      </svg>
                    </button>
                  </>
                )}
                <button onClick={() => setEmojiPickerVisible(!emojiPickerVisible)}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                    {/* Add SVG for emoji */}
                  </svg>
                </button>
              </div>
            </div>

            {/* Chat messages */}
            <div className="px-4 py-2  overflow-y-auto" style={{ maxHeight: '60vh' }}>
              {messages.map(message => (
                <div key={message.id} className={`flex mb-4 ${message.sender === 'user' ? ' justify-end' : 'justify-start'}`}>
                  <div className={`bg-${message.sender === 'user' ? 'teal' : 'gray'}-100 text-gray-800 p-3 rounded-lg max-w-md ${message.sender === 'user' && message.text.includes('emoji') ? 'text-2xl' : ''}`}>
                    <p className="text-sm ">{message.text}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Emoji Picker */}
            {emojiPickerVisible && (
              <div ref={emojiPickerRef} className="absolute bottom-10 right-0 z-10 bg-white p-4 shadow-lg">
                <EmojiPicker onEmojiClick={handleEmojiClick} />
              </div>
            )}
          </div>

          {/* Chat input */}
          <div className="bg-white p-4">
            <div className="flex items-center relative">
              <input
                className="flex-1 min-w-0 border border-gray-300 rounded-full px-12 py-2 mr-2 focus:outline-none"
                type="text"
                placeholder="Type your message..."
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && sendMessage()}
              />
              <button
                className="absolute left-4 bg-black border-none outline-none focus:outline-none"
                onClick={() => setEmojiPickerVisible(!emojiPickerVisible)}
              >
                               <MdEmojiEmotions/>

              </button>
              <button
                className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-6 rounded-full"
                onClick={sendMessage}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatApp;
