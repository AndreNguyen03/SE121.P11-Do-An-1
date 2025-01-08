import React, { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import nft1 from '../assets/1.png'
import avatar3 from '../assets/avatar3.jpg'
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import axiosInstance from "../utils/axiosInstance";
import { replaceIpfsWithGateway } from "../utils";
import { useWalletContext } from "../context/WalletContext";
import ApproveBuyModal from "./ApproveBuyModal";
import ItemBuyModal from "./ItemBuyModal";
import { buyNFT } from "../utils/contract";
import { toast } from "react-toastify";

const NFTDetail = () => {

  const { tokenId } = useParams();
  const [nft, setNft] = useState(null);
  const { account, signer } = useWalletContext();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isItemBuyModalOpen, setIsItemBuyModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchNFTByTokenId(tokenId) {
      try {
        const response = await axiosInstance.get(`/nft/${tokenId}`);
        if (response && response.data) {
          setNft(response.data);
        } else {
          console.log('No data found for this tokenId');
        }
      } catch (error) {
        console.log(`Error: ${error}`);
      }
    }

    fetchNFTByTokenId(tokenId);
  }, [tokenId]);

  const handleBuyClick = async () => {
    if (!nft || !nft.isListed || !nft.price) {
      return;
    }

    setIsProcessing(true);
    setIsApproveModalOpen(true);

    try {
      // Gọi hàm buyNFT từ contract.js
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
  if (!nft) {
    return (
      <Layout>
        <FaSpinner className="animate-spin absolute inset-0 m-auto h-32 w-32 text-white" />
      </Layout>
    );
  }



  // Dữ liệu mẫu
  const nftData = {
    id: "1",
    name: "Squish Souls #2",
    description: "A rare NFT from the Squish Souls collection.",
    image: nft1,
    price: "0.05",
    blockchain: "Ethereum",
    tokenId: "1234",
    contractAddress: "0x123456789abcdef12p481u08f9n125812",
    owner: {
      name: "John Doe",
      address: "0xabcdef1234567890nv9213894ungfoj1",
      profileImage: avatar3,
    },
    traits: [
      { trait_type: "Background", value: "Blue" },
      { trait_type: "Clothes", value: "Hoodie" },
      { trait_type: "Eyes", value: "Laser Eyes" },
      { trait_type: "Mouth", value: "Smile" },
      { trait_type: "Hat", value: "Beanie" },
    ],
    history: [
      {
        event: "Buy",
        price: "10",
        timestamp: "2024-01-01",
      },
      {
        event: "Sell",
        price: "12.5",
        timestamp: "2024-02-01",
      },
    ],
  };

  const handleListClick = () => {
    navigate('/listing', { state: { nft } });
  };

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Phần hình ảnh/video NFT */}
          <div className="rounded-lg overflow-hidden shadow-lg">
            <img src={replaceIpfsWithGateway(nft.metadata.image)} alt={nft.metadata.name} className="w-full object-cover" />
          </div>

          {/* Phần thông tin chi tiết */}
          <div className="bg-white p-6 rounded-lg shadow-lg space-y-6">
            <h1 className="text-3xl font-bold">{nft.metadata.name}</h1>
            <p className="text-gray-700">{nft.metadata.description}</p>

            {/* Giá NFT */}
            <div className="text-2xl text-indigo-600 font-semibold">
              {nft.price && `Price: ${nft.price} ETH`}
            </div>

            {/* Thông tin chủ sở hữu */}
            <div className="flex items-center space-x-4">
              <img
                src={nftData.owner.profileImage}
                alt={nftData.owner.name}
                className="w-16 h-16 rounded-full border object-cover"
              />
              <div>
                <p className="text-sm text-gray-500">Current owner:</p>
                <p className="text-lg font-semibold text-gray-800">{nftData.owner.name}</p>
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
                    <button onClick={handleListClick} className="bg-indigo-600 text-white px-6 py-3 rounded hover:bg-indigo-500 transition">
                      List NFT
                    </button>
                  )}
                </div>
              ) : nft.isListed && nft.price ? (
                <button disabled={isProcessing} onClick={handleBuyClick} className="bg-indigo-600 text-white px-6 py-3 rounded hover:bg-indigo-500 transition w-1/2">
                  {isProcessing ? (
                    <FaSpinner className="animate-spin h-6 w-6 text-white mx-auto" />
                  ) : (
                    'Buy now'
                  )}
                </button>
              ) : (
                <button disabled className="bg-gray-300 font-bold text-gray-500 px-6 py-3 rounded w-1/2">
                  NFT not listed for sale yet
                </button>
              )}
            </div>

            {/* Thông tin kỹ thuật */}
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

        {/* Lịch sử giao dịch */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">History</h2>
          <div className="space-y-4">
            {nftData.history.map((item, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 shadow-sm bg-gray-50"
              >
                <p className="text-sm text-gray-700">
                  <strong>{item.event}</strong>: {item.price} SepETH - {item.timestamp}
                </p>
              </div>
            ))}
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
