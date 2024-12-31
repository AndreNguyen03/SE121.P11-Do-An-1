import React, { useEffect, useState } from 'react';
import SudokuCell from './SudokuCell';
import { generateSudoku6x6, createPuzzle } from './helpers/createPuzzle';
import { useSudokuContext } from "../../context/SudokuContext";
import Modal from '../../components/reuse-component/Modal';
import { getRandomNFTMetadata } from '../../utils';
import { uploadMetadataToPinata } from '../../utils/pinata';
import { mintNFTOnBlockchain } from '../../utils/blockchain';
import { useWalletContext } from '../../context/WalletContext';
import {FaSpinner} from 'react-icons/fa';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';


function Sudoku({setGameReset}) {
  const [error, setError] = useState("");
  const [invalidCells, setInvalidCells] = useState([]);
  const [fullGrid] = useState(() => generateSudoku6x6());
  const [initialPuzzle] = useState(() => createPuzzle(fullGrid, 16));
  const [currentPuzzle, setCurrentPuzzle] = useState(initialPuzzle);
  const { sudokuInfo, setSudokuInfo } = useSudokuContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(300);
  const [currentFault, setCurrentFault] = useState(0);
  const [status, setStatus] = useState(""); // Trạng thái hiển thị trong Modal  
  const [timerRunning, setTimerRunning] = useState(true); // Đang chạy timer
  const [loading,setLoading] = useState(false);
  const { account, updateBalance, provider } = useWalletContext();
  const [success, setSuccess] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const warningBeepRef = useRef(null);
  const backgroundSoundRef = useRef(null);
  const errorSoundRef = useRef(null); 
  const navigate = useNavigate();

  
  useEffect(() => {
    warningBeepRef.current = new Audio("./audio/warning-beep.mp3");
    warningBeepRef.current.loop = true;
    warningBeepRef.current.volume = 0.5;
    backgroundSoundRef.current = new Audio("./audio/background-sound.mp3");
    backgroundSoundRef.current.loop = true;
    backgroundSoundRef.current.volume = 0.5;
    errorSoundRef.current = new Audio("./audio/error-sound.mp3");
    errorSoundRef.current.loop = false;
    errorSoundRef.current.volume = 0.5;
    return () => {
      warningBeepRef.current.pause();
      backgroundSoundRef.current.pause();
      errorSoundRef.current.pause();
    };
  }, []);

  useEffect(() => {
    if (currentTime === 300) {
      backgroundSoundRef.current.play();
    }
    if (currentTime === 30) {
      warningBeepRef.current.play();
      backgroundSoundRef.current.pause();
    }
  }, [currentTime]);

  

  //handldeBeforeUnload
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (timerRunning) {
        event.preventDefault();
        event.returnValue = "Trò chơi sẽ bị mất nếu bạn làm mới hoặc thoát khỏi trang.";
      }
    };
  
    window.addEventListener("beforeunload", handleBeforeUnload);
  
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [timerRunning]);  

  //handle back button
  useEffect(() => {
    window.history.pushState(null,"",window.location.href);
    const handleBackButton = (event) => {
      console.log("back button clicked");
      if(window.confirm("Bạn có muốn thoát khỏi trò chơi này?")){
        navigate(-1);
      }else{
        window.history.pushState(null,"",window.location.href);
      }
    };
    window.addEventListener("popstate", handleBackButton);
    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [navigate]);

 
  const requestGameReset = () => {
    setGameReset(true);
  };

  // Mở Modal
  const openModal = (message) => {
    setStatus(message); // Cập nhật trạng thái
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);
  // Dừng đồng hồ
  const stopTimer = () => {
    setTimerRunning(false);
  };

  const handleLose = () => {
    setSudokuInfo({ ...sudokuInfo, fault: 0, completed: false });
    requestGameReset();
  };


  const handleMintNFT = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    setShowStatusModal(true);
    try {
      // 1. Lấy dữ liệu NFT ngẫu nhiên
      const randomMetadata = getRandomNFTMetadata();

      // 2. Tạo metadata JSON
      const metadata = {
        name: randomMetadata.name,
        description: randomMetadata.description,
        image: randomMetadata.image, // URL ảnh đã upload lên IPFS
      };
      console.log(metadata);

      // 3. Upload metadata lên Pinata và lấy URI
      const metadataUri = await uploadMetadataToPinata(metadata);
      console.log(metadataUri);
      // 4. Mint NFT trên blockchain
      await mintNFTOnBlockchain(metadataUri);

      console.log('Mint NFT thành công với URI:', metadataUri);
      setSuccess("Mint NFT thành công!");
      await updateBalance(account,provider);

    } catch (err) {
      console.error('Có lỗi khi mint NFT:', err);
      setError('Có lỗi khi mint NFT. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const closeStatusModal = async () => {
    await sendNotificationToFollowers();   
    setShowStatusModal(false); // Đóng modal khi xong
    if (success) {
      setSudokuInfo({ ...sudokuInfo, fault: 0, completed: false }); // Reset thông tin trò chơi
      requestGameReset();
    }
    closeModal();
    
  };

  const sendNotificationToFollowers = async () => {
    const data = {  }
    console.log(data);
  };


  // Lưu các ô đã điền sẵn
  const initialCells = initialPuzzle.reduce((acc, row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (cell !== null) acc.push(`${rowIndex}-${colIndex}`);
    });
    return acc;
  }, []);

  // Đồng hồ đếm ngược
  useEffect(() => {
    if (!timerRunning) return;
    if (currentTime <= 0 || currentFault > 5) {
      stopTimer(); // Dừng timer nếu hết thời gian hoặc lỗi > 5
      openModal("Bạn đã thua!"); // Hiển thị thua nếu hết thời gian hoặc lỗi > 5
      warningBeepRef.current.pause();
      backgroundSoundRef.current.pause();
      errorSoundRef.current.pause();
      return;
    }

    const timer = setInterval(() => {
      setCurrentTime((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer); // Cleanup interval
  }, [currentTime, currentFault, timerRunning]);

  const handleChange = (row, col, value) => {
    if (value === "") {
      updateCell(row, col, null);
      setInvalidCells((prev) => prev.filter((cell) => cell !== `${row}-${col}`));
      return;
    }

    const intValue = parseInt(value, 10);
    if (isNaN(intValue) || intValue < 1 || intValue > 6) {
      setSudokuInfo((prev) => ({ ...prev, fault: prev.fault + 1 }));
      setCurrentFault((prev) => prev + 1); // Tăng lỗi nếu nhập sai
      setError("Chỉ được nhập số từ 1 đến 6!");
      errorSoundRef.current.play();
      return;
    }

    updateCell(row, col, intValue);

    const isCorrect = intValue === fullGrid[row][col];
    updateInvalidCells(row, col, isCorrect);
    if (!isCorrect) {
      // setErrorCount((prev) => prev + 1);
      setSudokuInfo(prev => ({ ...prev, fault: prev.fault + 1 }));
      setCurrentFault(prev => prev + 1);
      errorSoundRef.current.play();
    }

    setError("");
  };

  const handleAutoFill = () => {
    const newPuzzle = currentPuzzle.map((row, rowIndex) =>
      row.map((cell, colIndex) => {
        // Nếu ô trống, điền giá trị đúng từ fullGrid
        if (cell === null) {
          return fullGrid[rowIndex][colIndex];
        }
        return cell;
      })
    );
    setCurrentPuzzle(newPuzzle);

  };

  const updateCell = (row, col, value) => {
    const newPuzzle = currentPuzzle.map((r, rowIndex) =>
      r.map((cell, colIndex) =>
        rowIndex === row && colIndex === col ? value : cell
      )
    );
    setCurrentPuzzle(newPuzzle);
  };

  const updateInvalidCells = (row, col, isCorrect) => {
    setInvalidCells(prev => {
      if (isCorrect) {
        return prev.filter(cell => cell !== `${row}-${col}`);
      } else {
        return [...prev, `${row}-${col}`];
      }
    });
  };

  const checkCompletion = () => {
    const isComplete = currentPuzzle.every((row, rowIndex) =>
      row.every((cell, colIndex) => cell === fullGrid[rowIndex][colIndex])
    );
    onUpdate(prev => ({ ...prev, completed: isComplete }));
  };

  useEffect(() => {
    checkCompletion();
    console.log(`12`)
  }, [currentPuzzle, onUpdate]);

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const checkCompletion = () => {
    const isComplete = currentPuzzle.every((row, rowIndex) =>
      row.every((cell, colIndex) => cell === fullGrid[rowIndex][colIndex])
    );

    if (isComplete && currentFault <= 5 && currentTime > 0) {
      stopTimer(); // Dừng timer nếu đã hoàn thành Sudoku đúng
      openModal("Bạn đã thắng!"); // Hiển thị thắng nếu hoàn thành Sudoku đúng
      warningBeepRef.current.pause();
      backgroundSoundRef.current.pause();
    }

    setSudokuInfo((prev) => ({ ...prev, completed: isComplete }));
  };

  useEffect(() => {
    checkCompletion();
  }, [currentPuzzle]);

  return (
    <div className="flex flex-col items-center p-4">
      <div className="mb-4 flex justify-between w-full">
        <span className="text-lg">⏱️ Timer: {formatTime(currentTime)}</span>
        <br />
        <span className="text-lg">❌ Fault: {currentFault}</span>
        <br />
      </div>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <button
        onClick={handleAutoFill}
        className="bg-blue-500 text-white py-2 px-4 rounded mb-4"
      >
        Test
      </button>
      <div className="grid grid-cols-6 gap-3">
        {currentPuzzle.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const isEditable = !initialCells.includes(`${rowIndex}-${colIndex}`) || invalidCells.includes(`${rowIndex}-${colIndex}`);
            const isInvalid = invalidCells.includes(`${rowIndex}-${colIndex}`);
            return (
              <SudokuCell
                key={`${rowIndex}-${colIndex}`}
                value={cell}
                isEditable={isEditable}
                isInvalid={isInvalid}
                onChange={(e) => handleChange(rowIndex, colIndex, e.target.value)}
              />
            );
          })
        )}
      </div>
      <div>
        {error && <div className="text-red-500 mb-2">{error}</div>}
      </div>

        
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Kết quả Sudoku"
        time={formatTime(300 - currentTime)} // Thời gian đã chơi
        fault={currentFault} // Số lỗi
        status={status} // Trạng thái "Bạn đã thắng" hoặc "Bạn đã thua"
        onMint={handleMintNFT}
        onLose={handleLose}
      />
      
      
      
      {showStatusModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white  p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-center">Transaction Status</h2>
            <div className="mt-6">
              {loading && <p className="text-xl text-blue-500 text-center">Minting your NFT, please wait until transaction completed ....</p>}
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

      
    </div>   
      
  );
}

export default Sudoku;
