import React, { useState, useEffect } from "react";
import Layout from "../components/layout/Layout";
import Button from "../components/reuse-component/Button";
import Sudoku from '../components/Mint/Sudoku';
import { useWalletContext } from "../context/WalletContext";
import { fetchImageFromIPFS, getRandomNFTMetadata } from "../utils";
import { uploadMetadataToPinata } from "../utils/pinata";
import { mintNFTOnBlockchain, payEntryFee, getGameFee } from "../utils/blockchain";
import { FaSpinner } from 'react-icons/fa';

function Mint() {
  const { isConnected, connectWallet, updateBalance, account, provider } = useWalletContext();
  const [showSudoku, setShowSudoku] = useState(false);
  const [showResultModal, setShowResultModal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sudokuInfo, setSudokuInfo] = useState({
    completed: false,
    fault: 0,
    time: 300,
  });

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [nftInfo, setNftInfo] = useState(null);
  const [gameFee, setGameFee] = useState(0);
  const [payingLoading, setPayingLoading] = useState(false);
  const [loadingImage, setLoadingImage] = useState(true);

  useEffect(() => {
    const fetchGameFee = async () => {
      try {
        const fee = await getGameFee();
        setGameFee(fee);
      } catch (error) {
        console.error("Error fetching game fee:", error);
      }
    };

    fetchGameFee();
  }, []);

  useEffect(() => {
    if (showSudoku && sudokuInfo.time > 0 && !sudokuInfo.completed) {
      const timer = setInterval(() => {
        setSudokuInfo((prev) => {
          if (prev.time > 0) {
            return { ...prev, time: prev.time - 1 };
          } else {
            clearInterval(timer);
            setShowResultModal("lose");
            return prev;
          }
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [showSudoku, sudokuInfo.time, sudokuInfo.completed]);

  useEffect(() => {
    if (sudokuInfo.fault > 5) {
      setShowResultModal("lose");
    }
  }, [sudokuInfo.fault]);

  useEffect(() => {
    if (sudokuInfo.completed) {
      setShowResultModal("win");
    }
  }, [sudokuInfo.completed]);

  const handleMintClick = async () => {
    setLoading(true);
    setShowStatusModal(true);

    try {
      const randomMetadata = getRandomNFTMetadata();
      const metadata = {
        name: randomMetadata.name,
        description: randomMetadata.description,
        image: randomMetadata.image,
      };

      const metadataUri = await uploadMetadataToPinata(metadata);
      await mintNFTOnBlockchain(metadataUri);

      await updateBalance(account, provider);
      // If minting is successful, update status
      setStatusMessage("NFT Minted successfully!");
      metadata.image = await fetchImageFromIPFS(metadata.image);
      setNftInfo(metadata);  // Save NFT information
      console.log(metadata);
    } catch (err) {
      console.error("Error minting NFT:", err);
      setStatusMessage("An error occurred while minting the NFT.");
    } finally {
      setLoading(false);  // Reset loading state after minting
    }
  };

  const closeStatusModal = () => {
    setShowStatusModal(false);  // Close status modal
    resetGame();
  };

  // Reset game
  const resetGame = () => {
    setShowSudoku(false);
    setShowResultModal(null);
    setSudokuInfo({ completed: false, fault: 0, time: 300 });
  };

  const handlePlay = async () => {
    setPayingLoading(true);

    try {
      const success = await payEntryFee();

      if (!success) {
        setStatusMessage("Payment for game entry failed.");
        return;
      }

      await updateBalance(account, provider);

      setShowSudoku(true);
    } catch (error) {
      console.error("Error during payment or transaction was canceled:", error);
      setStatusMessage("Transaction was canceled or an error occurred.");
    } finally {
      setPayingLoading(false);
    }
  };

  return (
    <Layout className={"flex justify-center items-center gap-5 flex-col"}>
      {isConnected ? (
        showSudoku ? (
          <>
            <Sudoku
              onUpdate={setSudokuInfo}
              sudokuInfo={sudokuInfo}
            />

            {/* Result Modal */}
            {showResultModal === "win" && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full text-center">
                  <h2 className="text-xl font-bold mb-4">🎉 Congratulations!</h2>
                  <p className="text-gray-600 mb-4">
                    You completed Sudoku with {sudokuInfo.fault} errors.
                  </p>
                  <Button
                    btnText={"Mint NFT"}
                    bg={"bg-blue-500"}
                    textColor={"text-white"}
                    className={"px-6 py-3"}
                    onClick={handleMintClick}
                  />
                </div>
              </div>
            )}

            {showResultModal === "lose" && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full text-center">
                  <h2 className="text-xl font-bold mb-4">😢 You lost!</h2>
                  <p className="text-gray-600 mb-4">
                    You exceeded 5 errors or ran out of time. Try again!
                  </p>
                  <Button
                    btnText={"Try Again"}
                    bg={"bg-red-500"}
                    textColor={"text-white"}
                    className={"px-6 py-3"}
                    onClick={resetGame}
                  />
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center p-6 max-w-lg bg-white rounded-lg shadow-md">
            <h2 className="text-3xl font-bold mb-6">Sudoku Game Rules</h2>
            <p className="text-xl text-gray-700 mb-4">
              Welcome to Sudoku! Complete the Sudoku board to mint an NFT.
            </p>
            <p className="text-xl text-gray-700 mb-4">
              - Maximum time: 5 minutes<br />
              - Maximum errors: 5
            </p>
            {gameFee > 0 && (
              <p className="text-xl text-gray-700 mb-4">
                Entry fee: <b>{gameFee} ETH</b>.
              </p>
            )}
            <Button
              btnText={"Play Now"}
              bg={"bg-green-500"}
              textColor={"text-white"}
              className={"px-10 py-3"}
              onClick={handlePlay}
            />
            {payingLoading && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full text-center">
                  <h2 className="text-xl font-bold mb-4">Processing, please wait...</h2>
                  <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-blue-600 border-t-transparent"></div>
                </div>
              </div>
            )}
          </div>
        )
      ) : (
        <div className="text-center p-6 max-w-lg bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Connect your wallet to start</h2>
          <Button
            btnText={"Connect Wallet"}
            bg={"bg-blue-500"}
            textColor={"text-white"}
            className={"px-10 py-3"}
            onClick={connectWallet}
          />
        </div>
      )}

      {/* Status Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-center">Transaction Status</h2>
            <div className="mt-6">
              {loading && <p className="text-xl text-blue-500 text-center">Processing, please wait...</p>}
              {!loading && nftInfo && (
                <div className="text-xl text-green-500 text-center">
                  <p>You have successfully minted the NFT!</p>
                  <p>Name: {nftInfo.name}</p>
                  <p>Description: {nftInfo.description}</p>
                  <div className="mt-4">
                    {loadingImage && (
                      <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-blue-600 border-t-transparent"></div>
                    )}
                    <img
                      src={nftInfo.image}
                      alt={nftInfo.name}
                      className="mt-4 rounded-md"
                      onLoad={() => setLoadingImage(false)} // Set loadingImage to false when the image loads
                      style={{ maxWidth: "340px", display: loadingImage ? 'none' : 'block' }} // Hide the image until it loads
                    />
                  </div>
                </div>
              )}
              {statusMessage && !loading && !nftInfo && (
                <p className="text-xl text-red-500 text-center">{statusMessage}</p>
              )}
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
    </Layout>
  );
}

export default Mint;
