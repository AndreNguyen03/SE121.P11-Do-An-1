import express from 'express';
import { handleCreateUser, handleGetUser } from '../controllers/user.controller.js';
import { upload } from '../middlewares/multer.js';

const router = express.Router();

// Route để lưu thông tin người dùng
router.post('/upload', upload.single('image'), handleCreateUser);

// Route để lấy thông tin người dùng theo địa chỉ ví
router.get('/:walletAddress', handleGetUser);

export default router;
