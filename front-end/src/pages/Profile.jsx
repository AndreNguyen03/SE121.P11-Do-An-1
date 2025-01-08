import React, { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import NFTCard from '../components/reuse-component/NFTCard';
import nft1 from '../assets/1.png'
import nft2 from '../assets/2.png'
import nft3 from '../assets/3.png'
import nft5 from '../assets/5.png'
import avatar3 from '../assets/avatar3.jpg'
import { useWalletContext } from '../context/WalletContext';
import axiosInstance from '../utils/axiosInstance';
import user from '../../../back-end/models/user.model';

const Profile = () => {
  const fakeUser = {
    name: 'John Doe',
    image: avatar3,
    wallet: '0x2Db2...0B43',
    joined: 'December 2024',
  };

  const tabs = ['Owned', 'On sale', 'Created', 'Favorited', 'Activity'];


  const favoritedNFTs = [
    {
      tokenId: 3,
      name: 'Rare Collectible',
      image: nft5,
    },
    {
      tokenId: 4,
      name: 'Exclusive Item',
      image: nft3,
    },
  ];
  const activityLog = [
    { id: 1, activity: 'Listed NFT #1 for 0.1 ETH', date: '2024-12-20' },
    { id: 2, activity: 'Made an offer for NFT Gamma', date: '2024-12-21' },
    { id: 3, activity: 'Sold NFT Delta for 0.2 ETH', date: '2024-12-25' },
  ];

  const [activeTab, setActiveTab] = useState('Owned');
  const [nfts, setNFTs] = useState([]);


  const { account, signer } = useWalletContext();

  const ownedList = nfts.filter(nft => nft.ownerAddress === account);
  const onSaleList = nfts.filter(nft => nft.ownerAddress === account && nft.isListed);
  const createdList = nfts.filter(nft => nft.createdBy === account);

  const updateNFTList = (tokenId, updatedNft) => {
    setNFTs((prevNfts) =>
      prevNfts.map((nft) =>
        nft.tokenId === tokenId ? { ...nft, isListed: false } : nft
      )
    );
  };

  useEffect(() => {
    try {
      async function fetchUserNfts() {
        const response = await axiosInstance.get(`/nft/user-nfts/${account}`);
        const userNFTs = response.data;
        console.log(userNFTs);
        setNFTs(userNFTs);
      }
      fetchUserNfts()
    } catch (error) {
      console.log(error);
    }
  }, [account])

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
        <p className="text-gray-600">{account}</p>
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
          {activeTab === 'Owned' && (
            <div>
              {/* NFTs */}
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-6">
                {ownedList
                  .map((nft) => (
                    <NFTCard
                      key={nft.tokenId}
                      nft={nft}
                      onUpdate={updateNFTList}
                    >
                    </NFTCard>
                  ))}
              </div>
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
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-6">
              {createdList.map((nft) => (
                <NFTCard key={nft.tokenId} nft={nft} />
              ))}
            </div>
          )}

          {activeTab === 'On sale' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-6">
              {onSaleList.map((nft) => (
                <NFTCard key={nft.tokenId} nft={nft} />
              ))}
            </div>
          )}

          {activeTab === 'Favorited' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-6">
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