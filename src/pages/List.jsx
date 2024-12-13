import React, { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import Header from '../components/reuse-component/Header';
import NFTCard from '../components/reuse-component/NFTCard';
import { fetchUserNFTs, withdrawFunds, setMintFee } from '../utils/blockchain';
import { useWalletContext } from '../context/WalletContext';
import NFTDetail from './NFTDetail';

function List() {
  const [listedNFTs, setListedNFTs] = useState([]);
  const [unlistedNFTs, setUnlistedNFTs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { account } = useWalletContext();
  const [isModalDetailOpen, setIsModalDetailOpen] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [totalValue, setTotalValue] = useState(0);
  const [newMintFee, setNewMintFee] = useState('');
  const [numberNFTs, setNumberNFTs] = useState(0);
  
  const marketOwnerAddress = ""; // Thay bằng địa chỉ thực tế

  const isOwner = account && account.toLowerCase() === marketOwnerAddress.toLowerCase();

  const handleListClick = (nft) => {
    setSelectedNFT(nft);
    setIsModalDetailOpen(true);
  };

  const closeModal = () => {
    setIsModalDetailOpen(false);
  };

  const handleWithdraw = async () => {
    try {
      console.log("Withdrawing funds...");
      await withdrawFunds(); // Hàm trên blockchain.js
      alert("Funds withdrawn successfully!");
    } catch (error) {
      console.error("Error withdrawing funds:", error);
      alert("Failed to withdraw funds.");
    }
  };

  const handleSetMintFee = async () => {
    if (!newMintFee || parseFloat(newMintFee) <= 0) {
      alert("Please enter a valid mint fee!");
      return;
    }
    try {
      console.log("Setting mint fee to:", newMintFee);
      await setMintFee(newMintFee); // Hàm trên blockchain.js
      alert("Mint fee updated successfully!");
    } catch (error) {
      console.error("Error setting mint fee:", error);
      alert("Failed to update mint fee.");
    }
  };

  useEffect(() => {
    if (!account) {
      console.log("No account connected");
    } else {
      async function fetchNFTs() {
        setLoading(true);
        try {
          const nfts = await fetchUserNFTs(account);
          console.log("Fetched NFTs:", nfts);

          const listed = nfts.filter((nft) => nft.isListed);
          const unlisted = nfts.filter((nft) => !nft.isListed);

          setListedNFTs(listed);
          setUnlistedNFTs(unlisted);
          setNumberNFTs(nfts.length);

          const total = nfts.reduce((acc, nft) => acc + parseFloat(nft.price || 0), 0);
          setTotalValue(total);

          console.log("Total Value:", total);
        } catch (error) {
          console.error("Error fetching NFTs:", error);
        } finally {
          setLoading(false);
        }
      }

      fetchNFTs();
    }
  }, [account]);

  return (
    <>
      <Layout>
        <Header textColor={'text-black'}>Profile</Header>
        <div className="mx-auto text-center">
          <p className="text-lg font-semibold mb-4">Address: {account}</p>
          <p className="text-lg font-semibold mb-4">Total NFT Count: {numberNFTs}</p>
          <p className="text-lg font-semibold mb-4">Total NFT Value: {totalValue} ETH</p>
          {isOwner && (
            <>
              <div className="mt-6">
                <input
                  type="text"
                  value={newMintFee}
                  onChange={(e) => setNewMintFee(e.target.value)}
                  placeholder="Enter new mint fee"
                  className="border border-gray-300 rounded-lg py-2 px-4 w-2/3 mr-4"
                />
                <button
                  onClick={handleSetMintFee}
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                >
                  Set Mint Fee
                </button>
              </div>
              <div className="mt-6">
                <button
                  onClick={handleWithdraw}
                  className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-700"
                >
                  Withdraw ETH
                </button>
              </div>
            </>
          )}
        </div>

        <div className="mt-10">
          <Header textColor={'text-black'}>Unlisted NFT</Header>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 mx-auto lg:gap-4">
            {unlistedNFTs.map((nft) => (
              <div key={nft.tokenId}>
                <NFTCard nft={nft} onClick={() => handleListClick(nft)} />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10">
          <Header textColor={'text-black'}>Listed NFT</Header>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 mx-auto lg:gap-4">
            {listedNFTs.map((nft) => (
              <div key={nft.tokenId}>
                <NFTCard nft={nft} />
              </div>
            ))}
          </div>
        </div>
      </Layout>

      {isModalDetailOpen && selectedNFT && (
        <NFTDetail nft={selectedNFT} closeModal={closeModal} />
      )}
    </>
  );
}

export default List;
