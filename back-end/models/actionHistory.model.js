"use strict";

import { Schema, Document, model } from 'mongoose';

const actionHistorySchema = new Schema({
    tokenId: { type: String, required: true },
    action: {
        type: String,
        enum: ['mint', 'list', 'buy', 'cancel', 'transfer'],
        required: true,
    },
    by: { type: String, required: true }, // Người thực hiện thao tác
    to: { type: String }, // Địa chỉ nhận (nếu có)
    price: { type: String }, // Giá (nếu có)
    timestamp: { type: Date, default: Date.now },
},
    { timestamps: true }
);

const ActionHistory = model('ActionHistory', actionHistorySchema);
export default ActionHistory;