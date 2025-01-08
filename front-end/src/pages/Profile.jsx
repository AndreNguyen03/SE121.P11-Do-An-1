import React, { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import NFTCard from '../components/reuse-component/NFTCard';
import { useWalletContext } from '../context/WalletContext';
import axiosInstance from '../utils/axiosInstance';
import user from '../../../back-end/models/user.model';

const Profile = () => {
  const { account, avatar, user, setShowModal } = useWalletContext(); // Lấy thông tin từ WalletContext
  const [activeTab, setActiveTab] = useState('Owned'); // Tab mặc định
  const [nfts, setNFTs] = useState([]); // Danh sách NFT
  const [activityLog, setActivityLog] = useState([]); // Lịch sử hoạt động
  const [userJoinedDate, setUserJoinedDate] = useState(''); // Ngày tham gia
  const [isLoading, setIsLoading] = useState(true); // Trạng thái loading

  // Fetch NFTs thuộc sở hữu hoặc được tạo bởi user
  useEffect(() => {
    async function fetchUserNfts() {
      try {
        const response = await axiosInstance.get(`/nft/user-nfts/${account}`);
        if (response?.data) {
          setNFTs(response.data);
        }
      } catch (error) {
        console.error('Error fetching user NFTs:', error);
      }
    }

    if (account) {
      fetchUserNfts();
    }
  }, [account]);

  useEffect(() => {
    const userJoinedDate = user?.createdAt
      ? new Date(user.createdAt).toLocaleDateString()
      : 'Unknown';
    setUserJoinedDate(userJoinedDate);
  }, [user]);

  // Fetch thông tin user và lịch sử hoạt động
  useEffect(() => {
    async function fetchUserDetails() {
      try {
        if (account) {
          // Fetch lịch sử hoạt động
          const activityResponse = await axiosInstance.get(`/users/actionhistories/${account}`);
          console.log('Activity Response:', activityResponse.data);

          // Kiểm tra nếu phản hồi chứa trường `actionHistory`
          if (Array.isArray(activityResponse.data.actionHistory)) {
            const activityData = activityResponse.data.actionHistory.map((activity) => ({
              id: activity._id,
              activity: formatActivity(activity),
              date: new Date(activity.timestamp).toLocaleDateString(),
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
  }, [account]);

  // Định dạng mô tả hoạt động
  const formatActivity = (activity) => {
    switch (activity.action) {
      case 'list':
        return `Listed NFT #${activity.tokenId} for ${activity.price} ETH`;
      case 'transfer':
        return `Transferred NFT #${activity.tokenId} to ${activity.to}`;
      case 'mint':
        return `Minted NFT #${activity.tokenId}`;
      default:
        return `Performed action: ${activity.action} on NFT #${activity.tokenId}`;
    }
  };

  // Danh sách các NFT được phân loại
  const ownedList = nfts.filter((nft) => nft.ownerAddress === account);
  const onSaleList = nfts.filter((nft) => nft.ownerAddress === account && nft.isListed);
  const createdList = nfts.filter((nft) => nft.createdBy === account);

  // Cập nhật danh sách NFT khi có thay đổi
  const updateNFTList = (tokenId, updatedNft) => {
    setNFTs((prevNfts) =>
      prevNfts.map((nft) => (nft.tokenId === tokenId ? { ...nft, isListed: false } : nft))
    );
  };

  // Nếu user hoặc account chưa sẵn sàng, hiển thị trạng thái loading
  if (isLoading || !user || !account) {
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
            {avatar ? (
              <img
                src={avatar}
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-white text-3xl font-bold">U</span>
            )}
          </div>
        </div>
        <button
          className="absolute bottom-4 right-8 bg-green-500 hover:bg-green-700 text-white p-2 rounded-md flex items-center"
          onClick={() => setShowModal(true)}
        >
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
        <h2 className="text-2xl font-bold">{user.name || 'Unnamed User'}</h2>
        <p className="text-gray-600">{account}</p>
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

export default Profile;