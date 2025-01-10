import React, { useEffect } from 'react';
import { replaceIpfsWithGateway } from '../utils';
import { FaSpinner } from 'react-icons/fa';

function ApproveBuyModal({ isOpen, onClose, item, isProcessing }) {
  if (!isOpen) return null;

  useEffect(() => {
    console.log(`item :::`, item);
  }, [])

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-100 p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Approve purchase</h2>
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
        <div className="flex items-center my-8">
          {isProcessing ? (
            <div className="relative">
              <FaSpinner className="animate-spin absolute left-[-20px] inset-0 m-auto h-12 w-12 text-gray-500" />
              <img
                src={replaceIpfsWithGateway(item.metadata.image)}
                alt="Collection"
                className="w-16 h-16 rounded-lg mr-4 opacity-20"
              />
            </div>
          ) : (
            <img
              src={replaceIpfsWithGateway(item.metadata.image)}
              alt="Collection"
              className="w-16 h-16 rounded-lg mr-4"
            />
          )}
          <div>
            <p className="text-gray-800 font-medium">{item.metadata.name || 'Unnamed Item'}</p>
            <p className="text-gray-600 text-sm">{item.collection || 'Squishy Souls'}</p>
            <p className="text-gray-500 text-sm">Chain: {item.chain || 'Sepolia'}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-gray-800 font-bold">{item.price || '0.000'} ETH</p>
          </div>
        </div>

        <hr className='mb-4'></hr>

        <p className="text-sm mb-4 font-bold">
          Go to your wallet
        </p>
        <p className="text-sm">
          You'll be asked to approve this purchase from your wallet.
        </p>
      </div>
    </div>
  );
}

export default ApproveBuyModal;
