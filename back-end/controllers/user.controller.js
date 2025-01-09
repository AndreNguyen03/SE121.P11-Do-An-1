import * as userService from '../services/user.service.js';

export const handleCreateUser = async (req, res) => {
  try {
    const { name, walletAddress } = req.body;

    console.log(req.body, req.file);

    if (!name || !walletAddress) {
      return res.status(400).json({ message: 'Vui lòng nhập đủ thông tin!' });
    }

    const user = await userService.createUser({
      name,
      walletAddress,
      imagePath: req.file?.path || null, // Nếu không có file tải lên, để null.
    });

    res.status(201).json({ message: 'Lưu thông tin thành công!', user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export const handleGetUser = async (req, res) => {
  try {
    const { walletAddress } = req.params;

    const user = await userService.getUserByWalletAddress(walletAddress);
    console.log(user);

    res.status(200).json({ user });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};


export const follow = async (req, res) => {
  try {
    const { followerAddress, followeeAddress } = req.body;
    const response = await userService.followUser(followerAddress, followeeAddress);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const unfollow = async (req, res) => {
  try {
    const { followerAddress, followeeAddress } = req.body;
    const response = await userService.unfollowUser(followerAddress, followeeAddress);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const handleGetUserActionHistory = async (req, res) => {
  try {
    const { walletAddress } = req.params;

    // Gọi service để lấy lịch sử hoạt động
    const actionHistory = await userService.getUserActionHistory(walletAddress);

    res.status(200).json({ message: 'Lấy lịch sử thành công!', actionHistory });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const handleUpdateUser = async (req, res) => {
  try {
    const { walletAddress, name } = req.body;

    if (!walletAddress || !name) {
      return res.status(400).json({ message: 'Vui lòng nhập đủ thông tin!' });
    }

    const imagePath = req.file?.path || null; // Nếu có file tải lên thì dùng, nếu không giữ nguyên
    const updatedUser = await userService.updateUser({
      walletAddress,
      name,
      imagePath,
    });

    res.status(200).json({ message: 'Cập nhật thông tin thành công!', user: updatedUser });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export async function handleAddFavorite(req, res) {
  const { userAddress, tokenId } = req.body;
  console.log(`favoriteeeeeeeee::::`,userAddress, tokenId)
  try {
    const result = await userService.addFavorite({userAddress, tokenId});
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function handleRemoveFavorite(req, res) {
  const { userAddress, tokenId } = req.body;

  try {
    const result = await userService.removeFavorite(userAddress, tokenId);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function handleGetFavorites(req, res) {
  const { userAddress } = req.params;

  try {
    const favorites = await userService.getFavorites(userAddress);
    res.status(200).json(favorites);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}