import React from 'react';

const PasswordResetDone: React.FC = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-black">Password Reset</h2>
      <p className='text-black'>A password reset link has been sent to your email.</p>
    </div>
  </div>
);

export default PasswordResetDone;
