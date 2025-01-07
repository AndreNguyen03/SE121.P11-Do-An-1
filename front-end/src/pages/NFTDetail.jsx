import React from "react";
import Layout from "../components/layout/Layout";
import nft1 from '../assets/1.png'
import avatar3 from '../assets/avatar3.jpg'

const NFTDetail = () => {
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

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Phần hình ảnh/video NFT */}
          <div className="rounded-lg overflow-hidden shadow-lg">
            <img src={nftData.image} alt={nftData.name} className="w-full object-cover" />
          </div>

          {/* Phần thông tin chi tiết */}
          <div className="bg-white p-6 rounded-lg shadow-lg space-y-6">
            <h1 className="text-3xl font-bold">{nftData.name}</h1>
            <p className="text-gray-700">{nftData.description}</p>

            {/* Giá NFT */}
            <div className="text-2xl text-indigo-600 font-semibold">
              Price: {nftData.price} SepETH
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
                <p className="text-sm text-gray-600">{nftData.owner.address}</p>
              </div>
            </div>

            {/* Các nút hành động */}
            <div className="flex space-x-4">
              <button className="bg-indigo-600 text-white px-6 py-3 rounded hover:bg-indigo-500 transition w-1/2">
                Buy now
              </button>
            </div>

            {/* Thông tin kỹ thuật */}
            <div className="text-sm text-gray-600 space-y-1">
              <p>Blockchain: {nftData.blockchain}</p>
              <p>Token ID: {nftData.tokenId}</p>
              <p>Transaction: {nftData.contractAddress}</p>
            </div>
          </div>
        </div>

        {/* Traits của NFT */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Traits</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {nftData.traits.map((trait, index) => (
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
    </Layout>
  );
};

export default NFTDetail;
