import React from 'react';

const Avatar = ({ profilePhoto, name, onClick }) => {
  return (
    <div className="avatar" onClick={onClick}>
      <div className="w-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 cursor-pointer">
        <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
      </div>
    </div>
  );
};

export default Avatar;
