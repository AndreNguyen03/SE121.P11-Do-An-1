import { createUser, getUserByWalletAddress } from '../services/user.service.js';

export const handleCreateUser = async (req, res) => {
  try {
    const { name, walletAddress } = req.body;

    console.log(req.body, req.file);

    if (!name || !walletAddress || !req.file) {
      return res.status(400).json({ message: 'Vui lòng nhập đủ thông tin!' });
    }

    const user = await createUser({
      name,
      walletAddress,
      imagePath: req.file.path,
    });

    res.status(201).json({ message: 'Lưu thông tin thành công!', user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const handleGetUser = async (req, res) => {
  try {
    const { walletAddress } = req.params;

    const user = await getUserByWalletAddress(walletAddress);
    console.log(user);

    res.status(200).json({ user });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
