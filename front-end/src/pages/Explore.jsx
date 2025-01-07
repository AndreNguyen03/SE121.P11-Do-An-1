import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import NFTCard from '../components/reuse-component/NFTCard';
import UserCard from '../components/reuse-component/UserCard';
import nft0 from '../assets/0.png'
import nft1 from '../assets/1.png'
import nft2 from '../assets/2.png'
import nft3 from '../assets/3.png'
import nft5 from '../assets/5.png'
import nft6 from '../assets/6.png'
import nft7 from '../assets/7.png'
import nft8 from '../assets/8.png'
import nft10 from '../assets/10.png'
import avatar1 from '../assets/avatar1.jpg'
import avatar2 from '../assets/avatar2.jpg'
import avatar3 from '../assets/avatar3.jpg'


// Fake data for NFTs
const fakeNFTs = [
  {
    tokenId: 1,
    name: 'Squish Souls #1',
    price: 0.02,
    discountedPrice: 0.01,
    image: nft0,
    stock: true,
    traits: {
      Addons: 'None',
      Background: 'Soft Yellow',
      Body: 'Magenta',
      Eyes: 'Circle Eyes',
      Mouth: 'Wavy Mouth',
    },
  },
  {
    tokenId: 2,
    name: 'Squish Souls #2',
    price: 0.05,
    image: nft1,
    stock: true,
    traits: {
      Addons: 'Blush Dots',
      Background: 'Pastel Purple',
      Body: 'Silver',
      Eyes: 'Cross Eyes',
      Mouth: 'Smile Mouth',
    },
  },
  {
    tokenId: 3,
    name: 'Squish Souls #3',
    price: 0.03,
    image: nft2,
    stock: true,
    traits: {
      Addons: 'None',
      Background: 'Silver Gray',
      Body: 'Emerald',
      Eyes: 'Half-Open Eyes',
      Mouth: 'Wavy Mouth',
    },
  },
  {
    tokenId: 4,
    name: 'Squish Souls #4',
    price: 0.018,
    image: nft3,
    stock: false,
    traits: {
      Addons: 'None',
      Background: 'Pastel Purple',
      Body: 'Pastel Peach',
      Eyes: 'Smiley Eyes',
      Mouth: 'Smile Mouth',
    },
  },
  {
    tokenId: 5,
    name: 'Squish Souls #5',
    price: 0.05,
    discountedPrice: 0.03,
    image: nft5,
    stock: true,
    traits: {
      Addons: 'Blush Dots',
      Background: 'Soft Yellow',
      Body: 'Coral',
      Eyes: 'Lined Eyes (Vertical)',
      Mouth: 'Wavy Mouth',
    },
  },
  {
    tokenId: 7,
    name: 'Squish Souls #6',
    price: 0.05,
    discountedPrice: 0.04,
    image: nft6,
    stock: true,
    traits: {
      Addons: 'Blush Dots',
      Background: 'Silver Gray',
      Body: 'Silver',
      Eyes: 'Smiley Eyes',
      Mouth: 'Smile Mouth',
    },
  },
  {
    tokenId: 8,
    name: 'Squish Souls #7',
    price: 0.05,
    discountedPrice: 0.025,
    image: nft7,
    stock: true,
    traits: {
      Addons: 'None',
      Background: 'Pastel Purple',
      Body: 'Magenta',
      Eyes: 'Circle Eyes',
      Mouth: 'Wavy Mouth',
    },
  },
  {
    tokenId: 9,
    name: 'Squish Souls #8',
    price: 0.023,
    discountedPrice: 0.02,
    image: nft8,
    stock: true,
    traits: {
      Addons: 'None',
      Background: 'Soft Yellow',
      Body: 'Coral',
      Eyes: 'Lined Eyes (Vertical)',
      Mouth: 'Smile Mouth',
    },
  },
  {
    tokenId: 10,
    name: 'Squish Souls #9',
    price: 0.05,
    discountedPrice: 0.021,
    image: nft10,
    stock: true,
    traits: {
      Addons: 'Blush Dots',
      Background: 'Silver Gray',
      Body: 'Emerald',
      Eyes: 'Cross Eyes',
      Mouth: 'Wavy Mouth',
    },
  },
];

// Trait categories and options
const traitCategories = {
  Addons: ['None', 'Blush Dots'],
  Background: ['Pastel Purple', 'Silver Gray', 'Soft Yellow'],
  Body: ['Emerald', 'Magenta', 'Coral', 'Pastel Peach', 'Silver'],
  Eyes: [
    'Circle Eyes',
    'Lined Eyes (Vertical)',
    'Cross Eyes',
    'Half-Open Eyes',
    'Smiley Eyes',
  ],
  Mouth: ['Wavy Mouth', 'Smile Mouth'],
};

const fakeUsers = [
  {
    userId: 1,
    username: 'CryptoCollector',
    avatar: avatar1,
    bio: 'Passionate NFT collector and artist.',
    itemsOwned: 42,
    isFollowed: false,
  },
  {
    userId: 2,
    username: 'ArtisticSoul',
    avatar: avatar2,
    bio: 'Digital art enthusiast exploring the metaverse.',
    itemsOwned: 27,
    isFollowed: false,
  },
  {
    userId: 3,
    username: 'John Doe',
    avatar: avatar3,
    bio: 'Just John Doe.',
    itemsOwned: 4,
    isFollowed: false,
  },
];

function Explore() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('NFTs'); // Toggle between NFTs and Users
  const [priceRange, setPriceRange] = useState([0, 1000]); // Min and max price
  const [selectedTraits, setSelectedTraits] = useState({});
  const [priceSort, setPriceSort] = useState(''); // 'asc' or 'desc'
  const [expandedCategories, setExpandedCategories] = useState({}); // Independent toggle state for each category

  const toggleTrait = (category, trait) => {
    setSelectedTraits((prev) => {
      const currentCategory = prev[category] || [];
      if (currentCategory.includes(trait)) {
        return {
          ...prev,
          [category]: currentCategory.filter((t) => t !== trait),
        };
      }
      return {
        ...prev,
        [category]: [...currentCategory, trait],
      };
    });
  };

  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const filteredNFTs = fakeNFTs
    .filter((nft) => {
      const matchesSearch = nft.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPrice = nft.price >= priceRange[0] && nft.price <= priceRange[1];

      const matchesTraits = Object.entries(selectedTraits).every(
        ([category, selectedValues]) =>
          selectedValues.length === 0 || selectedValues.includes(nft.traits[category])
      );

      return matchesSearch && matchesPrice && matchesTraits;
    })
    .sort((a, b) => {
      if (priceSort === 'asc') return a.price - b.price;
      if (priceSort === 'desc') return b.price - a.price;
      return 0;
    });

  const filteredUsers = fakeUsers.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="p-6">
        {/* Tabs and Search Bar */}
        <div className="flex flex-col space-y-4 border-b pb-4 mb-4">
          <div className="flex justify-between items-center">
            <div className="flex space-x-6">
              <button
                className={`pb-2 text-lg font-semibold ${
                  activeTab === 'NFTs' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'
                }`}
                onClick={() => setActiveTab('NFTs')}
              >
                NFTs
              </button>
              <button
                className={`pb-2 text-lg font-semibold ${
                  activeTab === 'Users' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'
                }`}
                onClick={() => setActiveTab('Users')}
              >
                Users
              </button>
            </div>
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border p-3 rounded-lg shadow-sm focus:ring focus:outline-none w-1/3"
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex space-x-4">
          {/* Sidebar Filters */}
          {activeTab === 'NFTs' && (
            <div className="w-1/4 bg-white border rounded-lg p-4 shadow-md">
              <h2 className="text-lg font-bold mb-4">Filters</h2>

              {/* Price Sorting */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold mb-2">Sort by Price</h3>
                <select
                  value={priceSort}
                  onChange={(e) => setPriceSort(e.target.value)}
                  className="border rounded-lg p-2 w-full"
                >
                  <option value="">None</option>
                  <option value="asc">Low to High</option>
                  <option value="desc">High to Low</option>
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold mb-2">Price Range</h3>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange[0]}
                    onChange={(e) =>
                      setPriceRange([Number(e.target.value), priceRange[1]])
                    }
                    className="border rounded-lg p-2 w-full"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], Number(e.target.value)])
                    }
                    className="border rounded-lg p-2 w-full"
                  />
                </div>
              </div>

              {/* Trait Filters */}
              <h2 className="text-lg font-bold mb-4">Traits</h2>
              {Object.entries(traitCategories).map(([category, options]) => (
                <div key={category} className="mb-6">
                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleCategory(category)}
                  >
                    <h3 className="text-sm font-semibold">{category}</h3>
                    <span>{expandedCategories[category] ? '-' : '+'}</span>
                  </div>
                  {expandedCategories[category] && (
                    <div className="mt-2 max-h-32 overflow-y-auto">
                      <div className="flex flex-wrap gap-2">
                        {options.map((option) => (
                          <label
                            key={option}
                            className="flex items-center space-x-2 text-sm cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={
                                selectedTraits[category]?.includes(option) || false
                              }
                              onChange={() => toggleTrait(category, option)}
                            />
                            <span>{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Content */}
          <div className="flex-1">
            {activeTab === 'NFTs' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
        </div>
      </div>
    </Layout>
  );
}

export default Explore;
