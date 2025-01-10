import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useWalletContext } from '../../context/WalletContext';
import { replaceIpfsWithGateway } from '../../utils/index';
import { buyNFT, cancelListing } from '../../utils/contract'; // Import cancelListing function
import ItemBuyModal from '../../pages/ItemBuyModal';
import ApproveBuyModal from '../../pages/ApproveBuyModal';
import { toast } from 'react-toastify';

const NFTCard = ({ nft, isFavoritedTab = false, onUpdate }) => {
  const { account, signer } = useWalletContext(); // Get signer from context
  const navigate = useNavigate();
  const location = useLocation();
  const [isCancelModalOpen, setCancelModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isExplorePage = location.pathname.includes('Explore');
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);

  console.log(`issFavoriteTab ::: `, isFavoritedTab)

  if (!nft || !nft.metadata) {
    return null;
  }

  const handleCardClick = () => {
    navigate(`/nftdetail/${nft.tokenId}`);
  };

  const handleListClick = () => {
    navigate('/listing', { state: { nft } });
  };

  const handleCancelClick = () => {
    setCancelModalOpen(true); // Open confirmation modal
  };

  const handleCancelConfirm = async () => {
    try {
      setIsLoading(true); // Start loading
      console.log(`Canceling listing for Token ID: ${nft.tokenId}`);

      // Call cancelListing function
      const receipt = await cancelListing(nft.tokenId, signer);

      if (receipt) {

        nft.isListed = false; // Update NFT to be no longer listed

        // Call the parent function to update the state (or list)
        if (onUpdate) {
          onUpdate(nft.tokenId, nft); // Pass the updated NFT
        }

      }
    } catch (err) {
      console.error("Failed to cancel listing:", err);
      if (err.info.error.code === 4001) {
        toast.info("User rejected transaction! .");
      }

    } finally {
      setIsLoading(false); // Stop loading
      setCancelModalOpen(false); // Close modal
    }
  };

  const handleCancelClose = () => {
    setCancelModalOpen(false); // Close confirmation modal
  };

  const handleBuy = async () => {
    try {
      console.log(`Listed :::`, nft.isListed);
      setIsLoading(true); // Bắt đầu quá trình xử lý

      console.log(`Purchasing NFT with Token ID: ${nft.tokenId}`);
      setIsApproveModalOpen(true);

      // Gọi hàm buyNFT để mua NFT
      const receipt = await buyNFT(nft.tokenId, nft.price, signer);

      if (receipt) {
        nft.isListed = false;
        setIsLoading(false);
        setIsApproveModalOpen(false);
        setIsBuyModalOpen(true);
      }
    } catch (err) {
      console.error("Failed to purchase NFT:", err);
      setIsApproveModalOpen(false);
      if (err.info.error.code === 4001) {
        toast.info("User rejected transaction! .");
      }
    } finally {
      setIsLoading(false); // Dừng quá trình xử lý
    }
  };

  return (
    <div className="relative border p-4 rounded-lg shadow-lg hover:shadow-xl bg-white">
      {/* NFT Image */}
      <img
        src={replaceIpfsWithGateway(nft.metadata.image)}
        alt={nft.metadata.name}
        className="w-full h-50 object-cover rounded-lg mb-4 cursor-pointer"
        onClick={handleCardClick}
      />

      {/* NFT Details */}
      <h3
        className="text-lg font-bold mb-2 cursor-pointer"
        onClick={handleCardClick}
      >
        {nft.metadata.name}
      </h3>
      <div className="text-gray-600">
        {nft.isListed && <span className="font-semibold">{nft.price} ETH</span>}
      </div>

      {/* Action Buttons */}
      {!isFavoritedTab && (account && nft.ownerAddress !== account.toLowerCase() ? (
        nft.isListed ? (
          <button
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700"
            onClick={handleBuy}
          >
            Buy
          </button>
        ) : null
      ) : nft.isListed && !isExplorePage ? (
        <button
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700"
          onClick={handleCancelClick}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Cancel Listing"}
        </button>
      ) : (!isExplorePage &&
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
          onClick={handleListClick}
        >
          List
        </button>
      ))}

      {/* Confirmation Modal */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Cancel Confirmation</h2>
            <p className="mb-6">
              Are you sure you want to cancel the listing for <strong>{nft.metadata.name}</strong>?
            </p>
            <div className="flex justify-end">
              <button
                className="mr-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-700"
                onClick={handleCancelClose}
                disabled={isLoading}
              >
                Close
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700"
                onClick={handleCancelConfirm}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
      <ApproveBuyModal
        isOpen={isApproveModalOpen}
        onClose={() => setIsApproveModalOpen(false)}
        item={nft}
        isProcessing={isLoading}
      />

      <ItemBuyModal
        isOpen={isBuyModalOpen}
        onClose={() => setIsBuyModalOpen(false)}
        item={nft}
      />

    </div>
  );
};

export default NFTCard;
