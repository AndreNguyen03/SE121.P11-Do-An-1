import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import Button from '../components/reuse-component/Button';
import { useWalletContext } from '../context/WalletContext';
import nft1 from '../assets/1.png'
import { getUserNFTs, mintNFT } from '../utils/contract';

function Create() {
  const { isConnected, connectWallet, account, signer } = useWalletContext();
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1); // Step 1: Upload, Step 2: Metadata
  const [uploadedImage, setUploadedImage] = useState(null);
  const [metadata, setMetadata] = useState({
    name: '',
    description: '',
    price: '',
  });

  // Handle minting action
  const handleMint = async () => {
    try {
      
      console.log(`account mint :::`, account);

      const tx = await mintNFT(account,signer);

      console.log(`transaction mint :::`, tx);

      const userNFTs = await getUserNFTs(account,signer);
      console.log(`userNFTs ::: `, userNFTs);
    } catch (error) {
      console.log(error);
    }
  };

  const [quantity, setQuantity] = useState(2);
  const maxMint = 10;

  const increaseQuantity = () => {
    if (quantity < maxMint) setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  return (
    <Layout className="flex justify-center items-center flex-col">
      <div className="flex flex-col gap-7 items-center justify-around rounded-sm min-h-[800px]">
        <h2 className='text-6xl mt-[50px]'>FreeMint is Live</h2>

        <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col md:flex-row items-center max-w-[1000px] w-full mb-[70px]">
          {/* Left Section: Image */}
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="relative">
              <img
                src={nft1} // Replace with your NFT image URL
                alt="NFT Preview"
                className="rounded-lg w-full h-auto"
              />
              <span className="absolute top-2 left-2 bg-black bg-opacity-80 text-white px-3 py-1 text-lg rounded-md">
                96 / 100
              </span>
            </div>
          </div>

          {/* Right Section: Mint Details */}
          <div className="h-[463px] w-full md:w-1/2 mt-6 md:mt-0 md:ml-6 flex flex-col justify-between">
            <h2 className="text-3xl font-bold text-center">Citizens by Solsteads</h2>
            <div className="flex items-center justify-between space-x-4 mt-6">
              <button
                onClick={decreaseQuantity}
                className="w-16 h-10 flex items-center justify-center bg-gray-700 text-white rounded-md text-2xl font-bold hover:bg-gray-600 "
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
            <p className="mt-4 text-lg text-end">Max Mint Amount: {maxMint}</p>
            <p className="mt-6 text-xl border-t border-b border-gray-600 py-2 flex justify-between w-full">
              <span className="font-semibold">Total:</span>
              <span>0.02 ETH + gas</span>
            </p>
            <button onClick={() => handleMint()} className="mt-6 px-8 py-3 bg-purple-700 rounded-md font-bold text-xl text-white hover:bg-purple-600 transition duration-300">
              MINT
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Create;
