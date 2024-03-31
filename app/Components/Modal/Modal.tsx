'use client'; // Place "use client" directive at the top of the file

import React, { useState } from 'react';

export default function Modal() {
  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      <button onClick={openModal} className="bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded">
        Open Modal
      </button>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-gray-900 opacity-75" onClick={closeModal}></div>
          <div className="bg-black p-12 rounded shadow-lg z-50"> {/* Increased padding here */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Modal Title</h2> {/* Increased font size here */}
              <button onClick={closeModal}>&times;</button>
            </div>
            <p className="py-6 text-lg">Modal content goes here...</p> {/* Increased font size here */}
            <button onClick={closeModal} className="bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded">
              Close Modal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// 'use client'; // Place "use client" directive at the top of the file

// import React, { useState } from 'react';

// export default function Modal() {
//   const [showModal, setShowModal] = useState(false);

//   const openModal = () => {
//     setShowModal(true);
//   };

//   const closeModal = () => {
//     setShowModal(false);
//   };

// import React from 'react'

// export default function Modal() {
//   return (
//     <div><dialog id="my_modal_1" className="modal">
//     <div className="modal-box">
//       <h3 className="font-bold text-lg">Hello!</h3>
//       <p className="py-4">Press ESC key or click the button below to close</p>
//       <div className="modal-action">
//         <form method="dialog">
//           {/* if there is a button in form, it will close the modal */}
//           <button onClick={closeModal} className="btn">Close</button>
//         </form>
//       </div>
//     </div>
//   </dialog></div>
//   )
// }
