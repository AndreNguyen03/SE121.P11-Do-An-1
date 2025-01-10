import React, { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import NFTCard from '../components/reuse-component/NFTCard';
import { useWalletContext } from '../context/WalletContext';
import axiosInstance from '../utils/axiosInstance';
import user from '../../../back-end/models/user.model';
import { useLocation } from 'react-router-dom';

const ViewProfile = () => {
  const [activeTab, setActiveTab] = useState('Owned'); // Tab mặc định
  const [nfts, setNFTs] = useState([]); // Danh sách NFT
  const [activityLog, setActivityLog] = useState([]); // Lịch sử hoạt động
  const [userJoinedDate, setUserJoinedDate] = useState(''); // Ngày tham gia
  const [isLoading, setIsLoading] = useState(true); // Trạng thái loading
  const [favoriteNFTs, setFavoriteNFTs] = useState([]); // Danh sách NFT

  const location = useLocation();
  const { state } = location;

  console.log("Received state:", state);


  // Fetch NFTs thuộc sở hữu hoặc được tạo bởi user
  useEffect(() => {
    async function fetchUserNfts() {
      try {
        const responseUserData = await axiosInstance.get(`/nft/user-nfts/${state.walletAddress}`);
        const responseUserFavorite = await axiosInstance.get(`/users/favorite/${state.walletAddress}`);
        if (responseUserData?.data && responseUserFavorite?.data) {
          setNFTs(responseUserData.data);
          setFavoriteNFTs(responseUserFavorite.data)
        }
      } catch (error) {
        console.error('Error fetching user NFTs:', error);
      }
    }

    if (state.walletAddress) {
      fetchUserNfts();
    }
  }, [state]);

  useEffect(() => {
    const userJoinedDate = state?.createdAt
      ? new Date(state.createdAt).toLocaleDateString()
      : 'Unknown';
    setUserJoinedDate(userJoinedDate);
  }, [state]);

  // Fetch thông tin user và lịch sử hoạt động
  useEffect(() => {
    async function fetchUserDetails() {
      try {
        if (state.walletAddress) {
          // Fetch lịch sử hoạt động
          const activityResponse = await axiosInstance.get(`/users/actionhistories/${state.walletAddress}`);
          console.log('Activity Response:', activityResponse.data);

          // Kiểm tra nếu phản hồi chứa trường `actionHistory`
          if (Array.isArray(activityResponse.data.actionHistory)) {
            const activityData = activityResponse.data.actionHistory.map((activity) => ({
              id: activity._id,
              activity: formatActivity(activity),
              date: new Date(activity.timestamp).toLocaleString('vi-VN', { 
                timeZone: 'Asia/Ho_Chi_Minh',
              }),
            }));
            setActivityLog(activityData);
          } else {
            console.error('Unexpected response format:', activityResponse.data);
          }
        }
      } catch (error) {
        console.error('Error fetching user details or activity log:', error);
      } finally {
        setIsLoading(false); // Tắt trạng thái loading khi dữ liệu đã được tải
      }
    }

    fetchUserDetails();
  }, [state]);

  // Định dạng mô tả hoạt động
  const formatActivity = (activity) => {
    switch (activity.action) {
      case "list":
        return `Listed NFT #${Number(activity.tokenId) +1} for ${activity.price} ETH`;
      case "buy":
        return `Buy NFT #${Number(activity.tokenId) +1} from ${activity.to}`;
      case "mint":
        return `Minted NFT #${Number(activity.tokenId) +1} to ${activity.by}`;
      case "sell":
        return `Sold NFT #${Number(activity.tokenId) +1} to ${activity.to} for ${activity.price} ETH`;
      case "cancel":
        return `Canceled listing for NFT #${Number(activity.tokenId) +1}`;
      default:
        return `Performed action: ${activity.action} on NFT #${Number(activity.tokenId) +1}`;
    }
  };
  

  // Danh sách các NFT được phân loại
  const ownedList = nfts.filter((nft) => nft.ownerAddress === state.walletAddress);
  const onSaleList = nfts.filter((nft) => nft.ownerAddress === state.walletAddress && nft.isListed);
  const createdList = nfts.filter((nft) => nft.createdBy === state.walletAddress);

  // Cập nhật danh sách NFT khi có thay đổi
  const updateNFTList = (tokenId, updatedNft) => {
    setNFTs((prevNfts) =>
      prevNfts.map((nft) => (nft.tokenId === tokenId ? { ...nft, isListed: false } : nft))
    );
  };

  // Nếu user hoặc account chưa sẵn sàng, hiển thị trạng thái loading
  if (isLoading || !state) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <p className="text-gray-500 text-xl">Loading profile...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Profile Header */}
      <div className="relative bg-gray-200 h-52">
        <div className="absolute bottom-0 left-8 transform translate-y-1/2">
          <div className="w-32 h-32 bg-gradient-to-r from-green-500 to-green-300 rounded-full border-4 border-white flex items-center justify-center">
            {state.avatar ? (
              <img
                src={state.avatar}
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-white text-3xl font-bold">U</span>
            )}
          </div>
        </div>
        
      </div>

      {/* Profile Details */}
      <div className="pt-16 px-8">
        <h2 className="text-2xl font-bold">{state.username || 'Unnamed User'}</h2>
        <p className="text-gray-600">{state.walletAddress}</p>
        <p className="text-gray-500 text-sm">Joined {userJoinedDate}</p>

        {/* Tabs */}
        <div className="mt-8 border-b border-gray-300">
          <nav className="flex space-x-6">
            {['Owned', 'On sale', 'Created', 'Favorited', 'Activity'].map((tab) => (
              <button
                key={tab}
                className={`py-2 px-4 font-medium ${
                  activeTab === tab
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
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-6">
              {ownedList.map((nft) => (
                <NFTCard key={nft.tokenId} nft={nft} onUpdate={updateNFTList} />
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

          {activeTab === 'Created' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-6">
              {createdList.map((nft) => (
                <NFTCard key={nft.tokenId} nft={nft} />
              ))}
            </div>
          )}

          {activeTab === 'Favorited' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-6">
              {favoriteNFTs.map((nft) => (
                <NFTCard key={nft.tokenId} nft={nft} isFavoritedTab={true}/>
              ))}
            </div>
          )}

          {activeTab === 'Activity' && (
            <div>
              {activityLog.length > 0 ? (
                activityLog.map((log) => (
                  <div
                    key={log.id}
                    className="p-4 bg-gray-100 border rounded-lg shadow-sm"
                  >
                    <p>{log.activity}</p>
                    <p className="text-sm text-gray-500">{log.date}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No activity found.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ViewProfile;