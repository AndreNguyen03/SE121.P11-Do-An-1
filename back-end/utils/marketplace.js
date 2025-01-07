import { ethers } from "ethers";
import dotenv from "dotenv";
import marketplaceAbi from './Marketplace.json' assert { type: 'json' };
dotenv.config();

const contractAddressMarketplace = "0xB7C4D080582D8DCcfE3eD52E37389F70677b7e21";
const provider = new ethers.providers.JsonRpcProvider(`https://${process.env.ALCHEMY_URL}`);
const marketplaceContract = new ethers.Contract(contractAddressMarketplace, marketplaceAbi.abi, provider);

// Hàm kiểm tra trạng thái listed
export const checkListedStatus = async (tokenId) => {
  try {
    const listing = await marketplaceContract.listings(tokenId); // Gọi hàm "listings" từ contract
    return listing.isListed; // Trả về trạng thái niêm yết
  } catch (error) {
    console.error(`Lỗi khi kiểm tra trạng thái listed cho tokenId ${tokenId}:`, error);
    return false;
  }
};
