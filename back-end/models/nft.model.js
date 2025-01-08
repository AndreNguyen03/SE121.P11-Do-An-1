"use strict";

import { Schema, model } from 'mongoose';

const nftSchema = new Schema(
  {
    tokenId: { type: Number, required: true, unique: true }, // ID của NFT
    ownerAddress: { type: String, required: true },
    tokenURI: { type: String, required: true }, // Link metadata của NFT
    metadata: {
      name: { type: String },
      description: { type: String },
      image: { type: String }, // Link hình ảnh NFT
      attributes: { type: Array }, // Thuộc tính (traits) của NFT
    },
    created: { type: Date, default: Date.now }, // Thời điểm NFT được tạo ra (mint)
    createdBy: { type: String, required: true },
    isListed: { type: Boolean, default: false }, // NFT có đang được niêm yết để bán không?
    price: { type: String }, // Giá NFT (nếu có, chỉ khi niêm yết)
    listedAt: { type: Date }, // Thời gian NFT được niêm yết trên marketplace
  },
  { timestamps: true } // Tự động thêm createdAt và updatedAt
);

const NFT = model("NFT", nftSchema);

export default NFT;
