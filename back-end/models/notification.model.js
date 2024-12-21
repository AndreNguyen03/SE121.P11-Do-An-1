import mongoose, { Schema, Document } from 'mongoose';

// Define the Notification schema (subdocument)
const Notification = new Schema({
  nftTokenId: {
    type:String,
    required: true,
  },
  nftName: {
    type: String,
    required: true,
  },
  nftImage: {
    type: String,
    required: true,
  },
  listedBy: { type: String, required: true }, // Wallet address của người list NFT,
  listedByName: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now, // Thời điểm thông báo được tạo
  },
  isRead: {
    type: Boolean,
    default: false, // Mặc định là chưa đọc
  },
});



export default Notification;
