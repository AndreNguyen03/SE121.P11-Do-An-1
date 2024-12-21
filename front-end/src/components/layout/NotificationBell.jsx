import React, { useState, useEffect } from "react";
import { BsBell } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { useWalletContext } from "../../context/WalletContext";
import axiosInstance from "../../utils/axiosInstance"; // Kiểm tra `api` có được import
import socket from "../../utils/socket"; // Đảm bảo socket được khởi tạo
import { fetchNFTById } from "../../utils/blockchain";

const NotificationBell = () => {
  const { isConnected, account } = useWalletContext();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  const unreadCount = notifications ? notifications.filter((n) => !n.isRead).length : 0;

  const fetchNotifications = async () => {
    try {
      const response = await axiosInstance.get(`/notifications/${account}`);
      setNotifications(response.data);
      console.log(response.data);
    } catch (error) {
      console.error(error.response?.data || "Error");
    }
  };

  useEffect(() => {
    if (!isConnected && !account) return;
    console.log(`Noti useEffect`)
    socket.emit("register", account.toLowerCase());

    const handleNewNotification = (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      console.log(`New NFT listed: ${notification.nftName}`);
      console.log(notification.nftImage)
    };

    socket.on("newNotification", handleNewNotification);

    return () => {
      socket.off("newNotification", handleNewNotification);
    };
  }, [account]);

  useEffect(() => {
    if (account) fetchNotifications();
  }, [account]);

  const handleMarkAsRead = async (id) => {
    setNotifications((prev) => prev.filter((n) => n.nftTokenId !== id));

    try {
      const response = await axiosInstance.post(`/notifications/markAsRead`, {
        nftTokenId: id,
        walletAddress: account.toLowerCase(),
      });
      console.log("Mark as read response:", response.data);

      const nft = await fetchNFTById(id);
      console.log(nft);

      navigate(`/nft/${nft.tokenId}`, { state: { nft } }); // Điều hướng đến NFTDetail với id

    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, isRead: true }))
    );

    try {
      const response = await axiosInstance.post(`/notifications/markAllAsRead`, {
        walletAddress: account.toLowerCase(),
      });
      console.log("Mark all as read response:", response.data);
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  return (
    <div className="relative">
      <button
        className="relative p-2 text-gray-500 hover:text-gray-800"
        onClick={() => setIsOpen(!isOpen)}
      >
        <BsBell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white text-xs">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg">
          <div className="p-4 border-b">
            <h3 className="text-sm font-medium text-gray-800">
              Thông báo ({notifications.length})
            </h3>
          </div>
          <ul className="max-h-60 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <li
                  key={notification._id}
                  className={`cursor-pointer flex items-center gap-3 p-3 ${notification.isRead ? "bg-white" : "bg-gray-50"
                    } hover:bg-gray-100`}
                  onClick={() => handleMarkAsRead(notification.nftTokenId)}
                >
                  <img
                    src={notification.nftImage}
                    alt={notification.nftName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">
                      {notification.nftName}
                    </p>
                    <p className="text-xs text-gray-500">Listed by {notification.listedBy}</p>
                  </div>
                </li>
              ))
            ) : (
              <li className="p-4 text-sm text-gray-500">Không có thông báo</li>
            )}
          </ul>
          <div className="p-4 border-t text-center">
            <button
              className="text-sm text-blue-500 hover:underline"
              onClick={markAllAsRead}
            >
              Đánh dấu tất cả là đã đọc
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
