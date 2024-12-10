import React, { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import Sudoku from '../components/Mint/Sudoku';
import Button from '../components/reuse-component/Button';
import { useSudokuContext } from '../context/SudokuContext';
import { useWalletContext } from '../context/WalletContext';
import { getRandomNFTMetadata } from '../utils';
import { uploadMetadataToPinata } from '../utils/pinata';
import { mintNFTOnBlockchain } from '../utils/blockchain';
function Mint() {
  const { sudokuInfo } = useSudokuContext();
  const { account, isConnected, connectWallet } = useWalletContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle Mint click
  const handleMintClick = async () => {
    if (sudokuInfo.completed) {
      console.log('Đã hoàn thành! Số lỗi:', sudokuInfo.fault);
      console.log('Thời gian:', formatTime(sudokuInfo.time));

      setLoading(true);
      setError(null);

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

      } catch (err) {
        console.error('Có lỗi khi mint NFT:', err);
        setError('Có lỗi khi mint NFT. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    } else {
      console.log('Chưa hoàn thành Sudoku!');
    }
  };

  // Format thời gian
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <Layout className={'flex justify-center items-center gap-5 flex-col'}>
      {isConnected ? (
        <div className={'flex justify-center items-center gap-5 flex-col'}>
          <Sudoku />
          {loading ? (
            <p>Đang mint NFT...</p>
          ) : (
            <Button 
              btnText={'Mint'} 
              bg={'bg-blue-500'} 
              textColor={'text-white'} 
              className={'text-2xl px-14 py-3'} 
              onClick={handleMintClick} 
            />
          )}
          {error && <p className="text-red-500">{error}</p>}
        </div>
      ) : (
        <div>
          <p>Vui lòng kết nối ví để tiếp tục.</p>
          <button onClick={connectWallet}>Connect Wallet</button>
        </div>
      )}
    </Layout>
  );
}

export default Mint;
