import React, { useState, useEffect } from "react";
import Layout from "../components/layout/Layout";
import nft1 from "../assets/1.png";
import nft2 from "../assets/2.png";
import nft3 from "../assets/3.png";
import nft5 from "../assets/5.png";
import nft6 from "../assets/6.png";
import nft7 from "../assets/7.png";
import nft8 from "../assets/8.png";
import { useWalletContext } from "../context/WalletContext";
import { mintNFT, mintBatchNFT, getRemainingTokens, getUserMintedCount, parseMintLogs, fetchMetadata } from "../utils/contract";
import MintSuccessModal from "./MintSuccessModal";
import MintingModal from "./MintingModal";
import { FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";

function Create() {
  const { account, signer, provider } = useWalletContext();
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [remainingSupply, setRemainingSupply] = useState(0);
  const [mintedCount, setMintedCount] = useState(0);
  const [userMintLimit, setUserMintLimit] = useState(5); // Giới hạn NFT mỗi user có thể mint
  const [isMinting, setIsMinting] = useState(false); // Trạng thái mở modal đang mint
  const [isMintSuccess, setIsMintSuccess] = useState(false); // Trạng thái mở modal mint thành công
  const [mintedNFTs, setMintedNFTs] = useState([]); // Danh sách NFT đã mint

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const imageUrls = [
    nft1,
    nft2,
    nft3,
    nft5,
    nft6,
    nft7,
    nft8,
  ];

  // Fetch dữ liệu từ contract khi component được render
  useEffect(() => {
    if (!account) return;

    const fetchData = async () => {
      try {
        const remaining = await getRemainingTokens();
        const userMinted = await getUserMintedCount(account);

        setRemainingSupply(remaining);
        setMintedCount(userMinted);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu từ contract:", err);
        setError("Không thể tải dữ liệu NFT.");
      }
    };

    fetchData();
  }, [account]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageUrls.length);
    }, 1500); // Change image every 3 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [imageUrls]);

  // Xử lý mint NFT
  const handleMint = async () => {
    if (!signer) {
      setError("Vui lòng kết nối ví trước khi mint.");
      return;
    }

    if (quantity > remainingSupply) {
      setError("Không đủ NFT để mint số lượng này.");
      return;
    }

    if (quantity + mintedCount > userMintLimit) {
      setError("Số lượng mint vượt quá giới hạn của bạn.");
      return;
    }

    setError(null);
    setIsMinting(true); // Mở modal đang mint

    try {
      const mintedNFTList = []; // Lưu danh sách NFT đã mint thực tế

      if (quantity === 1) {
        // Mint 1 NFT
        const receipt = await mintNFT(account, signer);
        console.log(`Receipt:`, receipt);

        // Parse logs để lấy thông tin tokenId và tokenURI
        const mintedNFTs = parseMintLogs(receipt);

        for (const { tokenId, tokenURI } of mintedNFTs) {
          const metadata = await fetchMetadata(tokenURI);
          if (metadata) {
            mintedNFTList.push({
              tokenId,
              tokenURI,
              image: metadata.image,
            });
          }
        }
      } else {
        const receipt = await mintBatchNFT(account, signer, quantity);
       
        console.log(`Receipt:`, receipt);

        const mintedNFTs = parseMintLogs(receipt);

        for (const { tokenId, tokenURI } of mintedNFTs) {
          const metadata = await fetchMetadata(tokenURI);
          if (metadata) {
            mintedNFTList.push({
              tokenId,
              tokenURI,
              image: metadata.image,
            });
          }
        }
      }

      setMintedNFTs(mintedNFTList); // Lưu danh sách NFT đã mint
      setIsMinting(false);
      setIsMintSuccess(true);
    } catch (err) {
      console.log("Mint thất bại:", err);
      if (err.info.error.code === 4001) {
        toast.info("User denied transaction signature! .");
      }
      setError("Mint thất bại. Vui lòng thử lại.");
      setIsMinting(false);
    }



  };

  // Tăng số lượng NFT muốn mint
  const increaseQuantity = () => {
    if (quantity < userMintLimit - mintedCount && quantity < remainingSupply) {
      setQuantity(quantity + 1);
    }
  };

  // Giảm số lượng NFT muốn mint
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <Layout className="flex justify-center items-center flex-col">
      <div className="flex flex-col gap-7 items-center justify-around rounded-sm min-h-[800px]">
        <h2 className="text-6xl mt-[50px]">FreeMint is Live</h2>

        <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col md:flex-row items-center max-w-[1000px] w-full mb-[70px]">
          {/* Left Section: Image */}
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="relative">
              <img
                src={imageUrls[currentImageIndex]} // Dynamic image source
                alt="NFT Preview"
                className="rounded-lg w-full h-auto transition-opacity duration-500"
              />
              <span className="absolute top-2 left-2 bg-black bg-opacity-80 text-white px-3 py-1 text-lg rounded-md">
                {remainingSupply} / 100
              </span>
            </div>
          </div>

          {/* Right Section: Mint Details */}
          <div className="h-[463px] w-full md:w-1/2 mt-6 md:mt-0 md:ml-6 flex flex-col justify-between">
            <h2 className="text-3xl font-bold text-center">Claim Your NFT</h2>
            <div className="flex items-center justify-between space-x-4 mt-6">
              <button
                onClick={decreaseQuantity}
                className="w-16 h-10 flex items-center justify-center bg-gray-700 text-white rounded-md text-2xl font-bold hover:bg-gray-600"
              >
                -
              </button>
              <span className="text-2xl font-semibold">{quantity}</span>
              <button
                onClick={increaseQuantity}
                className="w-16 h-10 flex items-center justify-center bg-gray-700 text-white rounded-md text-2xl font-bold hover:bg-gray-600"
              >
                +
              </button>
            </div>
            <p className="mt-6 text-xl border-t border-b border-gray-600 py-2 flex justify-between w-full">
              <span className="font-semibold">You minted: {mintedCount}/{userMintLimit}</span>
              <span>Max Mint Amount: {userMintLimit}</span>
            </p>
            {error && <p className="text-red-600 text-center mt-2">{error}</p>}
            <button
              onClick={handleMint}
              className="mt-6 px-8 py-3 bg-purple-700 rounded-md font-bold text-xl text-white hover:bg-purple-600 transition duration-300 text-center"
              disabled={quantity === 0 || remainingSupply === 0}
            >
              {isMinting ? (
                <FaSpinner className="animate-spin m-auto h-8 w-8 " />
              ) : (
                'MINT'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Modal đang mint */}
      <MintingModal isOpen={isMinting} onClose={() => setIsMinting(false)} />

      {/* Modal mint thành công */}
      <MintSuccessModal
        isOpen={isMintSuccess}
        onClose={() => setIsMintSuccess(false)}
        mintedNFTs={mintedNFTs}
      />
    </Layout>
  );
}

export default Create;
