import React, { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import Sudoku from '../components/Mint/Sudoku';
import Button from '../components/reuse-component/Button';
import { useSudokuContext } from '../context/SudokuContext';
import { useWalletContext } from '../context/WalletContext';
import {FaSpinner} from 'react-icons/fa';
import { payToPlay } from '../utils/blockchain';
import { getGameFee } from '../utils/blockchain';


function Mint() {
  const { sudokuInfo, setSudokuInfo } = useSudokuContext();
  const { account, isConnected, connectWallet,updateBalance,provider } = useWalletContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showRules, setShowRules] = useState(true); // Hiển thị luật chơi
  const [playFee, setPlayFee] = useState(null); // Phí chơi game
  const [success, setSuccess] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [gameReset, setGameReset] = useState(false); // Trạng thái để kiểm soát reset game
   
  useEffect(() => {
    if (gameReset) {
      setShowRules(true); // Quay lại hiển thị "Luật chơi" và nút "Bắt đầu"
      setGameReset(false); // Reset lại trạng thái để tránh vòng lặp
    }
  }, [gameReset]);

   // Lấy phí chơi game từ hàm getGameFee
  useEffect(() => {
    async function fetchGameFee() { // Lấy phí chơi từ smart contract
      try { // Lấy phí chơi từ smart contract
        const fee = await getGameFee(); // Lấy phí chơi từ smart contract
        setPlayFee(fee); // Hiển thị phí chơi
      } catch (err) {
        console.error("Không thể lấy phí chơi game:", err); // Lỗi khi lấy phí chơi từ smart contract
        setError("Không thể lấy phí chơi game. Vui lòng thử lại."); // Hiển thị lỗi khi lấy phí chơi từ smart contract 
      }
    } // Lấy phí chơi từ smart contract
    fetchGameFee();    
  }, []); // Lấy phí chơi từ smart contract

  const handleStartGame = async () => {
    if (!account) {
      alert("Vui lòng kết nối ví để tiếp tục.");
      return;
    }
    setSuccess(null);
    setShowStatusModal(true);

    try {
      setLoading(true);
      setError(null);

      // Thực hiện thanh toán phí chơi game
      const response = await payToPlay();
      if (response.success) {
        console.log("Thanh toán phí chơi game thành công!");
        setShowRules(false); // Ẩn form luật chơi và hiển thị Sudoku
        setSudokuInfo({ ...sudokuInfo, fault: 0, completed: false }); // Reset thông tin trò chơi
        await updateBalance(account,provider);
        setSuccess("Thanh toán phí chơi game thành công!");
      } else {
        throw new Error("Thanh toán không thành công.");
      }
    } catch (err) {
      console.error("Lỗi khi bắt đầu game:", err);
      setError("Không thể bắt đầu trò chơi. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const closeStatusModal = async () => {
    await sendNotificationToFollowers();   
    setShowStatusModal(false); // Đóng modal khi xong    
  };

  const sendNotificationToFollowers = async () => {
    const data = {  }
    console.log(data);
    
  };
  
  // Format thời gian
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <>
    <Layout className="flex justify-center items-center gap-5 flex-col">
      {isConnected ? (
        showRules ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Luật chơi Sudoku</h2>
            <p className="mb-4">
              Hoàn thành bảng Sudoku 6x6 mà không có số nào lặp lại trong cùng một hàng, cột.
            </p>
            <p className="mb-4">
              - Phí chơi: <strong>{playFee ? `${playFee} ETH` : "Đang tải..."}</strong>
            </p>
            <p className="mb-4">- Lỗi tối đa: 5 lần</p>
            <p className="mb-4">- Thời gian tối đa: 5 phút</p>
            {loading ? (
              <p>Đang xử lý...</p>
            ) : (
              <Button
                btnText="Bắt đầu chơi"
                bg="bg-green-500"
                textColor="text-white"
                className="text-2xl px-14 py-3"
                onClick={handleStartGame}
              />
            )}
            {error && <p className="text-red-500">{error}</p>}
          </div>
        ) : (
          <Sudoku setGameReset={setGameReset} />
        )
      ) : (
        <div>
          <p>Vui lòng kết nối ví để tiếp tục.</p>
          <button onClick={connectWallet}>Connect Wallet</button>
        </div>
      )}
    </Layout>
    {showStatusModal && (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white  p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center">Transaction Status</h2>
          <div className="mt-6">
            {loading && <p className="text-xl text-blue-500 text-center">Paying your game fee, please wait until transaction completed ....</p>}
            {success && <p className="text-xl text-green-500 text-center">{success}</p>}
            {error && <p className="text-xl text-red-500 text-center">{error}</p>}
          </div>
          <div className="mt-6 text-center">
            <button
              onClick={closeStatusModal}
              className={`bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-700 ${loading && "opacity-50 cursor-not-allowed"}`}
              disabled={loading}
            >
              {loading ? <FaSpinner className="animate-spin" /> : "Close"}
            </button>
          </div>
        </div>
      </div>
      )}
    </>
  );
}

export default Mint;
