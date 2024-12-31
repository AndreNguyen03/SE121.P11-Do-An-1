import React, { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import Header from '../components/reuse-component/Header';
import { fetchUserNFTs, isOwner, withdrawFunds, setGameFee } from '../utils/blockchain';
import { useWalletContext } from '../context/WalletContext';
import NFTDetailList from './NFTDetailList';
import NFTCardProfile from '../components/reuse-component/NFTCardProfile';
import { FaSpinner } from 'react-icons/fa';
import Button from '../components/reuse-component/Button';

function Profile() {
  const { account, user, connectWallet } = useWalletContext();
  const [isModalDetailOpen, setIsModalDetailOpen] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [isOwnerAccount, setIsOwnerAccount] = useState(false);
  const [mintFeeValue, setMintFeeValue] = useState('');
  const [nfts, setNFTs] = useState([]);
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
      await setGameFee(mintFeeValue);
      alert(`Mint fee updated to ${mintFeeValue} ETH`);
    } catch (error) {
      console.error("Error setting mint fee:", error);
      alert('Error setting mint fee');
    }
  };

  if (!account) {
    return (
      <Layout className={"flex justify-center items-center gap-5 flex-col"}>
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

          <div className="dashboard-container mb-10 p-6 bg-gray-50 rounded-md shadow-lg">
            {/* Thông tin chung dành cho tất cả người dùng */}
            <div className="summary-section my-10 bg-blue-200 p-6 rounded-lg shadow-md text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Dashboard Overview</h2>
              <div className="flex justify-center items-center gap-10">
                <div className="text-center">
                  <p className="text-xl font-semibold text-gray-600">Total NFTs</p>
                  <p className="text-4xl font-bold text-blue-700">{nfts.length}</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-semibold text-gray-600">Total Value</p>
                  <p className="text-4xl font-bold text-blue-700">{totalValue.toFixed(6)} ETH</p>
                </div>
              </div>
            </div>

            {/* Chỉ hiển thị phần Owner Actions nếu là tài khoản của chủ sở hữu */}
            {isOwnerAccount && (
              <div className="owner-section my-10 p-8 bg-gray-100 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Owner Dashboard</h2>
                <div className="actions-section">
                  <h3 className="text-xl font-bold mb-4 text-gray-700">Owner Actions</h3>
                  <button
                    onClick={handleWithdraw}
                    className="w-full bg-red-500 text-white px-6 py-4 rounded-md mb-6 text-lg shadow hover:bg-red-600"
                  >
                    Withdraw Funds
                  </button>
                  <div className="set-mint-fee flex flex-wrap items-center gap-4">
                    <input
                      type="number"
                      placeholder="New Mint Fee (ETH)"
                      className="flex-grow border rounded-md p-4 text-lg shadow"
                      onChange={(e) => setMintFeeValue(e.target.value)}
                    />
                    <button
                      onClick={handleSetMintFee}
                      className="bg-blue-500 text-white px-6 py-4 rounded-md text-lg shadow hover:bg-blue-600"
                    >
                      Set Game Fee
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>


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