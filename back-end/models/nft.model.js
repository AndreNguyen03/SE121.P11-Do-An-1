"use strict";

import { Schema, model } from 'mongoose';

const nftSchema = new Schema(
  {
    tokenId: { type: Number, required: true, unique: true }, 
    ownerAddress: { type: String, required: true },
    tokenURI: { type: String, required: true }, 
    metadata: {
      name: { type: String },
      description: { type: String },
      image: { type: String }, 
      attributes: { type: Array }, 
    },
    created: { type: Date, default: Date.now }, 
    createdBy: { type: String, required: true },
    isListed: { type: Boolean, default: false }, 
    price: { type: String }, 
    listedAt: { type: Date }, 
    favoritesCount: {
      type: Number,
      default: 0, 
    },
  },
  { timestamps: true }
);

const NFT = model("NFT", nftSchema);

export default NFT;
