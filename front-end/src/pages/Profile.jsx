import React, { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import Header from '../components/reuse-component/Header';
import { fetchUserNFTs } from '../utils/blockchain';
import { useWalletContext } from '../context/WalletContext';
import NFTDetailList from './NFTDetailList';
import NFTCardProfile from '../components/reuse-component/NFTCardProfile';

function Profile() {
  const [loading, setLoading] = useState(true);
  const { account, user, connectWallet } = useWalletContext(); // Thêm connectWallet vào useWalletContext để kết nối ví
  const [isModalDetailOpen, setIsModalDetailOpen] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [nfts, setNFTs] = useState([]);


  const handleListClick = (nft) => {
    setSelectedNFT(nft);
    setIsModalDetailOpen(true);
  };

  const closeModal = () => {
    setIsModalDetailOpen(false);
  };

  useEffect(() => {
    if (account) {
      async function fetchNFTs() {
        try {
          const nfts = await fetchUserNFTs(account);
          setNFTs(nfts);
        } catch (error) {
          console.error("Error fetching NFTs: ", error);
          setError("Failed to load NFTs. Please try again.");
        } finally {
          setLoading(false);
        }
      }

      fetchNFTs();
    }
  }, [account]);

  const listedNFTs = nfts.filter((nft) => nft.isListed);
  const unlistedNFTs = nfts.filter((nft) => !nft.isListed);

  if (!account) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-full">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Please connect your wallet to view Profile</h2>
            <button
              className="bg-blue-500 text-white p-2 rounded-lg"
              onClick={connectWallet}
            >
              Connect Wallet
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Layout>
        <div className="relative flex flex-col items-center mt-20 p-12 bg-white rounded-lg shadow-lg w-11/12 lg:w-[80%] mx-auto">
          {/* Profile Image */}
          <div className="absolute -top-16 w-40 h-40 rounded-full overflow-hidden shadow-md border-4 border-white">
            <img
              src={user?.image} // Thay bằng hình thật
              alt="Profile"
              className="object-cover w-full h-full"
            />
          </div>

          {/* Nội dung */}
          <div className="m-20 text-center">
            <h2 className="text-2xl font-bold text-gray-800">{user?.name}</h2>
            <p className="text-gray-500 text-lg mt-3">Wallet Address: {account}</p>
          </div>

          {/* Unlisted NFTs */}
          <Header textColor={'text-black'}>Unlisted NFTs</Header>
          {unlistedNFTs.length === 0 ? (
            <p className="text-gray-500 text-center mt-4">You currently have no unlisted NFTs available for listing. Create or mint a new NFT to get started!</p> // Hiển thị thông báo khi không có unlisted NFTs
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 mx-auto lg:gap-8'>
              {unlistedNFTs.map((nft) => (
                <div key={nft.tokenId}>
                  <NFTCardProfile nft={nft} onClick={() => handleListClick(nft)} />
                </div>
              ))}
            </div>
          )}

          {/* Listed NFTs */}
          <div className='mt-10'>
            <Header textColor={'text-black'}>Listed NFTs</Header>
            {listedNFTs.length === 0 ? (
              <p className="text-gray-500 text-center mt-4">You currently have no listed NFTs on the marketplace. List an NFT to make it available for trading!</p> // Hiển thị thông báo khi không có listed NFTs
            ) : (
              <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 mx-auto lg:gap-4'>
                {listedNFTs.map((nft) => (
                  <div key={nft.tokenId}>
                    <NFTCardProfile nft={nft} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Layout>

      {isModalDetailOpen && selectedNFT && (
        <NFTDetailList nft={selectedNFT} closeModal={closeModal} setNFTs={setNFTs}/>
      )}
    </>
  );
}

export default Profile;