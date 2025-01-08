import NFT from "../models/nft.model.js";

export const getUserNFTsWithListedStatus = async (ownerAddress) => {
    try {
        const nfts = await NFT.find({ ownerAddress });
        return nfts;
    } catch (error) {
        throw new Error(`Lỗi khi lấy NFT: ${error.message}`);
    }
};

export const getNFTByTokenId = async (tokenId) => {
    try {
        const nft = await NFT.findOne({ tokenId }).exec();
        if (!nft) {
            throw new Error('NFT not found');
        }
        return nft;
    } catch (error) {
        throw new Error(`Error fetching NFT: ${error.message}`);
    }
};

export const getAllNFT = async () => {
    try {
        const nft = await NFT.find({}).exec();
        if (!nft) {
            throw new Error('NFT not found');
        }
        return nft;
    } catch (error) {
        throw new Error(`Error fetching NFT: ${error.message}`);
    }
};