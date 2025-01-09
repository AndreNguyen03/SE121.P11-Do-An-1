import React from 'react';
import { replaceIpfsWithGateway } from '../utils/index.js';
import { useNavigate } from 'react-router-dom';

function MintSuccessModal({ isOpen, onClose, mintedNFTs }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleViewProfile = () => {
    onClose();
    navigate('/profile'); // Điều hướng đến trang hồ sơ
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Mint Successful!</h2>
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
        <div className="flex flex-col items-center">
          <p className="text-gray-700 font-medium text-center mb-4">
            You have successfully minted your NFTs. Check them below:
          </p>
          <div className="flex gap-4">
            {mintedNFTs.map((nft) => (
              <div key={nft.tokenId} className="text-center flex flex-col justify-center items-center">
                <img
                  src={replaceIpfsWithGateway(nft.image)}
                  alt={`NFT ${nft.tokenId}`}
                  className="w-40 h-40 rounded-lg mb-2"
                />
                <p className="text-gray-800 text-sm font-medium">Squishy Souls #{Number(nft.tokenId) +1}</p>
              </div>
            ))}
          </div>
        </div>
        <button
          className="mt-6 w-full bg-cyan-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          onClick={handleViewProfile}
        >
          View NFTs in Profile
        </button>
      </div>
    </div>
  );
}

export default MintSuccessModal;
