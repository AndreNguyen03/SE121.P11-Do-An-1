import user from '../models/user.model.js';
import path from 'path';
import actionHistory from '../models/actionHistory.model.js';

export const createUser = async ({ name, walletAddress, imagePath }) => {
  const existingUser = await user.findOne({ walletAddress });
  if (existingUser) {
    throw new Error('Địa chỉ ví đã tồn tại!');
  }

  const imageUrl = imagePath
    ? `http://localhost:3056/uploads/${path.basename(imagePath)}`
    : `http://localhost:3056/uploads/default.png`; // Avatar mặc định nếu không có file tải lên.

  console.log(imageUrl);

  const newUser = new user({
    name,
    walletAddress,
    image: imageUrl,
  });

  return await newUser.save();
};


export const getUserByWalletAddress = async (walletAddress) => {
  if (!walletAddress) {
    throw new Error('Wallet address is required');
  }
  const getUser = await user.findOne({ walletAddress: walletAddress.toLowerCase() });
  console.log(getUser);
  if (!getUser) {
    throw new Error('Không tìm thấy người dùng!');
  }
  return getUser;
};


export const followUser = async (followerAddress, followeeAddress) => {
  const followee = await user.findOne({ walletAddress: followeeAddress });
  if (!followee) throw new Error('User to follow not found');

  await user.updateOne(
    { walletAddress: followerAddress },
    { $addToSet: { followedUsers: followeeAddress } } // Tránh duplicate
  );

  return { message: `You are now following ${followee.username}` };
};

/**
 * Unfollow một người dùng.
 */
export const unfollowUser = async (followerAddress, followeeAddress) => {
  await user.updateOne(
    { walletAddress: followerAddress },
    { $pull: { followedUsers: followeeAddress } } // Xóa followeeAddress
  );

  return { message: `You unfollowed ${followeeAddress}` };
};

export const getUserActionHistory = async (walletAddress) => {
  try {
    // Kiểm tra xem user có tồn tại không
    const getuser = await user.findOne({ walletAddress });
    if (!getuser) {
      throw new Error('Người dùng không tồn tại!');
    }

    // Tìm kiếm lịch sử hoạt động theo `by` (user thực hiện hành động)
    const getactionHistory = await actionHistory.find({ by: walletAddress }).sort({ timestamp: -1 });
    return getactionHistory || [];

  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateUser = async ({ walletAddress, name, imagePath }) => {
  if (!walletAddress) {
    throw new Error('Wallet address is required');
  }

  const existingUser = await user.findOne({ walletAddress });
  if (!existingUser) {
    throw new Error('Người dùng không tồn tại!');
  }

  const updatedData = { name };
  if (imagePath) {
    updatedData.image = `http://localhost:3056/uploads/${path.basename(imagePath)}`;
  }

  const updatedUser = await user.findOneAndUpdate(
    { walletAddress },
    { $set: updatedData },
    { new: true }
  );

  return updatedUser;
};

export const getAllUsers = async () => {
  try {
    const users = await user.find({}, { password: 0 }); // Bỏ trường `password`
    return users;
  } catch (error) {
    throw new Error('Lỗi khi lấy danh sách người dùng: ' + error.message);
  }
};
