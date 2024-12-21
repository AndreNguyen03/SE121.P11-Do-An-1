import * as notificationService from '../services/notification.service.js';

export const getNotifications = async (req, res) => {
  try {
    const { walletAddress } = req.params;
  
    const notifications = await notificationService.getUserNotifications(walletAddress);
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Controller để đánh dấu tất cả thông báo đã đọc
 */
export const markAllAsRead = async (req, res) => {
  const { walletAddress } = req.body;
  console.log(`markAllAsRead: `,walletAddress);
  if (!walletAddress) {
    return res.status(400).json({ message: 'Wallet address is required.' });
  }

  try {
    await notificationService.markAllAsRead(walletAddress);
    res.status(200).json({ message: 'All notifications marked as read.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to mark notifications as read.', error: error.message });
  }
};

/**
 * Controller để đánh dấu một thông báo cụ thể đã đọc
 */
export const markAsRead = async (req, res) => {
  const { nftTokenId, walletAddress } = req.body;

  console.log(`markAsRead: `,walletAddress);
  console.log(`NotificationId: `,nftTokenId);

  if (!nftTokenId || !walletAddress) {
    return res.status(400).json({ message: 'Notification ID and wallet address are required.' });
  }

  try {
    const notification = await notificationService.markAsRead(nftTokenId, walletAddress);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found.' });
    }
    res.status(200).json({ message: 'Notification marked as read.', notification });
  } catch (error) {
    res.status(500).json({ message: 'Failed to mark notification as read.', error: error.message });
  }
};