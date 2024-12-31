import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import NFTCard from '../components/reuse-component/NFTCard';
import UserCard from '../components/reuse-component/UserCard';

// Fake data for NFTs
const fakeNFTs = [
  {
    tokenId: 1,
    name: 'Ethereal Visions',
    price: 200,
    discountedPrice: 150,
    image: 'https://via.placeholder.com/300x300.png?text=Ethereal+Visions',
    trending: true,
    stock: true,
  },
  {
    tokenId: 2,
    name: 'Celestial Patterns',
    price: 120,
    image: 'https://via.placeholder.com/300x300.png?text=Celestial+Patterns',
    trending: false,
    stock: true,
  },
  {
    tokenId: 3,
    name: 'Galactic Harmony',
    price: 300,
    image: 'https://via.placeholder.com/300x300.png?text=Galactic+Harmony',
    trending: true,
    stock: true,
  },
  {
    tokenId: 4,
    name: 'Digital Dreams',
    price: 180,
    image: 'https://via.placeholder.com/300x300.png?text=Digital+Dreams',
    trending: false,
    stock: false,
  },
  {
    tokenId: 5,
    name: 'Futuristic Art',
    price: 250,
    discountedPrice: 200,
    image: 'https://via.placeholder.com/300x300.png?text=Futuristic+Art',
    trending: true,
    stock: true,
  },
];

// Fake data for Users
const fakeUsers = [
  {
    userId: 1,
    username: 'CryptoCollector',
    avatar: 'https://via.placeholder.com/300x300.png?text=User+Avatar+1',
    bio: 'Passionate NFT collector and artist.',
    itemsOwned: 42,
    isFollowed: false,
  },
  {
    userId: 2,
    username: 'ArtisticSoul',
    avatar: 'https://via.placeholder.com/300x300.png?text=User+Avatar+2',
    bio: 'Digital art enthusiast exploring the metaverse.',
    itemsOwned: 27,
    isFollowed: false,
  },
  {
    userId: 3,
    username: 'MetaTrader',
    avatar: 'https://via.placeholder.com/300x300.png?text=User+Avatar+3',
    bio: 'Investing in the future of digital assets.',
    itemsOwned: 15,
    isFollowed: false,
  },
  {
    userId: 4,
    username: 'PixelMaster',
    avatar: 'https://via.placeholder.com/300x300.png?text=User+Avatar+4',
    bio: 'Pixel art creator and collector.',
    itemsOwned: 33,
    isFollowed: false,
  },
  {
    userId: 5,
    username: 'Dreamer',
    avatar: 'https://via.placeholder.com/300x300.png?text=User+Avatar+5',
    bio: 'Turning dreams into NFTs.',
    itemsOwned: 18,
    isFollowed: false,
  },
];

function Explore() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('NFTs'); // Toggle between NFTs and Users
  const [priceFilter, setPriceFilter] = useState([0, 1000]); // Min and max price
  const [showTrending, setShowTrending] = useState(false);

  // Filter NFTs based on search term, price, and trending
  const filteredNFTs = fakeNFTs.filter((nft) => {
    const matchesSearch = nft.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice = nft.price >= priceFilter[0] && nft.price <= priceFilter[1];
    const matchesTrending = showTrending ? nft.trending : true;
    return matchesSearch && matchesPrice && matchesTrending;
  });

  // Filter Users based on search term
  const filteredUsers = fakeUsers.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="p-6">
        {/* Tabs for toggling */}
        <div className="flex justify-between items-center border-b mb-6">
          <div className="flex space-x-6">
            <button
              className={`pb-2 text-lg font-semibold ${
                activeTab === 'NFTs' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('NFTs')}
            >
              Explore NFTs
            </button>
            <button
              className={`pb-2 text-lg font-semibold ${
                activeTab === 'Users' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('Users')}
            >
              Explore Users
            </button>
          </div>
          {/* Search Input */}
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-3 w-1/3 rounded-lg shadow-sm focus:ring focus:outline-none"
          />
        </div>

        {/* Filters for NFTs */}
        {activeTab === 'NFTs' && (
          <div className="mb-6">
            <div className="flex justify-between items-center">
              {/* Price Filter */}
              <div className="flex items-center space-x-3">
                <span className="text-sm">Price:</span>
                <input
                  type="number"
                  placeholder="Min"
                  value={priceFilter[0]}
                  onChange={(e) => setPriceFilter([Number(e.target.value), priceFilter[1]])}
                  className="border rounded-lg p-2 w-20"
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceFilter[1]}
                  onChange={(e) => setPriceFilter([priceFilter[0], Number(e.target.value)])}
                  className="border rounded-lg p-2 w-20"
                />
              </div>
              {/* Trending Filter */}
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showTrending}
                  onChange={() => setShowTrending(!showTrending)}
                />
                <span>Show Trending</span>
              </label>
            </div>
          </div>
        )}

        {/* Content based on activeTab */}
        {activeTab === 'NFTs' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNFTs.length > 0 ? (
              filteredNFTs.map((nft) => (
                <NFTCard
                  key={nft.tokenId}
                  nft={nft}
                  onBuy={() => alert(`You bought ${nft.name}!`)}
                />
              ))
            ) : (
              <p className="text-gray-500">No NFTs found.</p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <UserCard key={user.userId} user={user} />
              ))
            ) : (
              <p className="text-gray-500">No users found.</p>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Explore;
