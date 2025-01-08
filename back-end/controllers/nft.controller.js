import { getUserNFTsWithListedStatus, getNFTByTokenId, getAllNFT } from "../services/nft.service.js";

export const getUserNFTs = async (req, res) => {
    try {
        const ownerAddress = req.params.ownerAddress.toLowerCase();
        const nfts = await getUserNFTsWithListedStatus(ownerAddress);
        res.json(nfts);
    } catch (error) {
        console.error("Lỗi khi lấy NFT:", error);
        res.status(500).send("Lỗi khi lấy NFT");
    }
};

export const getNFT = async (req, res) => {
    const { tokenId } = req.params;

    console.log(`server receive:::`, tokenId);
    try {
        // Lấy NFT từ service
        const nft = await getNFTByTokenId(tokenId);
        return res.status(200).json(nft);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};


export const getAllNFTMarketplace = async (req, res) => {
    try {
        const nft = await getAllNFT();
        return res.status(200).json(nft);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};