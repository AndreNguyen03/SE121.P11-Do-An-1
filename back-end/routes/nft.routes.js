import express from "express";
import { getUserNFTs } from "../controllers/nft.controller.js";

const router = express.Router();

// Route lấy danh sách NFT của người dùng
router.get("/user-nfts/:ownerAddress", getUserNFTs);

export default router;
