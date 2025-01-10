import React from 'react';
import logo from '../assets/dfinity.svg';
import metamaskIcon from '../assets/metamask.png'; // Thay bằng đường dẫn đến ảnh MetaMask
import coinbaseIcon from '../assets/coinbase.png'; // Thay bằng đường dẫn đến ảnh Coinbase
import walletConnectIcon from '../assets/walletconnect.png'; // Thay bằng đường dẫn đến ảnh WalletConnect
import { FaSpinner } from 'react-icons/fa';

const ConnectWalletModal = ({ isOpen, onClose,onConnectMetaMask, isLoading }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-96">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-lg font-semibold">Connect to NFT Marketplace</h3>
                    <button
                        className="text-gray-500 hover:text-gray-700"
                        onClick={onClose}
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    <div className="flex items-center justify-center mb-6">
                        <div className="w-24 h-24 rounded-full flex items-center justify-center">
                            <img
                                src={logo} // Logo của bạn
                                alt="Logo"
                                className="w-24 h-24"
                            />
                        </div>
                    </div>
                    <ul className="space-y-4">
                        <li>
                            <button disable={isLoading} onClick={onConnectMetaMask} className="w-full flex items-center p-3 border rounded-md hover:bg-gray-100 transition">
                                <img
                                    src={metamaskIcon}
                                    alt="MetaMask"
                                    className="w-6 h-6 mr-4"
                                />
                                <span>MetaMask</span>
                                {isLoading && <FaSpinner className="ml-40 animate-spin h-6 w-6"/>}
                            </button>
                        </li>
                        <li>
                            <button disable={true} className="cursor-default opacity-50 w-full flex items-center p-3 border rounded-md hover:bg-gray-100 transition">
                                <img
                                    src={coinbaseIcon}
                                    alt="Coinbase Wallet"
                                    className="w-6 h-6 mr-4 object-cover"
                                />
                                <span>Coinbase Wallet</span>
                                <span className='ml-14'>coming soon</span>
                            </button>
                        </li>
                        <li>
                            <button disable={true} className="cursor-default opacity-50 w-full flex items-center p-3 border rounded-md hover:bg-gray-100 transition">
                                <img
                                    src={walletConnectIcon}
                                    alt="WalletConnect"
                                    className="w-6 h-6 mr-4 "
                                />
                                <span>Wallet Connect</span>
                                <span className='ml-16'>coming soon</span>
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

    );
};

export default ConnectWalletModal;
