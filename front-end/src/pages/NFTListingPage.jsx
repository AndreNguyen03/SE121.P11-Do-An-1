import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import ItemListedModal from './ItemListedModal';
import ApproveListingModal from './ApproveListingModal';
import { useLocation, useNavigate } from 'react-router-dom';
import { replaceIpfsWithGateway } from '../utils';
import { approveNFT, listNFT } from '../utils/contract';
import { FaSpinner } from 'react-icons/fa';

function NFTListingPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { nft } = location.state || {};

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isItemListedModalOpen, setIsItemListedModalOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const [price, setPrice] = useState('');
    const [listingPrice, setListingPrice] = useState(0);
    const feePercentage = 2.5;

    if (!nft) {
        navigate(-1);
        return null;
    }

    const handleBack = () => {
        navigate(-1);
    };


    const handlePriceChange = (e) => {
        const inputPrice = parseFloat(e.target.value) || 0;
        setPrice(e.target.value);
        setListingPrice(inputPrice);
    };

    const calculateEarnings = () => {
        return listingPrice - (listingPrice * feePercentage) / 100;
    };

    const handleListItem = async () => {
        // Bước 1: Mở modal approval
        setIsModalOpen(true);
        setIsProcessing(true);

        try {
            // Bước 2: Kiểm tra và phê duyệt tất cả NFT cho Marketplace
            const approveSuccess = await approveNFT(); // Không cần truyền tokenId nữa

            if (!approveSuccess) {
                setIsProcessing(false);
                setIsModalOpen(false);
                alert('Approval failed. Please try again.');
                return;
            } 

            // Bước 3: Tiến hành niêm yết NFT sau khi phê duyệt thành công
            const listSuccess = await listNFT(nft.tokenId, listingPrice);

            if (listSuccess) {
                // Bước 4: Niêm yết thành công, hiển thị modal item listed
                setIsProcessing(false);
                setIsModalOpen(false);
                setIsItemListedModalOpen(true);
            } else {
                setIsProcessing(false);
                setIsModalOpen(false);
            }
        } catch (error) {
            setIsProcessing(false);
            console.error('Error in handleListItem:', error);
            setIsModalOpen(false);
            
        }
    };



    return (
        <Layout>
            <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                    <button className="text-gray-600 hover:text-gray-800" onClick={handleBack}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 rounded-full hover:bg-gray-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 18a1 1 0 01-.707-.293l-7-7a1 1 0 010-1.414l7-7a1 1 0 011.414 1.414L4.414 10l6.293 6.293A1 1 0 0110 18z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                    <h1 className="text-xl font-bold text-gray-800 ml-2">List for sale</h1>
                </div>

                {/* NFT Card */}
                <div className="border rounded-lg overflow-hidden shadow-lg w-[200px] m-auto">
                    <div className="bg-gray-100 flex items-center justify-center">
                        <img
                            src={replaceIpfsWithGateway(nft.metadata.image)}
                            alt="NFT Preview"
                            className="object-cover w-full h-50"
                        />
                    </div>
                    <div className="p-4">
                        <h2 className="text-lg font-bold text-gray-800">{nft.metadata.name}</h2>
                        <p className="text-gray-600">SquishySouls</p>
                        <p className="text-gray-800 font-medium text-xl">{listingPrice || '--'} ETH</p>
                    </div>
                </div>

                {/* Set Price */}
                <div className="mb-6">
                    <label htmlFor="price" className="block text-gray-700 font-medium mb-2">
                        Set a Price
                    </label>
                    <div className="flex items-center">
                        <input
                            id="price"
                            type="text"
                            value={price}
                            onChange={handlePriceChange} // Cập nhật giá trị khi thay đổi
                            placeholder="Amount"
                            className="w-full px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        />
                        <span className="px-4 py-2 bg-gray-100 border border-l-0 rounded-r-lg text-gray-700">ETH</span>
                    </div>
                </div>

                {/* Summary */}
                <div className="mb-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Summary</h2>
                    <div className="flex justify-between text-gray-700 mb-2">
                        <span>Listing price:</span>
                        <span>{listingPrice || '--'} ETH</span>
                    </div>
                    <div className="flex justify-between text-gray-700 mb-2">
                        <span>Marketplace fee:</span>
                        <span>{feePercentage} %</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                        <span>Total potential earnings:</span>
                        <span>{listingPrice ? `${calculateEarnings()} ETH` : '--'}</span>
                    </div>
                </div>

                {/* Complete Listing Button */}
                <button
                    onClick={handleListItem}
                    className="w-full bg-cyan-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    disabled={isProcessing}
                >
                    {isProcessing ? (
                        <FaSpinner className="animate-spin h-6 w-6 text-white mx-auto" />
                    ) : (
                        'Complete Listing'
                    )}
                </button>


                {/* Modal */}
                <ApproveListingModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    item={nft}
                    listingPrice={listingPrice}
                    isProcessing={isProcessing}
                    setIsProcessing={setIsProcessing}
                />

                {/* Item Listed Modal */}
                <ItemListedModal
                    isOpen={isItemListedModalOpen}
                    onClose={() => setIsItemListedModalOpen(false)}
                    item={nft}
                />
            </div>
        </Layout>
    );
}

export default NFTListingPage;
