import express from "express";
import { getAllNFTMarketplace, getNFT, getUserNFTs } from "../controllers/nft.controller.js";

const router = express.Router();

// Route lấy danh sách NFT của người dùng
router.get("/user-nfts/:ownerAddress", getUserNFTs);

router.get('/:tokenId', getNFT);

router.get('/', getAllNFTMarketplace);

export default router;
