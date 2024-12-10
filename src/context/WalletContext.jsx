import React, { createContext, useState, useEffect, useContext } from 'react';
import { ethers } from 'ethers';

// Tạo context để quản lý ví
const WalletContext = createContext();

// Tạo provider để bao bọc các component
export const WalletProvider = ({ children }) => {
    const [account, setAccount] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [signer, setSigner] = useState();

    const connectWallet = async () => {
        console.log("tiktak")
        if (!window.ethereum) {
            throw new Error("Metamask is not installed")
        }
        
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            setSigner(signer);
            const accounts = await provider.send("eth_requestAccounts", []);
            setIsConnected(true);
            setAccount(accounts[0]);
            const network = await provider.getNetwork();
            const chainID = network.chainId;
            const sepoliaNetworkId = "11155111"

            if(chainID.toString() !== sepoliaNetworkId)
            {
                alert("Please switch your metamask to sepolia network");
                return ;
            }
        } catch (error) {
            console.error("Connection error:", error)
        }

    };

    return (
        <WalletContext.Provider value={{ account, setAccount, isConnected, setIsConnected, signer, setSigner, connectWallet }}>
            {children}
        </WalletContext.Provider>
    );
};

// Hook để sử dụng context trong các component
export const useWalletContext = () => useContext(WalletContext);
