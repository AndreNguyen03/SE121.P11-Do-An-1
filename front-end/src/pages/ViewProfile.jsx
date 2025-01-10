import React, { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import Header from '../components/reuse-component/Header';
import { useLocation } from 'react-router-dom';
import NFTDetailList from './NFTDetailList';
import NFTCardProfile from '../components/reuse-component/NFTCardProfile';
import { FaSpinner } from 'react-icons/fa';
import axiosInstance from '../utils/axiosInstance';

// Hàm chuyển đổi URL IPFS thành HTTP(S) hợp lệ
const formatImageUrl = (url) => {
    if (url.startsWith('ipfs://')) {
        return url.replace('ipfs://', 'https://ipfs.io/ipfs/');
    }
    return url;
};

function ViewProfile() {
    const { state } = useLocation();
    const accountRef = state?.owner || "Người dùng chưa xác định";
    const user = state?.userInfo || { name: "Khách", image: "", bio: "" };

    const [nfts, setNFTs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalDetailOpen, setIsModalDetailOpen] = useState(false);
    const [selectedNFT, setSelectedNFT] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                console.log('Fetching NFTs for account:', accountRef); // Log accountRef để kiểm tra
                const userNFTs = await fetchUserNFTs(accountRef);
                console.log('Fetched NFTs:', userNFTs); // Log dữ liệu trả về từ API
                setNFTs(userNFTs); // Cập nhật state
            } catch (error) {
                console.error('Error loading NFTs:', error);
                setError('Cannot load NFTs.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [accountRef]);

    const fetchUserNFTs = async (walletAddress) => {
        try {
            const { data } = await axiosInstance.get(`/nft/user-nfts/${walletAddress}`);
            console.log('API Response:', data); // Log phản hồi API
            return data.nfts || []; // Đảm bảo cấu trúc dữ liệu đúng
        } catch (error) {
            console.error('Error fetching NFTs:', error);
            throw new Error('Failed to fetch NFTs.');
        }
    };

    // Hàm xử lý mở modal chi tiết NFT
    const handleListClick = (nft) => {
        setSelectedNFT(nft);
        setIsModalDetailOpen(true);
    };

    // Đóng modal
    const closeModal = () => {
        setIsModalDetailOpen(false);
    };

    // Phân loại NFT (đã niêm yết và chưa niêm yết)
    const listedNFTs = nfts.filter((nft) => nft.isListed);
    const unlistedNFTs = nfts.filter((nft) => !nft.isListed);
    console.log("NFTs:", nfts);
    console.log('Account reference:', accountRef);


    return (
        <>
            <Layout>
                <div className="relative flex flex-col items-center mt-20 p-12 bg-white rounded-lg shadow-lg w-11/12 lg:w-[80%] mx-auto">
                    {/* Ảnh hồ sơ */}
                    <div className="absolute -top-16 w-40 h-40 rounded-full overflow-hidden shadow-md border-4 border-white">
                        <img
                            src={formatImageUrl(user?.image)}
                            alt="Profile"
                            className="object-cover w-full h-full"
                        />
                    </div>

                    {/* Thông tin hồ sơ */}
                    <div className="mt-20 text-center">
                        <h2 className="text-2xl font-bold text-gray-800">{user?.name}</h2>
                        <p className="text-gray-500 text-lg mt-3">Wallet Address: {accountRef}</p>
                    </div>

                    {/* NFT chưa niêm yết */}
                    <Header textColor="text-black">Unlisted NFTs</Header>
                    {loading ? (
                        <FaSpinner className="animate-spin" />
                    ) : error ? (
                        <p className="text-red-500 text-center mt-4">{error}</p>
                    ) : unlistedNFTs.length === 0 ? (
                        <p className="text-gray-500 text-center mt-4">
                            Không có NFT nào chưa niêm yết.
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

                    {/* NFT đã niêm yết */}
                    <Header textColor="text-black">Listed NFTs</Header>
                    {loading ? (
                        <FaSpinner className="animate-spin" />
                    ) : error ? (
                        <p className="text-red-500 text-center mt-4">{error}</p>
                    ) : listedNFTs.length === 0 ? (
                        <p className="text-gray-500 text-center mt-4">
                            Không có NFT nào đã niêm yết.
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

            {/* Modal chi tiết NFT */}
            {isModalDetailOpen && selectedNFT && (
                <NFTDetailList nft={selectedNFT} closeModal={closeModal} setNFTs={setNFTs} />
            )}
        </>
    );
}

export default ViewProfile;