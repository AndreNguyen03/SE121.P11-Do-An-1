import { ethers } from "ethers";
import contractABI from '../../ignition/deployments/chain-11155111/artifacts/SudokuMarketplace.json'
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

// Thông tin hợp đồng và ABI
const contractAddress = "0x79EDD55C1d4bd602F560D44ebc630abcD86c8D6c"; // Địa chỉ hợp đồng của bạn


const provider = new ethers.JsonRpcProvider(API_URL);

// Tạo đối tượng contract
const contract = new ethers.Contract(contractAddress, contractABI.abi, provider);

export const mintNFTOnBlockchain = async (metadataURI) => {
  // Kết nối với provider và hợp đồng

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(contractAddress, contractABI.abi, signer);

  // Lấy phí mint từ hợp đồng
  const mintFee = await contract.getMintFee();
  console.log("Phí mint: ", mintFee, "ETH");

  try {
    // Gọi hàm mintNFT từ hợp đồng
    const tx = await contract.mintNFT(metadataURI, {
      value: mintFee // Thanh toán phí mint
    });

    console.log("Đang gửi giao dịch...", tx.hash);

    // Chờ giao dịch được xác nhận
    await tx.wait();

    console.log("NFT đã được mint thành công! Giao dịch hash:", tx.hash);
  } catch (error) {
    console.error("Có lỗi khi mint NFT:", error);
  }
};

export async function fetchAllListedNFTs() {
  try {
    // Gọi hàm getAllListedNFTs từ smart contract
    const listedNFTs = await contract.getAllListedNFTs();

    // Chuyển đổi dữ liệu Proxy thành mảng đối tượng thông thường
    const nftsWithMetadata = await Promise.all(
      listedNFTs.map(async (nft) => {
        const tokenURI = await contract.tokenURI(nft.tokenId);
        console.log(tokenURI);
        const response = await axios.get(`https://ipfs.io/ipfs/${tokenURI}`)
        const metadata = await response.data;
        console.log(metadata)
        return {
          tokenId: nft.tokenId.toString(),               // Chuyển tokenId thành chuỗi
          owner: nft.owner,                              // Địa chỉ ví
          price: ethers.formatEther(nft.price),    // Chuyển price từ Wei sang ETH
          isListed: nft.isListed,
          metadata: metadata,
        };
      })
    );

    console.log('Fetched Listed NFTs:', nftsWithMetadata);
    return nftsWithMetadata;
  } catch (error) {
    console.error('Error fetching listed NFTs:', error);
    return []; // Trả về mảng rỗng nếu có lỗi
  }
}


export async function fetchUserNFTs(userAddress) {

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(contractAddress, contractABI.abi, signer);

  const userNFTs = await contract.getUserNFTs(userAddress);

  console.log(userNFTs);

  const nftsWithMetadata = await Promise.all(
    userNFTs.map(async (nft) => {
      const tokenURI = await contract.tokenURI(nft.tokenId);
      console.log(tokenURI);
      const response = await axios.get(`https://ipfs.io/ipfs/${tokenURI}`)
      const metadata = await response.data;
      console.log(metadata)
      return {
        tokenId: nft.tokenId.toString(),               // Chuyển tokenId thành chuỗi
        owner: nft.owner,                              // Địa chỉ ví
        price: ethers.formatEther(nft.price),    // Chuyển price từ Wei sang ETH
        isListed: nft.isListed,
        metadata: metadata,
      };
    })
  );

  return nftsWithMetadata;
}


export async function listNFT(tokenId, price) {
  if (!window.ethereum) {
    console.error("MetaMask is not installed!");
    return;
  }

  // Kết nối với provider và signer
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(contractAddress, contractABI.abi, signer);

  try {
    // Gọi hàm listNFT trên hợp đồng
    const tx = await contract.listNFT(tokenId, ethers.parseEther(price.toString()));
    console.log("Transaction sent:", tx);
    
    // Đợi giao dịch được confirm
    await tx.wait();
    console.log("Transaction confirmed:", tx);
  } catch (error) {
    console.error("Error listing NFT:", error);
  }
}