import user from '../models/user.model.js';

/**
 * Gửi thông báo đến tất cả follower khi NFT được list.
 */
export const sendNotificationToFollowers = async (nftData, listedBy, listedByName, onlineUsers, socket) => {
  try {
    console.log(`push noti to db`)
    console.log(`check data param:`, nftData, listedBy, listedByName, onlineUsers);
    const listedUser = await user.findOne({ walletAddress: listedBy }).select('followedUsers');
    if (!listedUser) throw new Error('User listing the NFT not found');

    // Tạo thông báo
    const notification = {
      nftTokenId: nftData.nftTokenId,
      nftName: nftData.nftName,
      nftImage: nftData.nftImage,
      listedBy,
      listedByName,
      timestamp: new Date(),
      isRead: false,
    };
 
    // Xử lý thông báo cho từng follower
    for (const followerWallet of listedUser.followedUsers) {
      if (onlineUsers.has(followerWallet)) {
        // Nếu follower đang online => Gửi socket real-time
        socket.to(onlineUsers.get(followerWallet)).emit('newNotification', notification);
        console.log(`push noti Realtime`)
      }
        // Nếu follower offline => Lưu vào database
        console.log(`push noti to db`)
        await user.updateOne(
          { walletAddress: followerWallet },
          { $push: { notifications: notification } }
        );
      }
    } catch (error) {
    console.error('Error sending notification:', error);
    throw new Error('Failed to send notification');
  }
};

/**
 * Lấy danh sách thông báo của một user.
 */
export const getUserNotifications = async (walletAddress) => {
  const userNoti = await user.findOne(
    { walletAddress },
    { notifications: { $elemMatch: { isRead: false } } } // Chỉ lấy thông báo chưa đọc
  );

  if (!userNoti) throw new Error('User not found');

  return userNoti.notifications; // Trả về danh sách thông báo chưa đọc
};



/**
 * Đánh dấu tất cả thông báo là đã đọc
 * @param {string} walletAddress
 */
export const markAllAsRead = async (walletAddress) => {
  return await user.updateMany(
    { walletAddress, 'notifications.isRead': false },
    { $set: { 'notifications.$[].isRead': true } }
  );
};
/**
 * Đánh dấu một thông báo cụ thể là đã đọc
 * @param {string} notificationId
 * @param {string} walletAddress
 */
export const markAsRead = async (nftTokenId, walletAddress) => {
  return await user.findOneAndUpdate(
    { walletAddress, 'notifications.nftTokenId': nftTokenId },
    { $set: { 'notifications.$.isRead': true } },
    { new: true } // Trả về tài liệu sau khi cập nhật
  );
};