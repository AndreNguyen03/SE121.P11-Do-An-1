import express from 'express';
import * as notificationController from '../controllers/notification.controller.js';

const router = express.Router();
router.get('/:walletAddress', notificationController.getNotifications);
router.post('/markAllAsRead', notificationController.markAllAsRead);
router.post('/markAsRead', notificationController.markAsRead);

export default router;
