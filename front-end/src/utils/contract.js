import { BrowserProvider, ethers } from "ethers";
import contractABINFT from '../../ignition/deployments/chain-11155111/artifacts/SquishySouls.json'
import contractABIMarketplace from '../../ignition/deployments/chain-11155111/artifacts/Marketplace.json'
import axiosInstance from "./axiosInstance";
const API_URL = import.meta.env.VITE_API_URL;


const contractAddressNFT = "0x44eCdFA2204Fc4a9c3e8ee8c4cFaa7392aB9cc74";
const contractAddressMarketplace = "0x81936Ef8ED97A08aD4867b1cDf48A895F8b7e210";

const BASE_CID_NFT = "bafybeibv4rsudbtbuyybffaqwdtn3wpxkfg4dyy33kwwzqvhexowxnwrgi";


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


export const buyNFT = async (tokenId, price, signer) => {
  try {
    const contract = new ethers.Contract(contractAddressMarketplace, contractABIMarketplace.abi, signer);
    
    const tx = await contract.buyItem(tokenId, {
      value: ethers.parseEther(price.toString()), 
    });

    const receipt = await tx.wait();
    return receipt;
  } catch (error) {
    console.error("Error while buying NFT:", error);
    throw error;
  }
};

export async function cancelListing(tokenId, signer) {
  if (!signer) {
    throw new Error("Signer không tồn tại!");
  }

  const contract = new ethers.Contract(contractAddressMarketplace, contractABIMarketplace.abi, signer);

  try {
    const tx = await contract.cancelListing(tokenId);
    console.log("Hủy listing thành công! Đang chờ xác nhận:", tx.hash);

    // Chờ giao dịch hoàn tất
    const receipt = await tx.wait();
    return receipt;
  } catch (err) {
    console.error("Hủy listing thất bại:", err);
  }
}

// Hàm lấy tất cả các item đang được niêm yết
export const getAllListedItems = async () => {
  try {
    const contract = new ethers.Contract(contractAddressMarketplace, contractABIMarketplace.abi, provider);
    const [tokenIds, prices] = await contract.getAllListedItems();

    const items = tokenIds.map((tokenId, index) => ({
      tokenId,
      price: ethers.formatEther(prices[index]), // Chuyển đổi từ Wei sang Ether nếu cần
    }));

    return items;
  } catch (err) {
    console.error("Lỗi khi lấy các item đang niêm yết:", err);
    throw new Error("Không thể lấy các item đang niêm yết.");
  }
};





export async function approveNFT() {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const nftContract = new ethers.Contract(contractAddressNFT, contractABINFT.abi, signer);

    // Kiểm tra xem NFT đã được phê duyệt cho marketplace chưa
    const isApproved = await nftContract.isApprovedForAll(await signer.getAddress(), contractAddressMarketplace);
    console.log('isApproved:', isApproved);

    if (isApproved) {
      console.log('NFT already approved for Marketplace');
      return true; // Không cần phê duyệt lại
    }

    // Phê duyệt tất cả NFT của người dùng cho marketplace
    const approveTx = await nftContract.setApprovalForAll(contractAddressMarketplace, true);
    console.log('Approve Transaction Hash:', approveTx.hash);

    await approveTx.wait();
    console.log('NFT approved successfully');
    return true;
  } catch (error) {
    console.error('Error approving NFT:', error);
    return false;
  }
}




export async function listNFT(tokenId, price) {
  if (!window.ethereum) {
    alert('Please install MetaMask');
    return false;
  }

  try {
    // Kết nối ví
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    // Kết nối tới contract NFT và Marketplace
    const nftContract = new ethers.Contract(contractAddressNFT, contractABINFT.abi, signer);
    const marketplaceContract = new ethers.Contract(contractAddressMarketplace, contractABIMarketplace.abi, signer);

    // Kiểm tra quyền sở hữu NFT
    const owner = await nftContract.ownerOf(tokenId);
    const userAddress = await signer.getAddress();
    if (owner.toLowerCase() !== userAddress.toLowerCase()) {
      console.error('NFT ownership mismatch:', { owner, userAddress });
      return false;
    }

    // Kiểm tra trạng thái niêm yết
    const listing = await marketplaceContract.listings(tokenId); // Cần bổ sung hàm `isListed` trong contract
    const isListed = listing[2];
    if (isListed) {
      console.error('NFT already listed:', tokenId);
      return false;
    }

    // Chuyển giá sang Wei
    const priceInWei = ethers.parseEther(price.toString());
    console.log('Price in Wei:', priceInWei);

    // Gọi lệnh listItem để niêm yết NFT
    const listTx = await marketplaceContract.listItem(tokenId, priceInWei);
    console.log('Transaction Hash:', listTx.hash);

    await listTx.wait(); // Đợi giao dịch hoàn thành
    return true;
  } catch (error) {
    console.error('Error listing NFT:', error.message);
    return false;
  }
}
