import { BrowserProvider, ethers, Interface } from "ethers";
import contractABINFT from '../../ignition/deployments/chain-11155111/artifacts/SquishySouls.json'
import contractABIMarketplace from '../../ignition/deployments/chain-11155111/artifacts/Marketplace.json'
import axiosInstance from "./axiosInstance";




const contractAddressNFT = "0x513Ae2fAD04819ad12acb71b5D5998080DD6D478";
const contractAddressMarketplace = "0x6dbB51Eee7dcAd3109755CdB6F13B2625607122A";



export async function mintNFT(userAddress, signer) {
  const contractNFT = new ethers.Contract(contractAddressNFT, contractABINFT.abi, signer);

  try {
    // Gọi hàm mint
    const tx = await contractNFT.mint(userAddress);
    console.log("Mint NFT thành công! Đang chờ xác nhận:", tx.hash);

    // Chờ giao dịch hoàn tất
    const receipt = await tx.wait();
    console.log("Mint hoàn tất! Transaction Hash:", receipt.transactionHash);

    return receipt;
  } catch (err) {
    console.error("Mint thất bại:", err);
    throw err;
  }
}

export async function mintBatchNFT(userAddress, signer, quantity) {
  const contractNFT = new ethers.Contract(contractAddressNFT, contractABINFT.abi, signer);

  try {
    // Gọi hàm mintBatch
    const tx = await contractNFT.mintBatch(userAddress, quantity);
    console.log(`Minting ${quantity} NFTs... Transaction Hash:`, tx.hash);

    // Chờ giao dịch hoàn tất
    const receipt = await tx.wait();
    console.log(`Mint ${quantity} NFTs hoàn tất! Transaction Hash:`, receipt.transactionHash);

    return receipt;
  } catch (err) {
    console.error("Mint nhiều NFT thất bại:", err);
    throw err;
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
    throw err
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

export async function getUserMintedCount(userAddress) {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const contract = new ethers.Contract(contractAddressNFT, contractABINFT.abi, provider);

  try {
    const mintedCount = await contract.getUserMintedCount(userAddress);
    console.log(`Số lượng NFT đã mint bởi ${userAddress}:`, mintedCount.toString());
    return parseInt(mintedCount.toString(), 10);
  } catch (error) {
    console.error("Lỗi khi lấy số lượng NFT đã mint:", error);
    throw error;
  }
}


export async function getRemainingTokens() {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const contract = new ethers.Contract(contractAddressNFT, contractABINFT.abi, provider);

  try {
    const remaining = await contract.getRemainingTokens();
    console.log("Số lượng NFT còn lại:", remaining.toString());
    return parseInt(remaining.toString(), 10);
  } catch (error) {
    console.error("Lỗi khi lấy số lượng NFT còn lại:", error);
    throw error;
  }
}


// Khai báo Interface cho sự kiện Mint
const mintEventInterface = new Interface([
  "event Mint(address indexed to, uint256 tokenId, string tokenURI)"
]);

export const parseMintLogs = (receipt) => {
  const mintedNFTs = []; // Lưu danh sách NFT đã mint

  receipt.logs.forEach((log) => {
    try {
      if (log.fragment && log.fragment.name === "Mint") {
        // Parse log bằng Interface
        const parsedLog = mintEventInterface.parseLog(log);

        // Lấy thông tin từ args
        const tokenId = parsedLog.args.tokenId.toString();
        const tokenURI = parsedLog.args.tokenURI;

        // Thêm thông tin vào danh sách
        mintedNFTs.push({ tokenId, tokenURI });
      }
    } catch (err) {
      // Bỏ qua log không khớp với sự kiện Mint
      console.warn("Log không khớp với sự kiện Mint:", log);
    }
  });

  return mintedNFTs; // Trả về danh sách
};
export const fetchMetadata = async (tokenURI) => {
  try {
    // Chuyển đổi IPFS URI sang HTTP nếu cần
    const resolvedURI = tokenURI.startsWith("ipfs://")
      ? tokenURI.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/")
      : tokenURI;

    // Fetch metadata từ URL
    const response = await fetch(resolvedURI);
    if (!response.ok) {
      throw new Error(`Failed to fetch metadata from ${resolvedURI}`);
    }

    return await response.json(); // Trả về metadata dưới dạng JSON
  } catch (error) {
    console.error(`Error fetching metadata from ${tokenURI}:`, error);
    return null; // Trả về null nếu có lỗi
  }
};