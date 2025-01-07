import React from 'react';

function ItemListedModal({ isOpen, onClose, item }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white w-96 p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">Your item has been listed!</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        <div className="flex flex-col items-center mb-4">
          <img
            src={item.image || 'https://via.placeholder.com/100'} // Placeholder image
            alt="Item Preview"
            className="w-48 h-48 rounded-lg mb-4"
          />
          <p className="text-gray-800 font-medium text-center">
            <strong>{item.name || 'Unnamed Item'}</strong> from the <strong>{item.collection || 'Unknown Collection'}</strong> collection has been listed for sale.
          </p>
        </div>
        
        <button
          className="w-full bg-cyan-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          onClick={() => window.location.href = item.link || '#'}
        >
          View listing
        </button>
      </div>
    </div>
  );
}

export default ItemListedModal;
