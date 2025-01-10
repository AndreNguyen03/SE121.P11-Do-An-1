import React, { useEffect, useMemo, useState } from 'react';
import Layout from '../components/layout/Layout';
import NFTCard from '../components/reuse-component/NFTCard';
import UserCard from '../components/reuse-component/UserCard';
import axiosInstance from '../utils/axiosInstance';

function Explore() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('NFTs'); // Toggle between NFTs and Users
  const [priceRange, setPriceRange] = useState([0, 1000]); // Min and max price
  const [selectedTraits, setSelectedTraits] = useState({});
  const [priceSort, setPriceSort] = useState(''); // 'asc' or 'desc'
  const [expandedCategories, setExpandedCategories] = useState({}); // Independent toggle state for each category
  const [allNFTs, setAllNFTs] = useState([])
  const [traitOptions, setTraitOptions] = useState({})
  const [allUsers, setAllUsers] = useState([])

  useEffect(() => {

    async function fetchAllNFT() {
      try {
        const response = await axiosInstance.get(`/nft`);
        if(response && response.data){
          setAllNFTs(response.data);
          generateTraitOptions(response.data);
        }
      } catch (error) {
        console.log(`error explore`, error);
      }
    }

    fetchAllNFT();
  },[])

  useEffect(() => {
    async function fetchAllData() {
      try {
        const users = await fetchAllUsers(); // Fetch danh sách user
        setAllUsers(users); // Lưu vào state
        await fetchUserDataWithNFTs(users); // Truyền users vào hàm tính toán itemsOwned
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchAllData();
  }, []);



  async function fetchAllUsers() {
    try {
      const response = await axiosInstance.get(`/users/`);
      console.log("API response:", response.data); // Kiểm tra dữ liệu trả về

      if (Array.isArray(response.data)) {
        const normalizedUsers = response.data.map((user) => ({
          userId: user._id,
          name: user.name || 'Unknown User',
          walletAddress: user.walletAddress || 'Unknown Address',
          image: user.image || 'https://via.placeholder.com/150',
          createdAt : user.createdAt,
          bio: user.bio || 'No bio provided.',
          itemsOwned: 0,
        }));
        return normalizedUsers; // Trả về danh sách user
      } else if (response.data.users && Array.isArray(response.data.users)) {
        const normalizedUsers = response.data.users.map((user) => ({
          userId: user._id,
          name: user.name || 'Unknown User',
          walletAddress: user.walletAddress || 'Unknown Address',
          image: user.image || 'https://via.placeholder.com/150',
          createdAt : user.createdAt,
          bio: user.bio || 'No bio provided.',
          itemsOwned: 0,
        }));
        return normalizedUsers; // Trả về danh sách user
      } else {
        console.error("Unexpected data format:", response.data);
        return [];
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  }


  const generateTraitOptions = (nfts) => {
    const traitMap = {};

    nfts.forEach((nft) => {
      nft.metadata.attributes.forEach((attribute) => {
        const { trait_type, value } = attribute;
        if (!traitMap[trait_type]) {
          traitMap[trait_type] = new Set();
        }
        traitMap[trait_type].add(value);
      });
    });


   // Convert Set to Array for each trait type
   const traitOptions = {};
   Object.entries(traitMap).forEach(([key, values]) => {
     traitOptions[key] = Array.from(values);
   });

   setTraitOptions(traitOptions);
 };

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

 const filteredNFTs = allNFTs
   .filter((nft) => {
     const matchesSearch = nft.metadata.name.toLowerCase().includes(searchTerm.toLowerCase());
     const matchesPrice =
       nft.price &&
       parseFloat(nft.price) >= priceRange[0] &&
       parseFloat(nft.price) <= priceRange[1];

     const matchesTraits = Object.entries(selectedTraits).every(
       ([category, selectedValues]) =>
         selectedValues.length === 0 ||
         selectedValues.includes(
           nft.metadata.attributes.find((attr) => attr.trait_type === category)?.value
         )
     );

     return matchesSearch && matchesPrice && matchesTraits;
   })
   .sort((a, b) => {
     if (priceSort === 'asc') return a.price - b.price;
     if (priceSort === 'desc') return b.price - a.price;
     return 0;
   });

 const getItemsOwned = async (walletAddress) => {
  try {
    const response = await axiosInstance.get(`/nft/user-nfts/${walletAddress}`);
    if (response && response.data && Array.isArray(response.data)) {
      return response.data.length;
    }
    return 0;
  } catch (error) {
    console.error(`Error fetching NFTs for user ${walletAddress}:`, error);
    return 0;
  }
};

const fetchUserDataWithNFTs = async (users) => {
  try {
    const updatedUsers = await Promise.all(
      users.map(async (user) => {
        const itemsOwned = await getItemsOwned(user.walletAddress);
        return {
          ...user,
          itemsOwned,
        };
      })
    );
    setAllUsers(updatedUsers); // Cập nhật danh sách user đã có itemsOwned
  } catch (error) {
    console.error("Error fetching user data with NFTs:", error);
  }
};

useEffect(() => {
  async function fetchUsersAndItemsOwned() {
    try {
      const users = await fetchAllUsers();
      setAllUsers(users);

      // Chờ state cập nhật hoàn tất trước khi tiếp tục
      await fetchUserDataWithNFTs(users);
    } catch (error) {
      console.error("Error fetching users or NFTs:", error);
    }
  }

  fetchUsersAndItemsOwned();
}, []);




const filteredUsers = useMemo(() => {
  return allUsers.filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesUsername = user.name?.toLowerCase().includes(searchLower);
    const matchesWallet = user.walletAddress?.toLowerCase().includes(searchLower);
    return matchesUsername || matchesWallet;
  });
}, [allUsers, searchTerm]);


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

              {/* Dynamic Trait Filters */}
              <h2 className="text-lg font-bold mb-4">Traits</h2>
              {Object.entries(traitOptions).map(([category, options]) => (
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
                    <NFTCard key={nft.tokenId} nft={nft} />
                  ))
                ) : (
                  <p className="text-gray-500">No NFTs found.</p>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <UserCard
                      key={user.userId}
                      user={{
                        username: user.name,
                        avatar: user.image,
                        bio: user.bio,
                        walletAddress: user.walletAddress,
                        itemsOwned: user.itemsOwned,
                        createdAt: user.createdAt
                      }}
                    />
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
