import express from 'express';
import * as userController from '../controllers/user.controller.js';
import { upload } from '../middlewares/multer.js';

const router = express.Router();

// Route để lưu thông tin người dùng
router.post('/upload', upload.single('image'), userController.handleCreateUser);

// Route để lấy thông tin người dùng theo địa chỉ ví
router.get('/:walletAddress', userController.handleGetUser);


router.post('/follow', userController.follow);
router.post('/unfollow', userController.unfollow);


export default router;
