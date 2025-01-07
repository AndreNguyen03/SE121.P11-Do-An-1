"use strict";

import { Schema, Document, model } from 'mongoose';

const nftSchema = new Schema({
    tokenId: { type: Number, required: true, unique: true },
    ownerAddress: { type: String, required: true },
    tokenURI: { type: String, required: true },
    metadata: {
        name: String,
        description: String,
        image: String,
        attributes: Array,
    },
    created: { type: Date, default: Date.now }, 
    createdBy: { type: String, required: true },
    isListed: { type: Boolean, default: false },
}, { timestamps: true });

const NFT = model("NFT", nftSchema);

export default NFT;
