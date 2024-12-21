import mongoose, { Schema, Document } from 'mongoose';
import Notification from './notification.model.js';

// Define the User schema
const User = new Schema(
  {
    name: {
      type: String,
      default: '', // Nếu không có, sẽ để trống
      trim: true, // Tự động xóa khoảng trắng ở đầu/cuối
    },
    image: {
      type: String,
      default: 'http://localhost:3056/uploads/default.png', // Nếu không có, sẽ lấy file default
    },
    walletAddress: {
      type: String,
      required: true, // Bắt buộc nhập
      unique: true, // Đảm bảo không trùng lặp
      trim: true, // Tự động xóa khoảng trắng
    },
    followedUsers: [{ type: String }],
    notifications: [Notification], // Thêm mảng thông báo
  },
  {
    timestamps: true, // Tự động thêm `createdAt` và `updatedAt`
  }
);

// Create the User model
const user = mongoose.model('User', User);

export default user;
