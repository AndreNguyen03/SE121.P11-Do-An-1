import React, { createContext, useState, useEffect, useContext } from 'react';
import { ethers } from 'ethers';
import axiosInstance from '../utils/axiosInstance';
import UserModal from '../pages/UserModal';
import { base64ToFile, slugify } from '../utils';

// Tạo context để quản lý ví
const WalletContext = createContext();

// Tạo provider để bao bọc các component
export const WalletProvider = ({ children }) => {
    const [account, setAccount] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [signer, setSigner] = useState();
    const [showModal, setShowModal] = useState(false); // Hiển thị modal nhập thông tin
    const [provider, setProvider] = useState(null);
    const [avatar, setAvatar] = useState(null);
    const [balance, setBalance] = useState(null);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [avatarLoaded, setAvatarLoaded] = useState(false);

    const updateBalance = async (account,provider) => {

        console.log(`account balance: `,account);
        console.log(`provider balance: `,provider);

        if (!account || !provider) return;
        try {
            const rawBalance = await provider.getBalance(account);
            const formattedBalance = ethers.formatEther(rawBalance).slice(0, 6); // Chuyển đổi sang ETH
            setBalance(formattedBalance); // Cập nhật số dư
            console.log("Balance updated:", formattedBalance); // Log để kiểm tra
        } catch (error) {
            console.error("Error updating balance:", error);
        }
    };
    

    const connectWallet = async () => {
        if (!window.ethereum) {
            throw new Error("Metamask is not installed");
        }

        try {
            setIsLoading(true);
            const provider = new ethers.BrowserProvider(window.ethereum);
            setProvider(provider);

            const signer = await provider.getSigner();
            setSigner(signer);

            const accounts = await provider.send("eth_requestAccounts", []);
            setAccount(accounts[0]);
            setIsConnected(true);

            await updateBalance(accounts[0], provider);

            // Kiểm tra nếu user đã tồn tại
            let userInfo = await getUserInfoByWalletAddress(accounts[0]);
            if (!userInfo) {
                // Nếu không tồn tại, tạo user mới
                const defaultUserData = { walletAddress: accounts[0], name: "Unamed" };
                const defaultAvatar = null; // Backend sẽ gán hình mặc định "default.png"
                userInfo = await createUser(defaultUserData, defaultAvatar);
            }

            // Cập nhật thông tin user và avatar
            setUser(userInfo.user);
            setAvatar(userInfo.user.image);

            // Kiểm tra mạng
            const network = await provider.getNetwork();
            const chainID = network.chainId;
            const sepoliaNetworkId = "11155111";
            if (chainID.toString() !== sepoliaNetworkId) {
                alert("Please switch your metamask to sepolia network");
                return;
            }

            setTimeout(() => {
                setAvatarLoaded(true);
                setIsLoading(false);
            }, 2000);
        } catch (error) {
            console.error("Connection error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const logoutWallet = () => {
        // Đặt lại các trạng thái liên quan đến ví
        setAccount(null);
        setIsConnected(false);
        setSigner(null);
        setProvider(null);
    };

    // Gọi API lấy thông tin người dùng
    const getUserInfoByWalletAddress = async (walletAddress) => {
        try {
            const { data } = await axiosInstance.get(`users/${walletAddress}`);
            console.log(data);
            return data;
        } catch (error) {
            if (error.response && error.response.status === 404) {
                console.log("Người dùng không tồn tại.");
                return null;
            }
            console.error("Error fetching user info:", error);
            return null;
        }
    };

    // Gọi API tạo người dùng
    const createUser = async (userData, imageFile) => {
        try {
            const formData = new FormData();
            formData.append('walletAddress', userData.walletAddress);
            formData.append('name', userData.name);
            if (imageFile) {
                formData.append('image', base64ToFile(imageFile, `${slugify(userData.name)}.png`));
            }

            const { data } = await axiosInstance.post('users/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            console.log('Response data:', data);
            return data;
        } catch (error) {
            console.error("Error creating user:", error);
            throw error;
        }
    };

    return (
        <WalletContext.Provider value={{updateBalance, isLoading, user, balance, avatar, provider, account, setAccount, isConnected, setIsConnected, signer, setSigner, connectWallet, logoutWallet, createUser, getUserInfoByWalletAddress, setShowModal }}>
            {children}
            {showModal && (
                <UserModal
                    onClose={() => setShowModal(false)}
                    createUser={createUser}
                    account={account}
                />
            )}
        </WalletContext.Provider>
    );
};

// Hook để sử dụng context trong các component
export const useWalletContext = () => useContext(WalletContext);
