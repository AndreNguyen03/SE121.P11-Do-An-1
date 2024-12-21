import React, { useState } from 'react';
import { listNFT } from '../utils/blockchain';
import { FaSpinner } from 'react-icons/fa';
import { useWalletContext } from '../context/WalletContext';
import socket from '../utils/socket';

const NFTDetailList = ({ nft, closeModal, setNFTs }) => {
    const [listingPrice, setListingPrice] = useState('');
    const [loading, setLoading] = useState(false); // State cho trạng thái đang xử lý
    const [error, setError] = useState(null); // State cho lỗi nếu có
    const [success, setSuccess] = useState(null); // State cho thông báo thành công
    const [showStatusModal, setShowStatusModal] = useState(false); // State để điều khiển Modal trạng thái
    const { account, user, updateBalance } = useWalletContext();

    const handleListNFT = async (e) => {
        e.preventDefault();
        if (listingPrice && parseFloat(listingPrice) > 0) {
            try {
                setLoading(true);
                setError(null); // Reset lỗi trước khi thực hiện giao dịch
                setSuccess(null); // Reset thông báo thành công
                setShowStatusModal(true); // Mở modal trạng thái

                // Gọi hàm listNFT từ hợp đồng thông minh
                await listNFT(nft.tokenId, listingPrice);

                // Cập nhật trạng thái NFT
                setNFTs((prevNFTs) =>
                    prevNFTs.map((item) =>
                        item.tokenId === nft.tokenId ? { ...item, isListed: true, price: listingPrice } : item
                    )
                );


                setLoading(false);
                setSuccess("NFT listed successfully!"); // Cập nhật thông báo thành công
                await updateBalance();
            } catch (error) {
                setLoading(false);
                console.error("Error listing NFT: ", error);
                setError("Error while listing the NFT!"); // Cập nhật thông báo lỗi
            }
        } else {
            setError("Please enter a valid price!"); // Nếu không nhập giá hợp lệ
        }
    };

    const handlePriceChange = (e) => {
        setListingPrice(e.target.value);
    };

    const closeStatusModal = async () => {
        await sendNotificationToFollowers();
        setShowStatusModal(false); // Đóng modal khi xong
        closeModal(); // Đóng modal chi tiết NFT
    };

    const sendNotificationToFollowers = async () => {
        const data = { nftTokenId: nft.tokenId, nftName: nft.metadata.name, nftImage: nft.metadata.ipfsImage, listedBy: user.walletAddress, listedByName: user.name }
        console.log(data);
        socket.emit(`listNFT`, data);
    };

    return (
        <>
            {/* Modal chi tiết NFT */}
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 ">
                <div className="bg-white w-11/12 md:w-2/3 lg:w-1/2 p-8 rounded-lg shadow-lg flex">
                    {/* Left side: NFT image */}
                    <div className="w-1/2 flex-shrink-0 mr-6">
                        <img src={nft.metadata.image} alt={nft.metadata.name} loading="lazy" className="w-full h-auto rounded-lg" />
                    </div>

                    {/* Right side: NFT details */}
                    <div className="w-1/2 flex-grow flex flex-col justify-between">
                        {/* Header with close button */}
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-3xl font-bold text-gray-800">Detail</h2>
                                <button
                                    onClick={closeModal}
                                    className="text-gray-500 hover:text-gray-700 text-3xl">
                                    &times;
                                </button>
                            </div>

                            <p className="text-lg font-semibold mb-3"><strong>Name:</strong> {nft.metadata.name}</p>
                            <p className="text-lg mb-3 text-wrap"><strong>Description:</strong> {nft.metadata.description}</p>
                            <p className="text-lg mb-3 text-wrap"><strong>Price:</strong> {nft.price} ETH</p>
                            <p className="text-lg mb-3 text-wrap"><strong>Seller:</strong> {nft.owner}</p>
                        </div>

                        {/* Input and List Button */}
                        <div className="flex mt-6">
                            <input
                                type="text"
                                value={listingPrice}
                                onChange={handlePriceChange}
                                placeholder="Enter listing price (ETH)"
                                className="border border-gray-300 rounded-lg py-2 px-4 w-2/3 mr-4"
                            />
                            <button
                                onClick={handleListNFT}
                                className="bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-700">
                                {loading ? "Listing..." : "List NFT"}
                            </button>
                        </div>

                        {/* Thông báo trạng thái */}
                        {error && <div className="mt-4 text-red-500">{error}</div>}
                        {success && <div className="mt-4 text-green-500">{success}</div>}
                    </div>
                </div>
            </div>

            {/* Modal trạng thái */}
            {showStatusModal && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white  p-8 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold text-center">Transaction Status</h2>
                        <div className="mt-6">
                            {loading && <p className="text-xl text-blue-500 text-center">Listing your NFT, please wait until transaction completed ....</p>}
                            {success && <p className="text-xl text-green-500 text-center">{success}</p>}
                            {error && <p className="text-xl text-red-500 text-center">{error}</p>}
                        </div>
                        <div className="mt-6 text-center">
                            <button
                                onClick={closeStatusModal}
                                className={`bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-700 ${loading && "opacity-50 cursor-not-allowed"}`}
                                disabled={loading}
                            >
                                {loading ? <FaSpinner className="animate-spin" /> : "Close"}
                            </button>

                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default NFTDetailList;
