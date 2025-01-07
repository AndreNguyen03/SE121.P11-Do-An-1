import React, { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa"; // Sử dụng react-icons để hiển thị spinner
import Modal from "react-modal";
import Layout from "../components/layout/Layout";
import { useLocation, useNavigate } from "react-router-dom";
import { useWalletContext } from "../context/WalletContext";

// Cấu hình mặc định cho Modal
Modal.setAppElement("#root");

const NFTDetailDiscovery = () => {
  const navigate = useNavigate(); 
  const { state } = useLocation();
  const [nft, setNft] = useState(state?.nft || null);
  const { getUserInfoByWalletAddress, account, updateBalance } = useWalletContext();
  const [userInfo, setUserInfo] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [errorCode, setErrorCode] = useState(null);

  // Modal State
  const [purchaseState, setPurchaseState] = useState("pending"); // 'pending' | 'loading' | 'success' | 'error'
  const [transactionHash, setTransactionHash] = useState(null);

  // Modal xác nhận giao dịch
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Modal yêu cầu kết nối ví
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  const [estimatedGas, setEstimatedGas] = useState(null);
  const [isFullScreenSpinner, setIsFullScreenSpinner] = useState(false);
  // Fetch User Info
  useEffect(() => {
    if (!nft) {
      console.log("NFT không tồn tại.");
      return;
    }
    const fetchUser = async (address) => {
      const user = await getUserInfoByWalletAddress(address);
      setUserInfo(user?.user);
    };

    fetchUser(nft.owner);
  }, [nft, getUserInfoByWalletAddress]);

  // Xử lý mua NFT
  const handleBuyNFT = async () => {
    if (!account) {
      setIsWalletModalOpen(true); // Hiển thị modal yêu cầu kết nối ví
    } else {
      try {
        // Hiển thị spinner toàn màn hình khi đang chờ
        setIsFullScreenSpinner(true);

        // Tính toán gas ước tính
        const gas = await estimateGasForPurchase(nft.tokenId, account);
        setEstimatedGas(gas);
        setIsModalOpen(true); // Hiển thị Modal xác nhận
      } catch (error) {
        console.log("Không thể tính toán gas ước tính:", error);
      } finally {
        // Ẩn spinner sau khi tính toán xong
        setIsFullScreenSpinner(false);
      }
    }
  };

  const resetState = () => {
    setErrorMessage(null);
    setErrorCode(null);
    setPurchaseState("pending"); // Khôi phục lại trạng thái ban đầu của giao dịch
    setTransactionHash(null); // Reset transactionHash
  };

  // Xác nhận và thực hiện giao dịch
  const confirmPurchase = async () => {
    setPurchaseState("loading"); // Bắt đầu giao dịch
    try {
      const result = await buyNFT(nft.tokenId, account);
      if (result.success) {
        setTransactionHash(result.transactionHash);
        setPurchaseState("success");
        await updateBalance();
        navigate("/profile"); 
      } else {
        setPurchaseState("error");
        const { code, message } = handleTransactionError(result.error);
        console.log(result);
        console.log(code, message)
        setErrorCode(code || "UNKNOWN_ERROR");
        setErrorMessage(message || "Lỗi không xác định.");
      }
    } catch (error) {
      setPurchaseState("error");
      const { code, message } = handleTransactionError(error);
      setErrorCode(code);
      setErrorMessage(message);
      console.log(error);
    }
  };

  const handleTransactionError = (error) => {
    if (error?.code === "ACTION_REJECTED") {
      return {
        code: error.code,
        message: "Giao dịch đã bị từ chối bởi người dùng (MetaMask). Vui lòng thử lại."
      };
    }
    return {
      code: error.code || "UNKNOWN_ERROR",
      message: error.message || "Đã có lỗi xảy ra trong quá trình giao dịch."
    };
  };


  if (!nft) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Layout>
        <div className="h-full w-full flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-6xl flex flex-col md:flex-row">
            {/* Cột bên trái: Hình ảnh + Description */}
            <div className="md:w-full">
              <img
                src={nft.metadata.image}
                alt={nft.metadata.name}
                loading="lazy"
                className="w-[600px] h-[600px] object-cover rounded-lg"
              />
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Description:</h3>
                <p className="text-gray-600 mb-4">{nft.metadata.description}</p>
              </div>
            </div>

            {/* Cột bên phải: Thông tin chi tiết */}
            <div className="md:w-4/5 md:pl-6 mt-6 md:mt-0">
              <h1 className="text-3xl font-bold mb-4">{nft.metadata.name}</h1>
              <p className=" mb-2 underline text-blue-400 cursor-pointer" onClick={() => {navigate(`/profile/${nft.owner}`, {state : {owner:nft.owner,userInfo:userInfo}});}}>
                <strong>Owner:</strong> {nft.owner}
              </p>
              {/* Hiển thị User Info */}
              {userInfo && (
                <div className="flex items-center mt-4">
                  <img
                    src={userInfo.image}
                    alt={userInfo.name}
                    className="w-12 h-12 rounded-full border-2 border-gray-300"
                  />
                  <div className="ml-4">
                    <p className="text-lg font-semibold">{userInfo.name}</p>
                  </div>
                </div>
              )}
              <div className="mt-6">
                <p className="text-gray-500 mb-2">Price:</p>
                <div className="text-2xl font-semibold">{nft.price} SepETH</div>
              </div>

              {/* Nút Mua NFT */}
              {nft.owner.toLowerCase() === account ? (
                <div className="mt-6 p-3 bg-green-100 text-green-700 rounded-lg">
                  You are the owner of this NFT.
                </div>
              ) : (
                <button
                  className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300 mt-6"
                  onClick={handleBuyNFT}
                >
                  Buy Now
                </button>
              )}
            </div>
          </div>
        </div>



        {/* Modal Xác nhận giao dịch */}
        <Modal
          isOpen={isModalOpen}
          onRequestClose={() => {

          }}  // Không làm gì khi click ra ngoài
          contentLabel="Transaction Confirmation"
          className="modal bg-white rounded-lg p-6 shadow-lg max-w-lg mx-auto mt-20 relative"
          overlayClassName="overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center pointer-events-auto"  // Đảm bảo chỉ có các phần tử trong modal được click
        >
          {/* Nút "X" ở góc trên bên phải */}
          <button
            className="absolute top-2 right-2 text-2xl font-bold text-gray-600 p-1 hover:text-red-600"
            onClick={() => {
              setIsModalOpen(false);
              resetState(); // Đặt lại state khi modal bị đóng
              setIsModalOpen(false);
            }}
          >
            X
          </button>

          {/* Nội dung Modal */}
          <h2 className="text-2xl font-semibold mb-4">Xác nhận giao dịch</h2>
          {/* Thông tin giao dịch */}
          <div>
            <p><strong>Seller:</strong> {nft.owner}</p>
            <p><strong>Buyer:</strong> {account}</p>
            <p><strong>NFT:</strong> {nft.metadata.name}</p>
            <p><strong>Price:</strong> {nft.price} SepETH</p>

            {/* Thêm thông tin về gas và tổng SepETH phải trả */}
            {estimatedGas && (
              <>
                <p><strong>Estimated Gas:</strong> {estimatedGas} SepETH</p>
                <p><strong>Total Cost (including gas):</strong> {parseFloat(nft.price) + parseFloat(estimatedGas)} SepETH</p>
              </>
            )}
          </div>

          {/* Trạng thái giao dịch */}
          {purchaseState === "loading" ? (
            <div className="mt-6 text-center">
              <p className="mt-4">Đang xử lý giao dịch...</p>
            </div>
          ) : null}

          {purchaseState === "success" && (
            <div className="mt-4">
              <p className="text-green-500">Giao dịch thành công!</p>
              <p className="mt-2">
                <strong>Transaction Hash:</strong>
              </p>
              <a
                href={`https://sepolia.etherscan.io/tx/${transactionHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                Xem trên Blockchain
              </a>
            </div>
          )}

          {purchaseState === "error" && (
            <div className="mt-4">
              <p className="text-red-500">Giao dịch thất bại!</p>
              <p className="mt-2 text-red-500">{errorMessage}</p>
            </div>
          )}

          <div className="mt-6 flex justify-center">
            {purchaseState === "success" ? "" : 
            <button
              className="bg-blue-600 text-white px-6 py-3 rounded-lg"
              onClick={confirmPurchase}
              disabled={purchaseState === "loading"}
            >
              {purchaseState === "loading" ? <FaSpinner className="animate-spin" /> : "Xác nhận mua"}
            </button>}
          </div>
        </Modal>
      </Layout>

      {/* Modal yêu cầu kết nối ví */}
      <Modal
        isOpen={isWalletModalOpen}
        onRequestClose={() => setIsWalletModalOpen(false)}
        contentLabel="Connect Wallet"
        className="modal bg-white rounded-lg p-6 shadow-lg max-w-lg mx-auto mt-20 relative flex flex-col items-center"
        overlayClassName="overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 "
      >
        <h2 className="text-2xl font-semibold mb-4">Vui lòng kết nối ví của bạn</h2>
        <p className="mb-4">Để mua NFT, bạn cần kết nối ví của mình với hệ thống.</p>
        <button
          className="bg-blue-600 text-white px-6 py-3 rounded-lg"
          onClick={() => {
            setIsWalletModalOpen(false);
          }}
        >
          Xác nhận
        </button>
      </Modal>

      {/* Spinner toàn màn hình */}
      {isFullScreenSpinner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <FaSpinner className="text-white text-4xl animate-spin" />
        </div>
      )}
    </>
  );
};

export default NFTDetailDiscovery;
