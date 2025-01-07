import { ethers } from "ethers";
import contractABINFT from '../../ignition/deployments/chain-11155111/artifacts/SquishySouls.json'
import contractABIMarketplace from '../../ignition/deployments/chain-11155111/artifacts/Marketplace.json'
import axiosInstance from "./axiosInstance";
const API_URL = import.meta.env.VITE_API_URL;


const contractAddressNFT = "0x99dcD520A079782aFd724460d46cc19D88f96a63";
const contractAddressMarketplace = "0xB7C4D080582D8DCcfE3eD52E37389F70677b7e21";

const BASE_CID_NFT = "bafybeibv4rsudbtbuyybffaqwdtn3wpxkfg4dyy33kwwzqvhexowxnwrgi";

const provider = new ethers.JsonRpcProvider(API_URL);

const contractMarketplace = new ethers.Contract(contractAddressMarketplace, contractABIMarketplace.abi, provider);

export async function mintNFT(userAddress, signer) {

  // Chọn tokenId ngẫu nhiên
  const tokenId = Math.floor(Math.random() * 100);
  const tokenURI = `ipfs://${BASE_CID_NFT}/${tokenId}.json`;

  const contractNFT = new ethers.Contract(contractAddressNFT, contractABINFT.abi, signer);

  try {
    // Gửi giao dịch mint
    const tx = await contractNFT.mint(userAddress, tokenURI);
    console.log("Mint NFT thành công! Đang chờ xác nhận:", tx.hash);

    // Chờ giao dịch hoàn tất
    const receipt = await tx.wait();
    console.log("Mint hoàn tất! Transaction Hash:", receipt);
    alert(`Mint thành công! Token ID: ${tokenId}`);
    return receipt;
  } catch (err) {
    console.error("Mint thất bại:", err);
    alert("Mint thất bại! Vui lòng thử lại.");
  }
}

export const getUserNFTs = async (userAddress, signer) => {
  if (!signer) {
    throw new Error("Signer không tồn tại!");
  }

  const contractNFT = new ethers.Contract(contractAddressNFT, contractABINFT.abi, signer);

  try {
    const balance = await contractNFT.balanceOf(userAddress);
    const userNFTs = [];

    // Lấy thông tin các token mà người dùng sở hữu
    for (let tokenId = 0; tokenId < balance; tokenId++) {
      const owner = await contractNFT.ownerOf(tokenId);
      if (owner.toLowerCase() === userAddress.toLowerCase()) {
        const tokenURI = await contractNFT.tokenURI(tokenId);
        userNFTs.push({ tokenId, tokenURI });
      }
    }

    return userNFTs;
  } catch (err) {
    console.error("Lỗi khi lấy NFT:", err);
    throw new Error("Không thể lấy NFT của người dùng.");
  }
};