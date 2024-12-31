import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import Button from '../components/reuse-component/Button';
import { useWalletContext } from '../context/WalletContext';

function Create() {
  const { isConnected, connectWallet } = useWalletContext();
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1); // Step 1: Upload, Step 2: Metadata
  const [uploadedImage, setUploadedImage] = useState(null);
  const [metadata, setMetadata] = useState({
    name: '',
    description: '',
    price: '',
  });

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result); // Base64 image preview
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle metadata changes
  const handleMetadataChange = (e) => {
    const { name, value } = e.target;
    setMetadata((prev) => ({ ...prev, [name]: value }));
  };

  // Handle minting action
  const handleMint = () => {
    if (!uploadedImage || !metadata.name || !metadata.price) {
      alert('Please complete all fields to mint your NFT.');
      return;
    }
    alert(`Minting NFT: ${metadata.name}\nPrice: ${metadata.price} ETH`);
    // Reset form for demo
    setUploadedImage(null);
    setMetadata({ name: '', description: '', price: '' });
    setStep(1);
  };

  return (
    <Layout className="flex justify-center items-center flex-col">
      {isConnected ? (
        <div className="container mx-auto p-6">
          <h1 className="text-4xl font-bold text-center mb-8">Create Your NFT</h1>
          <div className="bg-white shadow-lg rounded-lg p-6">
            {/* Step Indicator */}
            <div className="flex justify-between items-center mb-6">
              <span
                className={`text-lg font-semibold px-4 py-2 rounded ${
                  step === 1 ? 'bg-blue-500 text-white' : 'text-gray-600'
                }`}
              >
                Step 1: Upload
              </span>
              <span
                className={`text-lg font-semibold px-4 py-2 rounded ${
                  step === 2 ? 'bg-blue-500 text-white' : 'text-gray-600'
                }`}
              >
                Step 2: Metadata
              </span>
            </div>

            {step === 1 ? (
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-4">Upload Your NFT</h2>
                <div
                  className="border-2 border-dashed border-gray-400 rounded-lg p-6 mb-4 hover:border-blue-500 transition"
                  onClick={() => document.getElementById('fileInput').click()}
                >
                  {uploadedImage ? (
                    <img
                      src={uploadedImage}
                      alt="Uploaded Preview"
                      className="w-32 h-32 mx-auto object-cover rounded-md"
                    />
                  ) : (
                    <p className="text-gray-500">Click to upload or drag and drop your image</p>
                  )}
                </div>
                <input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <Button
                  btnText="Next"
                  bg="bg-blue-500"
                  textColor="text-white"
                  className="mt-4 px-6 py-2"
                  onClick={() => uploadedImage && setStep(2)}
                  disabled={!uploadedImage}
                />
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-semibold mb-4">Enter NFT Details</h2>
                <div className="grid gap-4">
                  {/* Name Field */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">NFT Name</label>
                    <input
                      type="text"
                      name="name"
                      value={metadata.name}
                      onChange={handleMetadataChange}
                      className="w-full border rounded-lg p-3 focus:ring focus:outline-none"
                      placeholder="Enter the name of your NFT"
                    />
                  </div>
                  {/* Description Field */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Description</label>
                    <textarea
                      name="description"
                      value={metadata.description}
                      onChange={handleMetadataChange}
                      className="w-full border rounded-lg p-3 focus:ring focus:outline-none"
                      placeholder="Enter a brief description"
                    />
                  </div>
                  {/* Price Field */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Price (ETH)</label>
                    <input
                      type="number"
                      name="price"
                      value={metadata.price}
                      onChange={handleMetadataChange}
                      className="w-full border rounded-lg p-3 focus:ring focus:outline-none"
                      placeholder="Enter price in ETH"
                    />
                  </div>
                </div>
                <div className="flex justify-between mt-6">
                  <Button
                    btnText="Back"
                    bg="bg-gray-500"
                    textColor="text-white"
                    className="px-6 py-2"
                    onClick={() => setStep(1)}
                  />
                  <Button
                    btnText="Mint"
                    bg="bg-blue-500"
                    textColor="text-white"
                    className="px-6 py-2"
                    onClick={handleMint}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center">
          <p className="mb-4">Please connect your wallet to create NFTs.</p>
          <Button
            btnText="Connect Wallet"
            bg="bg-blue-500"
            textColor="text-white"
            onClick={connectWallet}
            className="px-6 py-2"
          />
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
      )}
    </Layout>
  );
}

export default Create;
