import user from '../models/user.model.js';
import path from 'path';

export const createUser = async ({ name, walletAddress, imagePath }) => {
  const existingUser = await user.findOne({ walletAddress });
  if (existingUser) {
    throw new Error('Địa chỉ ví đã tồn tại!');
  }

  const imageUrl = `http://localhost:3056/uploads/${path.basename(imagePath)}`;

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
  const getUser = await user.findOne({ walletAddress : walletAddress.toLowerCase() });
  console.log(getUser);
  if (!getUser) {
    throw new Error('Không tìm thấy người dùng!');
  }
  return getUser;
};