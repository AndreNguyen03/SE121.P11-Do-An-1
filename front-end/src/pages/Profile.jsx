import React, { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import Header from '../components/reuse-component/Header';
import { fetchUserNFTs, isOwner, withdrawFunds, setMintFee } from '../utils/blockchain';
import { useWalletContext } from '../context/WalletContext';
import NFTDetailList from './NFTDetailList';
import NFTCardProfile from '../components/reuse-component/NFTCardProfile';
import { FaSpinner } from 'react-icons/fa';

function Profile() {
  const { account, user, connectWallet } = useWalletContext();
  const [isModalDetailOpen, setIsModalDetailOpen] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [isOwnerAccount, setIsOwnerAccount] = useState(false);
  const [mintFeeValue, setMintFeeValue] = useState('');
  const [nfts,setNFTs] = useState([]);
  const [loading, setLoading] = useState(false);

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
          setLoading(true);
          const nfts = await fetchUserNFTs(account);
          setNFTs(nfts);
        } catch (error) {
          console.error("Error fetching NFTs: ", error);
        } finally {
          setLoading(false);
        }
      }

      async function checkIfOwner() {
        const isOwnerFlag = await isOwner(account);
        setIsOwnerAccount(isOwnerFlag);
      }

      fetchNFTs();
      checkIfOwner();
    }
  }, [account]);

  const listedNFTs = nfts.filter((nft) => nft.isListed);
  const unlistedNFTs = nfts.filter((nft) => !nft.isListed);
  const totalValue = nfts.reduce((acc, nft) => acc + parseFloat(nft.price || 0), 0);

  const handleWithdraw = async () => {
    try {
      await withdrawFunds();
      alert('Funds withdrawn successfully');
    } catch (error) {
      console.error("Error withdrawing funds:", error);
      alert('Error withdrawing funds');
    }
  };

  const handleSetMintFee = async () => {
    try {
      await setMintFee(mintFeeValue);
      alert(`Mint fee updated to ${mintFeeValue} ETH`);
    } catch (error) {
      console.error("Error setting mint fee:", error);
      alert('Error setting mint fee');
    }
  };

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
              src={user?.image}
              alt="Profile"
              className="object-cover w-full h-full"
            />
          </div>

          {/* Nội dung */}
          <div className="m-20 text-center">
            <h2 className="text-2xl font-bold text-gray-800">{user?.name}</h2>
            <p className="text-gray-500 text-lg mt-3">Wallet Address: {account}</p>
          </div>

          {/* Nếu là chủ sở hữu */}
          {isOwnerAccount && (
            <div className="owner-section my-10 p-6 bg-gray-100 rounded-md shadow-md">
              <h2 className="text-xl font-bold mb-4">Owner Actions</h2>
              <button
                onClick={handleWithdraw}
                className="bg-red-500 text-white px-4 py-2 rounded-md mb-4"
              >
                Withdraw Funds
              </button>
              <div>
                <input
                  type="number"
                  placeholder="New Mint Fee (ETH)"
                  className="border rounded-md p-2 mr-2"
                  onChange={(e) => setMintFeeValue(e.target.value)}
                />
                <button
                  onClick={handleSetMintFee}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                  Set Mint Fee
                </button>
              </div>
              <div className="user-info my-6">
              <h2 className="text-xl font-bold text-gray-800">Profile Summary</h2>
              <p>Total NFTs: {nfts.length}</p>
              <p>Total Value: {totalValue.toFixed(6)} ETH</p>
            </div>
            </div>
          )}

          {/* Nếu không phải chủ sở hữu */}
          {!isOwnerAccount && (
            <div className="user-info my-6">
              <h2 className="text-xl font-bold text-gray-800">Profile Summary</h2>
              <p>Total NFTs: {nfts.length}</p>
              <p>Total Value: {totalValue.toFixed(6)} ETH</p>
            </div>
          )}

          {/* Unlisted NFTs */}
          <Header textColor={'text-black'}>Unlisted NFTs</Header>
          {loading ? <FaSpinner className="animate-spin" /> : unlistedNFTs.length === 0 ? (
            <p className="text-gray-500 text-center mt-4">You currently have no unlisted NFTs available for listing. Create or mint a new NFT to get started!</p>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 mx-auto lg:gap-4'>
              {unlistedNFTs.map((nft) => (
                <div key={nft.tokenId}>
                  <NFTCardProfile nft={nft} onClick={() => handleListClick(nft)} />
                </div>
              ))}
            </div>
          )}

          {/* Listed NFTs */}
          <Header textColor={'text-black'}>Listed NFTs</Header>
          {loading ? <FaSpinner className="animate-spin" /> :
            listedNFTs.length === 0 ? (
              <p className="text-gray-500 text-center mt-4">You currently have no listed NFTs on the marketplace. List an NFT to make it available for trading!</p>
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
      </Layout>

      {isModalDetailOpen && selectedNFT && (
        <NFTDetailList nft={selectedNFT} closeModal={closeModal} setNFTs={setNFTs} />
      )}
    </>
  );
}

export default Profile;
