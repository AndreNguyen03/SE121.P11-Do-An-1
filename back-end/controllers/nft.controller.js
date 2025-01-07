import { getUserNFTsWithListedStatus } from "../services/nft.service.js";

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
