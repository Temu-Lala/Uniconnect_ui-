"use client";
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import EmojiPicker from 'emoji-picker-react';
import { MdEmojiEmotions } from 'react-icons/md';

// Contact List Component
const ContactList = ({ onContactSelect }) => {
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const authToken = localStorage.getItem('token');

  useEffect(() => {
    const fetchContactsWithChats = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/messages/contacts_with_chats/', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
        });
        setContacts(response.data);
      } catch (error) {
        console.error('Error fetching contacts with chats:', error);
      }
    };

    fetchContactsWithChats();
  }, [authToken]);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/GustUser/?search=${searchTerm}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
      });
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      handleSearch();
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  const handleContactClick = (contact) => {
    onContactSelect(contact);
    localStorage.setItem('selectedContact', JSON.stringify(contact));
  };

  return (
    <div className="w-1/4 pt-40 bg-gray-200 p-4 overflow-y-auto">
      <h2 className="text-lg font-bold mb-4">Contacts</h2>
      <input
        type="text"
        placeholder="Search users..."
        className="border border-gray-300 rounded-full px-3 py-1 mb-4 w-full"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ul>
        {(searchTerm ? searchResults : contacts).map(contact => (
          <li key={contact.id} className="flex items-center py-2 hover:bg-gray-300 cursor-pointer" onClick={() => handleContactClick(contact)}>
            <img className="w-8 h-8 rounded-full mr-2" src={contact.avatar} alt="Avatar" />
            <span className="text-gray-800">{contact.username}</span>
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
  const [selectedContact, setSelectedContact] = useState(null);
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const messagesEndRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const authToken = localStorage.getItem('token');
  const senderId = authToken ? JSON.parse(atob(authToken.split('.')[1])).user_id : null;

  const fetchMessages = async (recipientId) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/messages/user_messages/?recipient_id=${recipientId}&sender_id=${senderId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
      });
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedContact) return;

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/messages/send_message/`,
        {
          content: newMessage.trim(),
          recipient_id: selectedContact.id
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
        }
      );

      setMessages([...messages, response.data]);
      setNewMessage('');
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleContactSelect = async (contact) => {
    setSelectedContact(contact);
    await fetchMessages(contact.id);
    localStorage.setItem('selectedContact', JSON.stringify(contact));
  };

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

  useEffect(() => {
    const storedContact = JSON.parse(localStorage.getItem('selectedContact'));
    if (storedContact) {
      setSelectedContact(storedContact);
      fetchMessages(storedContact.id);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleEmojiClick = emoji => {
    setNewMessage(prevMessage => prevMessage + emoji.emoji);
  };

  return (
    <div className="flex pt-40 bg-gray-100 text-black min-h-screen">
      <ContactList onContactSelect={handleContactSelect} />

      {selectedContact ? (
        <div className="w-3/4 flex flex-col">
          <div className="bg-white rounded-lg shadow-md overflow-hidden flex-1 relative">
            <div className="bg-teal-500 text-white p-4 flex justify-between items-center">
              <p className="font-bold">{selectedContact.username}</p>
              <div className="flex items-center">
                <button onClick={() => setEmojiPickerVisible(!emojiPickerVisible)}>
                  <MdEmojiEmotions />
                </button>
              </div>
            </div>

            <div className="px-4 py-2 overflow-y-auto max-h-96">
              {messages.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No messages yet</p>
              ) : (
                messages.map((message, index) => (
                  <div key={index} className={`flex mb-4 ${message.sender === senderId ? 'justify-end' : 'justify-start'}`}>
                    <div className={`bg-${message.sender === senderId ? 'teal' : 'gray'}-100 text-gray-800 p-3 rounded-lg max-w-md`}>
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                ))
              )}

              <div ref={messagesEndRef} />
            </div>

            {emojiPickerVisible && (
              <div ref={emojiPickerRef} className="absolute bottom-10 right-0 z-10 bg-white p-4 shadow-lg">
                <EmojiPicker onEmojiClick={handleEmojiClick} />
              </div>
            )}
          </div>

          <div className="bg-white p-4">
            <div className="flex items-center relative">
              <input
                className="flex-1 min-w-0 border border-gray-300 rounded-full px-4 py-2 mr-2 focus:outline-none"
                type="text"
                placeholder="Type your message..."
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && sendMessage()}
              />
              <button
                className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-6 rounded-full"
                onClick={sendMessage}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-3/4 flex items-center justify-center">
          <p className="text-center text-gray-500 py-4">Select a contact to start chatting</p>
        </div>
      )}
    </div>
  );
};

export default ChatApp;
