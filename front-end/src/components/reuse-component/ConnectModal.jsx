import React from 'react';
import { useWalletContext } from '../../context/WalletContext';
import Layout from '../layout/Layout';

const ConnectModal = ({ onClose }) => {
    const { connectWallet } = useWalletContext();

    const handleConnect = async () => {
        await connectWallet();
        onClose();
    };

    return (
        <Layout>
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                <h2 className="text-lg font-semibold mb-4">Connect to a Service</h2>
                <p className="text-gray-600 mb-6">Please select a service to connect:</p>
                <button 
                    onClick={handleConnect} 
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded mb-4 hover:bg-blue-600"
                >
                    MetaMask
                </button>
                <button 
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded mb-4 hover:bg-blue-600"
                >
                    Coinbase Wallet
                </button>
                <button 
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded mb-4 hover:bg-blue-600"
                >
                    WalletConnect
                </button>
            </div>
        </div>
        </Layout>
    );
};

export default ConnectModal;