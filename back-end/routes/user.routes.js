import express from 'express';
import * as userController from '../controllers/user.controller.js';
import { upload } from '../middlewares/multer.js';

const router = express.Router();

// Route để lưu thông tin người dùng
router.post('/upload', upload.single('image'), userController.handleCreateUser);
router.post('/update', upload.single('image'), userController.handleUpdateUser);

router.get('/', userController.handleGetAllUsers);
// Route để lấy thông tin người dùng theo địa chỉ ví
router.get('/:walletAddress', userController.handleGetUser);


router.post('/follow', userController.follow);
router.post('/unfollow', userController.unfollow);

router.get('/actionhistories/:walletAddress', userController.handleGetUserActionHistory);

router.post('/add-favorite', userController.handleAddFavorite);
router.post('/remove-favorite', userController.handleRemoveFavorite);
router.get('/favorite/:userAddress', userController.handleGetFavorites);


export default router;
