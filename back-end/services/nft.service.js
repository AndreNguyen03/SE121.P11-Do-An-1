import NFT from "../models/nft.model.js";

export const getUserNFTsWithListedStatus = async (ownerAddress) => {
    try {
        const nfts = await NFT.find({ ownerAddress });
        return nfts;
    } catch (error) {
        throw new Error(`Lỗi khi lấy NFT: ${error.message}`);
    }
};
