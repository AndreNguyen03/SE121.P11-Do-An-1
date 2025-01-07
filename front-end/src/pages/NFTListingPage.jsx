import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import ItemListedModal from './ItemListedModal';
import ApproveListingModal from './ApproveListingModal';

function NFTListingPage() {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isItemListedModalOpen, setIsItemListedModalOpen] = useState(false);

    const item = {
        name: 'Squishy Souls #54',
        collection: 'SquishySouls',
        image: 'https://via.placeholder.com/100', // Replace with actual image URL
        link: '#', // Replace with actual link to the listing
    };



    return (
        <Layout>
            <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                    <button className="text-gray-600 hover:text-gray-800">
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
                            src="https://via.placeholder.com/150" // Placeholder image
                            alt="NFT Preview"
                            className="object-cover w-full h-40"
                        />
                    </div>
                    <div className="p-4">
                        <h2 className="text-lg font-bold text-gray-800">Squishy Souls #7</h2>
                        <p className="text-gray-600">SquishySouls</p>
                        <p className="text-gray-800 font-medium text-xl">2313 ETH</p>
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
                            placeholder="Amount"
                            className="w-full px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        />
                        <span className="px-4 py-2 bg-gray-100 border border-l-0 rounded-r-lg text-gray-700">ETH</span>
                    </div>
                </div>

                {/* Duration */}
                <div className="mb-6">
                    <label htmlFor="duration" className="block text-gray-700 font-medium mb-2">
                        Duration
                    </label>
                    <select
                        id="duration"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    >
                        <option value="1_month">1 month</option>
                        <option value="3_months">3 months</option>
                        <option value="6_months">6 months</option>
                    </select>
                </div>

                {/* Summary */}
                <div className="mb-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Summary</h2>
                    <div className="flex justify-between text-gray-700 mb-2">
                        <span>Listing price:</span>
                        <span>-- ETH</span>
                    </div>
                    <div className="flex justify-between text-gray-700 mb-2">
                        <span>OpenSea fee:</span>
                        <span>2.5%</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                        <span>Total potential earnings:</span>
                        <span>-- ETH</span>
                    </div>
                </div>

                {/* Complete Listing Button */}
                <button
                    className="w-full bg-cyan-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                >
                    Complete Listing
                </button>

                {/* Open Modal Button */}
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="mt-4 w-full bg-cyan-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                >
                    Approve Collection
                </button>

                {/* Trigger Item Listed Modal */}
                <button
                    onClick={() => setIsItemListedModalOpen(true)}
                    className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    List Item
                </button>

                {/* Modal */}
                <ApproveListingModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    item={item}
                />

                {/* Item Listed Modal */}
                <ItemListedModal
                    isOpen={isItemListedModalOpen}
                    onClose={() => setIsItemListedModalOpen(false)}
                    item={item}
                />
            </div>
        </Layout>
    );
}

export default NFTListingPage;
