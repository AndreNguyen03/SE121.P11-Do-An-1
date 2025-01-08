import React, { createContext, useState, useEffect, useContext } from 'react';
import { ethers } from 'ethers';
import axiosInstance from '../utils/axiosInstance';
import UserModal from '../pages/UserModal';
import { base64ToFile, slugify } from '../utils';
import defaultAvatar from '../assets/default.png';

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

    const updateBalance = async (account, provider) => {
        if (!account || !provider) return;
        try {
            const rawBalance = await provider.getBalance(account);
            const formattedBalance = ethers.formatEther(rawBalance).slice(0, 6);
            console.log('Balance updated:', formattedBalance);
        } catch (error) {
            console.error('Error updating balance:', error);
        }
    };

    // Khi kết nối ví lần đầu:
    const connectWallet = async () => {
        if (!window.ethereum) {
            throw new Error('Metamask is not installed');
        }

        try {
            setIsLoading(true);
            const provider = new ethers.BrowserProvider(window.ethereum);
            setProvider(provider);

            const signer = await provider.getSigner();
            setSigner(signer);

            const accounts = await provider.send('eth_requestAccounts', []);
            setAccount(accounts[0]);
            setIsConnected(true);

            await updateBalance(accounts[0], provider);

            // Kiểm tra nếu user đã tồn tại
            let userInfo = await getUserInfoByWalletAddress(accounts[0]);
            if (!userInfo) {
                // Tạo user mới với avatar mặc định và tên mặc định
                const defaultAvatar = 'default.png'; // Avatar mặc định.
                const defaultUserData = { walletAddress: accounts[0], name: 'Unnamed' };
                userInfo = await createUser(defaultUserData, defaultAvatar);
            }

            // Cập nhật thông tin user
            setUser(userInfo.user);
            setAvatar(userInfo.user.image);
        } catch (error) {
            console.error('Connection error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const logoutWallet = () => {
        setAccount(null);
        setIsConnected(false);
        setSigner(null);
        setProvider(null);
    };

    const getUserInfoByWalletAddress = async (walletAddress) => {
        try {
            const { data } = await axiosInstance.get(`/users/${walletAddress}`);
            return data;
        } catch (error) {
            if (error.response && error.response.status === 404) {
                return null;
            }
            console.error('Error fetching user info:', error);
            return null;
        }
    };

    const createUser = async (userData, avatarFile) => {
        try {
            const formData = new FormData();
            formData.append('walletAddress', userData.walletAddress);
            formData.append('name', userData.name);

            if (avatarFile && avatarFile !== 'default.png') {
                formData.append('image', base64ToFile(avatarFile, `${slugify(userData.name)}.png`));
            }

            const { data } = await axiosInstance.post('/users/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            setUser(data.user);
            setAvatar(data.user.image);
            return data;
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    };

    const updateUser = async (userData, avatarFile) => {
        try {
            const formData = new FormData();
            formData.append('walletAddress', userData.walletAddress);
            formData.append('name', userData.name);

            if (avatarFile) {
                formData.append('image', base64ToFile(avatarFile, `${slugify(userData.name)}.png`));
            }

            const { data } = await axiosInstance.post('/users/update', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            setUser(data.user);
            setAvatar(data.user.image);
            return data;
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    };

    return (
        <WalletContext.Provider
            value={{
                user,
                account,
                isConnected,
                connectWallet,
                logoutWallet,
                avatar,
                setShowModal,
                createUser,
                updateUser,
            }}
        >
            {children}
            {showModal && (
                <UserModal
                    onClose={() => setShowModal(false)}
                    user={user}
                    updateUser={updateUser}
                />
            )}
        </WalletContext.Provider>
    );
};

// Hook để sử dụng context trong các component
export const useWalletContext = () => useContext(WalletContext);
