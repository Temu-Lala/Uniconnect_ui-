"use client";
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { MdEmojiEmotions } from 'react-icons/md';

interface Contact {
  id: number;
  username: string;
  avatar: string;
  is_online: boolean;
}

interface Message {
  id: number;
  sender: number;
  content: string;
  timestamp: string;
  read: boolean;
}

interface ContactListProps {
  onContactSelect: (contact: Contact) => void;
}

const ContactList: React.FC<ContactListProps> = ({ onContactSelect }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Contact[]>([]);
  const authToken = localStorage.getItem('token');

  useEffect(() => {
    const fetchContactsWithChats = async () => {
      try {
        const response = await axios.get<Contact[]>('http://127.0.0.1:8000/messages/contacts_with_chats/', {
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
      const response = await axios.get<Contact[]>(`http://127.0.0.1:8000/GustUser/?search=${searchTerm}`, {
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

  const handleContactClick = (contact: Contact) => {
    onContactSelect(contact);
    localStorage.setItem('selectedContact', JSON.stringify(contact));
  };

  return (
    <div className="w-full md:w-1/4 bg-base-300 p-4 overflow-y-auto shadow-lg rounded-lg">
      <h2 className="text-lg font-bold mb-4 text-white">Contacts</h2>
      <input
        type="text"
        placeholder="Search users..."
        className="input input-bordered input-primary w-full mb-4"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ul>
        {(searchTerm ? searchResults : contacts).map(contact => (
          <li key={contact.id} className="flex items-center py-2 hover:bg-base-200 cursor-pointer rounded-lg p-2 shadow-md" onClick={() => handleContactClick(contact)}>
            <div className="relative mr-2">
              <img className="w-8 h-8 rounded-full" src={contact.avatar} alt="Avatar" />
              {contact.is_online && <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>}
            </div>
            <span className="text-white">{contact.username}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Main ChatApp Component
const ChatApp: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const authToken = localStorage.getItem('token');
  const senderId = authToken ? JSON.parse(atob(authToken.split('.')[1])).user_id : null;

  const fetchMessages = async (recipientId: number) => {
    try {
      const response = await axios.get<Message[]>(`http://127.0.0.1:8000/messages/user_messages/?recipient_id=${recipientId}&sender_id=${senderId}`, {
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
      const response = await axios.post<Message>(
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

  const handleContactSelect = async (contact: Contact) => {
    setSelectedContact(contact);
    await fetchMessages(contact.id);
    localStorage.setItem('selectedContact', JSON.stringify(contact));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node) && emojiPickerVisible) {
        setEmojiPickerVisible(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [emojiPickerVisible]);

  useEffect(() => {
    const storedContact = JSON.parse(localStorage.getItem('selectedContact') as string);
    if (storedContact) {
      setSelectedContact(storedContact);
      fetchMessages(storedContact.id);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleEmojiClick = (emoji: EmojiClickData) => {
    setNewMessage(prevMessage => prevMessage + emoji.emoji);
  };

  const handleTyping = () => {
    if (!typing) {
      setTyping(true);
      setTimeout(() => setTyping(false), 2000); // Simulating typing indicator for 2 seconds
    }
  };

  return (
    <div className="flex flex-col md:flex-row pt-40 bg-base-100 text-base-content min-h-screen">
      <ContactList onContactSelect={handleContactSelect} />

      {selectedContact ? (
        <div className="w-full md:w-3/4 flex flex-col mt-4 md:mt-0">
          <div className="bg-base-300 rounded-lg shadow-lg overflow-hidden flex-1 relative">
            <div className="bg-primary text-primary-content p-4 flex justify-between items-center shadow-md">
              <p className="font-bold">{selectedContact.username}</p>
              <div className="flex items-center">
                <button onClick={() => setEmojiPickerVisible(!emojiPickerVisible)}>
                  <MdEmojiEmotions />
                </button>
              </div>
            </div>

            <div className="px-4 py-2 overflow-y-auto h-64 md:h-96">
              {messages.length === 0 ? (
                <p className="text-center text-base-content py-4">No messages yet</p>
              ) : (
                messages.map((message, index) => (
                  <div key={index} className={`flex mb-4 ${message.sender === senderId ? 'justify-end' : 'justify-start'}`}>
                    <div className={`bg-${message.sender === senderId ? 'primary' : 'base-200'} text-base-content p-3 rounded-lg max-w-md shadow-md`}>
                      <p className="text-sm">{message.content}</p>
                      <span className="block text-xs text-right mt-1 text-base-content/70">{new Date(message.timestamp).toLocaleTimeString()}</span>
                      {message.sender === senderId && message.read && (
                        <span className="block text-xs text-right mt-1 text-base-content/50">Read</span>
                      )}
                    </div>
                  </div>
                ))
              )}

              <div ref={messagesEndRef} />
              {typing && <div className="text-sm text-gray-500">Typing...</div>}
            </div>

            {emojiPickerVisible && (
              <div ref={emojiPickerRef} className="absolute bottom-16 md:bottom-10 right-0 z-10 bg-base-300 p-4 shadow-lg">
                <EmojiPicker onEmojiClick={handleEmojiClick} />
              </div>
            )}
          </div>

          <div className="bg-base-300 p-4 shadow-lg rounded-lg">
            <div className="flex items-center relative">
              <input
                className="flex-1 min-w-0 input input-bordered input-primary mr-2"
                type="text"
                placeholder="Type your message..."
                value={newMessage}
                onChange={e => {
                  setNewMessage(e.target.value);
                  handleTyping();
                }}
                onKeyPress={e => e.key === 'Enter' && sendMessage()}
              />
              <button
                className="btn btn-primary"
                onClick={sendMessage}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full md:w-3/4 flex items-center justify-center mt-4 md:mt-0">
          <p className="text-center text-base-content py-4">Select a contact to start chatting</p>
        </div>
      )}
    </div>
  );
};

export default ChatApp;
