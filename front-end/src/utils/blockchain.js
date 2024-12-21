import { ethers } from "ethers";
import contractABI from '../../ignition/deployments/chain-11155111/artifacts/SudokuMarketplace.json'
import { fetchImageFromIPFS } from ".";
import axiosInstance from "./axiosInstance";
const API_URL = import.meta.env.VITE_API_URL;


// Thông tin hợp đồng và ABI
const contractAddress = "0x9d06485D66B3727a1D0674862c3Fe39842D7Bba7"; // Địa chỉ hợp đồng của bạn

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

    // Lấy tất cả các tokenURI từ danh sách NFT
    const tokenURIs = await Promise.all(
      listedNFTs.map(async (nft) => {
        const tokenURI = await contract.tokenURI(nft.tokenId);
        return tokenURI;
      })
    );

    // Fetch tất cả metadata từ IPFS chỉ một lần
    const metadataArray = await fetchMetadataFromIPFS(tokenURIs);

    // Tạo mảng NFT có metadata
    const nftsWithMetadata = listedNFTs.map((nft, index) => {
      const metadata = metadataArray[index];
      return {
        tokenId: nft.tokenId.toString(),               // Chuyển tokenId thành chuỗi
        owner: nft.owner,                              // Địa chỉ ví
        price: ethers.formatEther(nft.price),    // Chuyển price từ Wei sang ETH
        isListed: nft.isListed,
        metadata: metadata,
      };
    });

    console.log('Fetched Listed NFTs:', nftsWithMetadata);
    return nftsWithMetadata;
  } catch (error) {
    console.error('Error fetching listed NFTs:', error);
    return []; // Trả về mảng rỗng nếu có lỗi
  }
}

export async function fetchMetadataFromIPFS(tokenURIs) {
  try {
    // Tạo danh sách các IPFS link của các ảnh để fetch
    const imageLinks = [];
    const metadataArray = await Promise.all(
      tokenURIs.map(async (tokenURI) => {
        const response = await axiosInstance.get(`ipfs/${tokenURI}`);
        const metadata = response.data;
        imageLinks.push(metadata.image); // Lưu tất cả các ảnh cần fetch
        return metadata;
      })
    );

    // Fetch tất cả các ảnh từ IPFS chỉ một lần
    const imageUrls = await Promise.all(imageLinks.map(fetchImageFromIPFS));

    // Gắn URL ảnh vào metadata
    imageUrls.forEach((imageUrl, index) => {
      metadataArray[index].image = imageUrl;
    });

    return metadataArray;
  } catch (error) {
    console.error('Error fetching metadata from IPFS:', error);
    return [];
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

      const response = await axiosInstance.get(`ipfs/${tokenURI}`);
      const metadata = await response.data;
      metadata.ipfsImage = metadata.image ;
      metadata.image = await fetchImageFromIPFS(metadata.image);
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

export async function fetchNFTById(tokenId) {
  try {
    // Gọi hàm getNFTById
    const nft = await contract.getNFTById(tokenId);
    console.log("NFT Info: ", nft);
    const tokenURI = await contract.tokenURI(nft.tokenId);
    const response = await axiosInstance.get(`ipfs/${tokenURI}`);
    const metadata = await response.data;
    metadata.ipfsImage = metadata.image ;
    metadata.image = await fetchImageFromIPFS(metadata.image);
    console.log(metadata)
    return {
      tokenId: nft.tokenId.toString(),               // Chuyển tokenId thành chuỗi
      owner: nft.owner,                              // Địa chỉ ví
      price: ethers.formatEther(nft.price),    // Chuyển price từ Wei sang ETH
      isListed: nft.isListed,
      metadata: metadata,
    };
    // Trả về thông tin NFT
  } catch (error) {
    console.error("Error fetching NFT:", error);
    return null;
  }
}



export const buyNFT = async (tokenId, account) => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  const contract = new ethers.Contract(contractAddress, contractABI.abi, signer);

  if (!signer || !provider || !account) {
    return { success: false, message: 'Please connect your wallet' };
  }

  try {
    // Lấy thông tin NFT từ smart contract
    const nft = await contract.getNFTById(tokenId);
    const price = BigInt(nft.price); // Chuyển giá NFT sang BigInt

    console.log('NFT Price (in Wei):', price);

    if (price <= 0) {
      return { success: false, message: 'This NFT is not for sale' };
    }

    // Chuyển giá trị NFT từ Wei sang Ether (chỉ để hiển thị)
    const priceInEther = ethers.formatEther(price.toString());
    console.log(`Price in Ether: ${priceInEther} ETH`);

    // Kiểm tra số dư ví
    const balance = BigInt(await provider.getBalance(account)); // Chuyển số dư sang BigInt
    console.log('Account Balance (in Ether):', ethers.formatEther(balance.toString()));

    if (balance < price) {
      return { success: false, message: 'Insufficient funds to buy this NFT' };
    }

    // Ước tính gas cho giao dịch
    const estimatedGas = await contract.buyNFT.estimateGas(tokenId, { value: price });
    console.log('Estimated Gas (in units):', estimatedGas.toString());

    // Lấy giá gas hiện tại (gas price)
    const feeData = await provider.getFeeData();
    const gasPrice = feeData.gasPrice || ethers.parseUnits('20', 'gwei'); // Fallback giá gas nếu không lấy được
    console.log('Gas Price (in Gwei):', ethers.formatUnits(gasPrice, 'gwei'));

    // Tính tổng phí mạng (gas cost)
    const gasCost = estimatedGas * BigInt(gasPrice); // Chuyển gasPrice sang BigInt trước khi nhân
    console.log('Total Gas Cost (in Wei):', gasCost.toString());
    console.log('Total Gas Cost (in Ether):', ethers.formatEther(gasCost.toString()));

    // Tổng chi phí giao dịch (giá NFT + phí gas)
    const totalCost = price + gasCost; // Tổng chi phí là BigInt
    console.log('Total Transaction Cost (in Ether):', ethers.formatEther(totalCost.toString()));

    // Kiểm tra nếu số dư ví không đủ để thanh toán tổng chi phí
    if (balance < totalCost) {
      return { success: false, message: `Insufficient funds. You need at least ${ethers.formatEther(totalCost.toString())} ETH` };
    }

    // Thực hiện giao dịch mua NFT
    const tx = await contract.connect(signer).buyNFT(tokenId, {
      value: price,
      gasLimit: estimatedGas, // Giới hạn gas
    });

    // Chờ giao dịch được xác nhận
    const receipt = await tx.wait();
    console.log('Transaction confirmed:', receipt);

    return { success: true, message: `Transaction successful! Hash: ${receipt.hash}`, transactionHash: receipt.hash };

  } catch (error) {
    console.error('Error buying NFT:', error);
    return { success: false, error };
  }
};



export const estimateGasForPurchase = async (tokenId, account) => {
  const provider = new ethers.BrowserProvider(window.ethereum); // Sử dụng BrowserProvider để gửi giao dịch
  const signer = await provider.getSigner();

  if (!signer || !provider || !account) {
    alert('Vui lòng kết nối ví của bạn');
    return;
  }

  try {
    const contract = new ethers.Contract(contractAddress, contractABI.abi, signer);

    // Kiểm tra xem phương thức có tồn tại không
    if (!contract.buyNFT) {
      console.error('Phương thức buyNFT không tồn tại trong hợp đồng');
      alert('Không tìm thấy phương thức buyNFT trong hợp đồng');
      return;
    }

    const nft = await contract.getNFTById(tokenId);
    const price = nft.price;

    if (price <= 0) {
      alert('NFT này không được bán');
      return;
    }

    const balance = await provider.getBalance(account);

    // Chuyển đổi balance thành BigInt và so sánh với price
    const balanceBigInt = BigInt(balance);  // Chuyển đổi balance thành BigInt
    const priceBigInt = BigInt(price);      // Chuyển đổi price thành BigInt

    if (balanceBigInt < priceBigInt) {  // So sánh balance với price
      alert('Không đủ tiền');
      return;
    }

    // Ước tính gas cho giao dịch mua NFT
    // Ước tính gas cho giao dịch
    const estimatedGas = await contract.buyNFT.estimateGas(tokenId, { value: price });
    console.log('Estimated Gas (in units):', estimatedGas.toString());

    // Lấy giá gas hiện tại (gas price)
    const feeData = await provider.getFeeData();
    const gasPrice = feeData.gasPrice || ethers.parseUnits('20', 'gwei'); // Fallback giá gas nếu không lấy được
    console.log('Gas Price (in Gwei):', ethers.formatUnits(gasPrice, 'gwei'));

    // Tính tổng phí mạng (gas cost)
    const gasCost = estimatedGas * BigInt(gasPrice); // Chuyển gasPrice sang BigInt trước khi nhân
    console.log('Total Gas Cost (in Wei):', gasCost.toString());
    console.log('Total Gas Cost (in Ether):', ethers.formatEther(gasCost.toString()));

    // Tổng chi phí giao dịch (giá NFT + phí gas)
    const totalCost = price + gasCost; // Tổng chi phí là BigInt
    console.log('Tổng chi phí giao dịch (bao gồm phí gas):', ethers.formatEther(totalCost.toString()));

    // Trả về tổng chi phí giao dịch (bao gồm phí gas)
    return ethers.formatEther(totalCost.toString());

  } catch (error) {
    console.error('Lỗi ước tính gas:', error);
    alert('Không thể ước tính gas');
  }
};