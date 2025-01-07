import {ethers } from 'ethers';
import NFT from '../models/nft.model.js'
import contractAbi from './SquishySouls.json' assert { type: 'json' };
import dotenv from 'dotenv';

dotenv.config();

// Contract NFT
const contractAddressNFT = "0x99dcD520A079782aFd724460d46cc19D88f96a63";
const provider = new ethers.providers.WebSocketProvider(`wss://eth-sepolia.g.alchemy.com/v2/Eph0R-WvjfUOjGpRYrrn1GuPZidkNSNf`);
const nftContract = new ethers.Contract(contractAddressNFT, contractAbi.abi, provider);

// Fetch metadata từ tokenURI
const fetchMetadata = async (tokenURI) => {
  try {

    if (tokenURI.startsWith("ipfs://")) {
        tokenURI = tokenURI.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/");
      }

    console.log(`TokenURI ::: `,tokenURI)
    const response = await fetch(tokenURI);
    if (!response.ok) throw new Error(`Failed to fetch metadata from ${tokenURI}`);
    return await response.json();
  } catch (error) {
    console.error("Lỗi khi fetch metadata:", error);
    return null;
  }
};

// Lắng nghe sự kiện Transfer
export const listenToTransfers = () => {
  nftContract.on("Transfer", async (from, to, tokenId) => {
    console.log(`Transfer detected: TokenID ${tokenId} from ${from} to ${to}`);

    if (from === ethers.constants.AddressZero) {
      // Nếu đây là sự kiện mint
      try {
        const tokenURI = await nftContract.tokenURI(tokenId);
        const metadata = await fetchMetadata(tokenURI);

        // Lưu vào database
        const nftData = {
          tokenId: tokenId.toString(),
          ownerAddress: to.toLowerCase(),
          tokenURI,
          metadata,
          created: new Date(), 
          createdBy: to.toLowerCase(), 
          isListed: false,
        };

        await NFT.updateOne(
          { tokenId: nftData.tokenId },
          nftData,
          { upsert: true } // Thêm mới nếu chưa tồn tại
        );

        console.log(`NFT với tokenId ${tokenId} đã được lưu.`);
      } catch (error) {
        console.error(`Lỗi khi xử lý tokenId ${tokenId}:`, error);
      }
    }
  });
};

