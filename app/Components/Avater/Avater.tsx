import React from 'react';
import Image from 'next/image';

const Avatar = ({ profilePhoto, name, onClick }) => {
  return (
    <div className="avatar" onClick={onClick}>
      <div className="w-12 h-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-1 overflow-hidden cursor-pointer">
        <Image 
          src={profilePhoto} 
          alt={name}
          className="w-full h-full rounded-full object-cover" 
          width={48}
          height={48}
        />
      </div>
    </div>
  );
};

export default Avatar;
