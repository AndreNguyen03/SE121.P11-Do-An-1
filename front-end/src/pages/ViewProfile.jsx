import React, { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import Header from '../components/reuse-component/Header';
import { fetchUserNFTs } from '../utils/blockchain';
import { useLocation } from 'react-router-dom';
import NFTDetailList from './NFTDetailList';
import NFTCardProfile from '../components/reuse-component/NFTCardProfile';
import { FaSpinner } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../utils/axiosInstance';
import { useWalletContext } from '../context/WalletContext';

function ViewProfile() {
    const { state } = useLocation();
    const { account } = useWalletContext();
    const { owner: accountRef, userInfo: user } = state;
    const [isFollowing, setIsFollowing] = useState(false); // Trạng thái theo dõi
    const [showUnfollowModal, setShowUnfollowModal] = useState(false); // Modal xác nhận bỏ theo dõi
    const [isModalDetailOpen, setIsModalDetailOpen] = useState(false);
    const [selectedNFT, setSelectedNFT] = useState(null);
    const [nfts, setNFTs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleListClick = (nft) => {
        setSelectedNFT(nft);
        setIsModalDetailOpen(true);
    };

    const closeModal = () => {
        setIsModalDetailOpen(false);
    };

    const handleFollow = async () => {
        if (!isFollowing) {
            setIsFollowing(true);
            await axiosInstance.post(`users/follow`, { followerAddress: accountRef.toLowerCase(), followeeAddress: account.toLowerCase() });
            toast.success('You have followed this user!', {
                position: "top-right",
                autoClose: 3000,
            });
        } else {
            setShowUnfollowModal(true);
        }
    };

    const confirmUnfollow = async () => {
        setIsFollowing(false);
        setShowUnfollowModal(false);
        await axiosInstance.post(`users/unfollow`, { followerAddress: accountRef.toLowerCase(), followeeAddress: account.toLowerCase() });
        toast.info('You have unfollowed this user.', {
            position: "top-right",
            autoClose: 3000,
        });

    };

    const cancelUnfollow = () => {
        setShowUnfollowModal(false);
    };

    useEffect(() => {
        if (accountRef) {
            async function fetchNFTs() {
                try {
                    console.log(accountRef);
                    const nfts = await fetchUserNFTs(accountRef);
                    setNFTs(nfts);
                    const getUser = await axiosInstance.get(`users/${accountRef}`)
                    const userRefInfo = getUser.data.user;
                    console.log(`is follwer `, userRefInfo.followedUsers.includes(account.toLowerCase()))
                    if (userRefInfo.followedUsers.includes(account.toLowerCase())) {
                        setIsFollowing(true);
                    }
                } catch (error) {
                    console.error("Error fetching NFTs: ", error);
                    setError("Failed to load NFTs. Please try again.");
                } finally {
                    setLoading(false);
                }
            }


            fetchNFTs();
        }
    }, [accountRef]);

    const listedNFTs = nfts.filter((nft) => nft.isListed);
    const unlistedNFTs = nfts.filter((nft) => !nft.isListed);

    return (
        <>
            <Layout>
                <div className="relative flex flex-col items-center mt-20 p-12 bg-white rounded-lg shadow-lg w-11/12 lg:w-[80%] mx-auto">
                    {/* Profile Image */}
                    <div className="absolute -top-16 w-40 h-40 rounded-full overflow-hidden shadow-md border-4 border-white">
                        <img
                            src={user?.image}
                            alt="Profile"
                            className="object-cover w-full h-full"
                        />
                    </div>

                    {/* Follow Button */}
                    {account.toLowerCase() !== accountRef.toLowerCase() && (
                        <div className="absolute top-15 mt-6">
                            <button
                                className={`px-4 py-2 rounded-lg flex items-center justify-center ${isFollowing ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'} hover:opacity-80 transition`}
                                onClick={handleFollow}
                                disabled={loading}  // Disable button khi đang loading
                            >
                                {loading ? (
                                    <FaSpinner className="animate-spin text-white" />
                                ) : isFollowing ? (
                                    '✔ Following'
                                ) : (
                                    '+ Follow'
                                )}
                            </button>
                        </div>
                    )}

                    {/* Profile Info */}
                    <div className="mt-20 text-center">
                        <h2 className="text-2xl font-bold text-gray-800">{user?.name}</h2>
                        <p className="text-gray-500 text-lg mt-3">Wallet Address: {accountRef}</p>
                    </div>

                    {/* Unlisted NFTs */}
                    <Header textColor={'text-black'}>Unlisted NFTs</Header>
                    {loading ? (
                        <FaSpinner className="animate-spin" />
                    ) : unlistedNFTs.length === 0 ? (
                        <p className="text-gray-500 text-center mt-4">
                            You currently have no unlisted NFTs available for listing. Create or mint a new NFT to get started!
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 mx-auto lg:gap-4">
                            {unlistedNFTs.map((nft) => (
                                <div key={nft.tokenId}>
                                    <NFTCardProfile nft={nft} onClick={() => handleListClick(nft)} />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Listed NFTs */}
                    <Header textColor={'text-black'}>Listed NFTs</Header>
                    {loading ? (
                        <FaSpinner className="animate-spin" />
                    ) : listedNFTs.length === 0 ? (
                        <p className="text-gray-500 text-center mt-4">
                            You currently have no listed NFTs on the marketplace. List an NFT to make it available for trading!
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 mx-auto lg:gap-4">
                            {listedNFTs.map((nft) => (
                                <div key={nft.tokenId}>
                                    <NFTCardProfile nft={nft} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </Layout>

            {/* NFT Detail Modal */}
            {isModalDetailOpen && selectedNFT && (
                <NFTDetailList nft={selectedNFT} closeModal={closeModal} setNFTs={setNFTs} />
            )}

            {/* Unfollow Confirmation Modal */}
            {showUnfollowModal && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 shadow-lg">
                        <p className="text-lg font-semibold text-gray-800 mb-4">
                            Are you sure you want to unfollow this user?
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button
                                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
                                onClick={cancelUnfollow}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                                onClick={confirmUnfollow}
                            >
                                Unfollow
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Container */}
            <ToastContainer />
        </>
    );
}

export default ViewProfile;
