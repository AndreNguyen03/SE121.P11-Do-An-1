import React, { useState } from 'react';
import { listNFT } from '../utils/blockchain';

const NFTDetail = ({ nft, closeModal }) => {
    const [listingPrice, setListingPrice] = useState('');

    const handleListNFT = async (e) => {
        e.preventDefault();
        if (listingPrice && parseFloat(listingPrice) > 0) {
            try {
                // Gọi hàm listNFT từ hợp đồng thông minh
                await listNFT(nft.tokenId, listingPrice);
                alert("NFT listed successfully!");
                closeModal(); // Đóng modal sau khi liệt kê thành công
            } catch (error) {
                console.error("Error listing NFT: ", error);
                alert("Error while listing the NFT!");
            }
        } else {
            alert("Please enter a valid price!");
        }
    };


    const handlePriceChange = (e) => {
        setListingPrice(e.target.value);
    };


    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 ">
            <div className="bg-white w-11/12 md:w-2/3 lg:w-1/2 p-8 rounded-lg shadow-lg flex">
                {/* Left side: NFT image */}
                <div className="w-1/2 flex-shrink-0 mr-6">
                    <img src={nft.metadata.image} alt={nft.metadata.name} className="w-full h-auto rounded-lg" />
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
                        <p className="text-lg mb-3"><strong>Description:</strong> {nft.metadata.description}</p>
                        <p className="text-lg mb-3"><strong>Price:</strong> {nft.price} ETH</p>
                        <p className="text-lg mb-3"><strong>Seller:</strong> {nft.owner}</p>

                    </div>
                    {/* Input and List Button */}
                    <div className="flex  mt-6 ">
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
                            List NFT
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default NFTDetail;
