import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import NFTCard from '../components/reuse-component/NFTCard';

const Profile = () => {
  const fakeUser = {
    name: 'Unnamed',
    image: null,
    wallet: '0x2Db2...0B43',
    joined: 'December 2024',
  };

  const tabs = ['Collected', 'Offers made', 'Deals', 'Created', 'Favorited', 'Activity'];

  // Fake Data
  const initialNFTs = [
    { tokenId: 1, name: 'NFT 1', isListed: true, price: 0.1 },
    { tokenId: 2, name: 'NFT 2', isListed: false },
    { tokenId: 3, name: 'NFT 3', isListed: true, price: 0.3 },
    { tokenId: 4, name: 'NFT 4', isListed: false },
  ];
  const createdNFTs = [
    {
      tokenId: 1,
      name: 'My First NFT',
      image: 'https://via.placeholder.com/300x300.png?text=My+First+NFT',
      price: 0.5,
    },
    {
      tokenId: 2,
      name: 'Artistic Piece',
      image: 'https://via.placeholder.com/300x300.png?text=Artistic+Piece',
      price: 1,
    },
  ];
  const favoritedNFTs = [
    {
      tokenId: 3,
      name: 'Rare Collectible',
      image: 'https://via.placeholder.com/300x300.png?text=Rare+Collectible',
    },
    {
      tokenId: 4,
      name: 'Exclusive Item',
      image: 'https://via.placeholder.com/300x300.png?text=Exclusive+Item',
    },
  ];
  const offersMade = [
    { id: 1, name: 'NFT Alpha', priceOffered: 0.15, status: 'Pending' },
    { id: 2, name: 'NFT Beta', priceOffered: 0.25, status: 'Rejected' },
    { id: 3, name: 'NFT Gamma', priceOffered: 0.35, status: 'Accepted' },
  ];
  const deals = [
    { id: 1, name: 'NFT Delta', price: 0.2, date: '2024-12-25' },
    { id: 2, name: 'NFT Epsilon', price: 0.3, date: '2024-12-26' },
  ];
  const activityLog = [
    { id: 1, activity: 'Listed NFT #1 for 0.1 ETH', date: '2024-12-20' },
    { id: 2, activity: 'Made an offer for NFT Gamma', date: '2024-12-21' },
    { id: 3, activity: 'Sold NFT Delta for 0.2 ETH', date: '2024-12-25' },
  ];

  const [activeTab, setActiveTab] = useState('Collected');
  const [collectedTab, setCollectedTab] = useState('Unlisted');
  const [nfts, setNFTs] = useState(initialNFTs);

  const handleListNFT = (tokenId) => {
    // Cập nhật trạng thái NFT thành "Listed"
    setNFTs((prevNFTs) =>
      prevNFTs.map((nft) =>
        nft.tokenId === tokenId ? { ...nft, isListed: true, price: 0.2 } : nft
      )
    );
    alert(`NFT #${tokenId} has been listed successfully!`);
  };

  return (
    <Layout>
      {/* Profile Header */}
      <div className="relative bg-gray-200 h-52">
        <div className="absolute bottom-0 left-8 transform translate-y-1/2">
          <div className="w-32 h-32 bg-gradient-to-r from-green-500 to-green-300 rounded-full border-4 border-white flex items-center justify-center">
            {fakeUser.image ? (
              <img
                src={fakeUser.image}
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-white text-3xl font-bold">U</span>
            )}
          </div>
        </div>
        <button className="absolute bottom-4 right-8 bg-green-500 hover:bg-green-700 text-white p-2 rounded-md flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-5 h-5 mr-1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.232 5.232l3.536 3.536M9 13h3m-3 4h6m4.828-2.828l-3.536-3.536m0 0l-6.364 6.364a2 2 0 11-2.828-2.828l6.364-6.364m0 0L9 13"
            />
          </svg>
          Edit
        </button>
      </div>

      {/* Profile Details */}
      <div className="pt-16 px-8">
        <h2 className="text-2xl font-bold">{fakeUser.name}</h2>
        <p className="text-gray-600">{fakeUser.wallet}</p>
        <p className="text-gray-500 text-sm">Joined {fakeUser.joined}</p>

        {/* Tabs */}
        <div className="mt-8 border-b border-gray-300">
          <nav className="flex space-x-6">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`py-2 px-4 font-medium ${activeTab === tab
                    ? 'border-b-2 border-green-500 text-gray-900'
                    : 'text-gray-500 hover:text-gray-700'
                  }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'Collected' && (
            <div>
              {/* Sub Tabs */}
              <div className="mt-4 flex space-x-6">
                <button
                  className={`py-1 px-3 rounded-lg ${collectedTab === 'Unlisted'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-300 text-gray-700 hover:text-gray-900'
                    }`}
                  onClick={() => setCollectedTab('Unlisted')}
                >
                  Unlisted
                </button>
                <button
                  className={`py-1 px-3 rounded-lg ${collectedTab === 'Listed'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-300 text-gray-700 hover:text-gray-900'
                    }`}
                  onClick={() => setCollectedTab('Listed')}
                >
                  Listed
                </button>
              </div>
              {/* NFTs */}
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {nfts
                  .filter((nft) => (collectedTab === 'Listed' ? nft.isListed : !nft.isListed))
                  .map((nft) => (
                    <NFTCard
                      key={nft.tokenId}
                      nft={{
                        ...nft,
                        image: `https://via.placeholder.com/300x300.png?text=NFT+${nft.tokenId}`,
                      }}
                    >
                      {!nft.isListed && (
                        <button
                          onClick={() => handleListNFT(nft.tokenId)}
                          className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700"
                        >
                          List
                        </button>
                      )}
                    </NFTCard>
                  ))}
              </div>
            </div>
          )}

          {activeTab === 'Offers made' && (
            <div>
              {offersMade.map((offer) => (
                <div
                  key={offer.id}
                  className="p-4 bg-gray-100 border rounded-lg shadow-sm flex justify-between items-center"
                >
                  <div>
                    <p className="text-lg font-bold">{offer.name}</p>
                    <p className="text-gray-500">Offered: {offer.priceOffered} ETH</p>
                  </div>
                  <p className={`font-semibold ${offer.status === 'Accepted' ? 'text-green-500' : offer.status === 'Rejected' ? 'text-red-500' : 'text-yellow-500'}`}>
                    {offer.status}
                  </p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'Deals' && (
            <div>
              {deals.map((deal) => (
                <div
                  key={deal.id}
                  className="p-4 bg-gray-100 border rounded-lg shadow-sm flex justify-between items-center"
                >
                  <p className="text-lg font-bold">{deal.name}</p>
                  <div className="text-right">
                    <p>{deal.price} ETH</p>
                    <p className="text-gray-500 text-sm">{deal.date}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'Activity' && (
            <div>
              {activityLog.map((log) => (
                <div key={log.id} className="p-4 bg-gray-100 border rounded-lg shadow-sm">
                  <p>{log.activity}</p>
                  <p className="text-sm text-gray-500">{log.date}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'Created' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {createdNFTs.map((nft) => (
                <NFTCard key={nft.tokenId} nft={nft} />
              ))}
            </div>
          )}

          {activeTab === 'Favorited' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {favoritedNFTs.map((nft) => (
                <NFTCard key={nft.tokenId} nft={nft} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Profile;