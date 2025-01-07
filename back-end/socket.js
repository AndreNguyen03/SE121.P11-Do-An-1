import { Server } from 'socket.io';
import * as notificationService from './services/notification.service.js';

const setupSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: { origin: 'http://localhost:5173', methods: ['GET', 'POST'] },
  });

  const onlineUsers = new Map(); // Lưu user đang online

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Đăng ký người dùng online
    socket.on('register', (walletAddress) => {
      onlineUsers.set(walletAddress, socket.id);
      console.log(`User logged in: ${walletAddress}`);
      console.log(onlineUsers);
    });

    // Xử lý sự kiện logout
    socket.on('logout', (walletAddress) => {
      console.log(walletAddress)
      console.log(`include`, onlineUsers.has(walletAddress));
      console.log(onlineUsers)
      if (onlineUsers.has(walletAddress)) {
        onlineUsers.delete(walletAddress);
        console.log(`User logged out: ${walletAddress}`);
      }
    });

    // Khi NFT được list
    socket.on('listNFT', async (data) => {
      console.log(`listNft Emit confirm`)
      const { nftTokenId, nftName, nftImage, listedBy, listedByName } = data;
      console.log(`backend data:`, nftTokenId, nftName, nftImage, listedBy, listedByName);

      try {
        // Gửi thông báo đến database
        await notificationService.sendNotificationToFollowers(
          { nftTokenId, nftName, nftImage },
          listedBy,
          listedByName,
          onlineUsers,
          io
        );

      } catch (error) {
        console.error('Error sending notification:', error.message);
      }
    });

    // Khi user ngắt kết nối
    socket.on('disconnect', () => {
      onlineUsers.forEach((socketId, walletAddress) => {
        if (socketId === socket.id) onlineUsers.delete(walletAddress);
      });
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};

export default setupSocket;
