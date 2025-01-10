import React, { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import { useNavigate, useParams } from "react-router-dom";
import { FaHeart, FaRegHeart, FaSpinner } from "react-icons/fa";
import axiosInstance from "../utils/axiosInstance";
import { replaceIpfsWithGateway } from "../utils";
import { useWalletContext } from "../context/WalletContext";
import ApproveBuyModal from "./ApproveBuyModal";
import ItemBuyModal from "./ItemBuyModal";
import { buyNFT } from "../utils/contract";
import { toast } from "react-toastify";
import { debounce } from "lodash";


const NFTDetail = () => {
  const { tokenId } = useParams();
  const [nft, setNft] = useState(null);
  const [ownerInfo, setOwnerInfo] = useState(null); // Thông tin chủ sở hữu NFT
  const { account, signer, getUserInfoByWalletAddress,user, setUser } = useWalletContext();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isItemBuyModalOpen, setIsItemBuyModalOpen] = useState(false);
  const [favorites, setFavorites] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchNFTData(tokenId) {
      try {
        const response = await axiosInstance.get(`/nft/${tokenId}`);
        if (response && response.data) {
          const nftData = response.data;
          setNft(nftData);
          setFavorites(nftData.favoritesCount || 0);

          // Fetch user info of NFT owner
          const ownerData = await getUserInfoByWalletAddress(nftData.ownerAddress);
          setOwnerInfo(ownerData?.user);
          console.log(`TOkenid favorite list: ::`,user.favorites, tokenId)
          console.log(`is favorite :::`, user.favorites?.includes(Number(tokenId)), user);
          setIsFavorited(user.favorites?.includes(Number(tokenId)) || false);
        } else {
          console.log("No data found for this tokenId");
        }
      } catch (error) {
        console.log(`Error: ${error}`);
      }
    }

    fetchNFTData(tokenId);
  }, [tokenId, getUserInfoByWalletAddress]);

  const handleBuyClick = async () => {
    if (!nft || !nft.isListed || !nft.price) {
      return;
    }

    setIsProcessing(true);
    setIsApproveModalOpen(true);

    try {
      const receipt = await buyNFT(nft.tokenId, nft.price, signer);

      if (receipt) {
        setIsApproveModalOpen(false);
        setIsItemBuyModalOpen(true);
      } else {
        alert("Unable to complete the purchase. Please try again.");
      }
    } catch (error) {
      console.log("Error during purchase:", error);
      setIsApproveModalOpen(false);
      if (error.info.error.code === 4001) {
        toast.info("User rejected transaction! .");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleFavorite = async () => {
    // Optimistic UI update
    setIsFavorited((prev) => !prev);
    setFavorites((prev) => (isFavorited ? prev - 1 : prev + 1));
  
    try {
      const endpoint = isFavorited
        ? `/users/remove-favorite`
        : `/users/add-favorite`;
  
      // Perform the API call in the background
      await axiosInstance.post(endpoint, {
        userAddress: account,
        tokenId: tokenId,
      });

      const updatedUser = await getUserInfoByWalletAddress(account);

    // Update user in WalletContext
    if (updatedUser) {
      setUser(updatedUser.user); // This updates the user globally in your WalletContext
    }
    } catch (error) {
      // Revert UI changes if the API fails
      setIsFavorited((prev) => !prev);
      setFavorites((prev) => (isFavorited ? prev + 1 : prev - 1));
      toast.error("Failed to update favorite status. Please try again.");
      console.error("Error toggling favorite:", error);
    }
  };

  const handleFavoriteDebounced = debounce(toggleFavorite, 300);

  if (!nft) {
    return (
      <Layout>
        <FaSpinner className="animate-spin absolute inset-0 m-auto h-32 w-32 text-white" />
      </Layout>
    );
  }

  const handleListClick = () => {
    navigate("/listing", { state: { nft } });
  };

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* NFT Image/Video */}
          <div className="relative rounded-lg overflow-hidden shadow-lg">
            <img
              src={replaceIpfsWithGateway(nft.metadata.image)}
              alt={nft.metadata.name}
              className="w-full object-cover"
            />
            
            <div
              className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-lg cursor-pointer"
              onClick={handleFavoriteDebounced}
            >
              {isFavorited ? (
                <FaHeart className="text-red-500 text-xl font-bold" />
              ) : (
                <FaRegHeart className="font-bold text-xl" />
              )}
            </div>

          </div>



          {/* NFT Details */}
          <div className="bg-white p-6 rounded-lg shadow-lg space-y-6">
            <h1 className="text-3xl font-bold inline-block">{nft.metadata.name}</h1>
            <p className="ml-3 text-md text-gray-700  inline-block italic">{favorites} Favorites</p>
            <p className="text-gray-700">{nft.metadata.description}</p>

            <div className="text-2xl text-indigo-600 font-semibold">
              {nft.price && `Price: ${nft.price} ETH`}
            </div>

            {/* Owner Info */}
            <div className="flex items-center space-x-4">
              <img
                src={ownerInfo?.image || "/default-avatar.png"}
                alt={ownerInfo?.name || "Unknown"}
                className="w-16 h-16 rounded-full border object-cover"
              />
              <div>
                <p className="text-sm text-gray-500">Current owner:</p>
                <p className="text-lg font-semibold text-gray-800">
                  {ownerInfo?.name || "Anonymous"}
                </p>
                <p className="text-sm text-gray-600">{nft.ownerAddress}</p>
              </div>
            </div>


            {/* Các nút hành động */}
            <div className="flex space-x-4">
              {account && account.toLowerCase() === nft.ownerAddress.toLowerCase() ? (
                <div className="flex space-x-4">
                  <div className="text-green-600 font-semibold px-6 py-3 bg-green-300">
                    You are the owner of this NFT
                  </div>
                  {!nft.isListed && (
                    <button
                      onClick={handleListClick}
                      className="bg-indigo-600 text-white px-6 py-3 rounded hover:bg-indigo-500 transition"
                    >
                      List NFT
                    </button>
                  )}
                </div>
              ) : nft.isListed && nft.price ? (
                <button
                  disabled={isProcessing}
                  onClick={handleBuyClick}
                  className="bg-indigo-600 text-white px-6 py-3 rounded hover:bg-indigo-500 transition w-1/2"
                >
                  {isProcessing ? (
                    <FaSpinner className="animate-spin h-6 w-6 text-white mx-auto" />
                  ) : (
                    "Buy now"
                  )}
                </button>
              ) : (
                <button
                  disabled
                  className="bg-gray-300 font-bold text-gray-500 px-6 py-3 rounded w-1/2"
                >
                  NFT not listed for sale yet
                </button>
              )}
            </div>

            {/* Technical Info */}
            <div className="text-sm text-gray-600 space-y-1">
              <p>Blockchain: Sepolia</p>
              <p>Token ID: {nft.tokenId}</p>
            </div>
          </div>
        </div>
        {/* Traits của NFT */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Traits</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {nft.metadata.attributes.map((trait, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 shadow-sm bg-gray-50 text-center"
              >
                <p className="text-sm text-gray-500">{trait.trait_type}</p>
                <p className="font-semibold text-gray-800">{trait.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Traits của NFT */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Traits</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {nft.metadata.attributes.map((trait, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 shadow-sm bg-gray-50 text-center"
              >
                <p className="text-sm text-gray-500">{trait.trait_type}</p>
                <p className="font-semibold text-gray-800">{trait.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Lịch sử giao dịch */}

        {/* NFT History */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">History</h2>
          <div className="space-y-4">
            <div className="border rounded-lg p-4 shadow-sm bg-gray-50">
              <p className="text-sm text-gray-700">
                <strong>Created:</strong> {new Date(nft.created).toLocaleString()}
              </p>
            </div>
            {nft.listedAt && (
              <div className="border rounded-lg p-4 shadow-sm bg-gray-50">
                <p className="text-sm text-gray-700">
                  <strong>Listed:</strong> {new Date(nft.listedAt).toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <ApproveBuyModal
        isOpen={isApproveModalOpen}
        onClose={() => setIsApproveModalOpen(false)}
        item={nft}
        isProcessing={isProcessing}
      />
      <ItemBuyModal
        isOpen={isItemBuyModalOpen}
        onClose={() => setIsItemBuyModalOpen(false)}
        item={nft}
      />
    </Layout>
  );
};

export default NFTDetail;
