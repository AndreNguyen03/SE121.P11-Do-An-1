import React, { useEffect, useState } from 'react'
import Layout from '../components/layout/Layout'
import Header from '../components/reuse-component/Header'
import NFTCard from '../components/reuse-component/NFTCard'
import { fetchUserNFTs } from '../utils/blockchain'
import { useWalletContext } from '../context/WalletContext'
import {nfts} from '../utils/index'
import NFTDetail from './NFTDetail'

function List() {
  const [listedNFTs, setListedNFTs] = useState([]);
  const [unlistedNFTs, setUnlistedNFTs] = useState([]);
  const [loading, setLoading] = useState(true);
  const {account} = useWalletContext();
  const [isModalDetailOpen,setIsModalDetailOpen] = useState(false)
  const [selectedNFT, setSelectedNFT] = useState(null);

  const handleListClick = (nft) => {
    setSelectedNFT(nft);
    setIsModalDetailOpen(true)
  }

  const closeModal = () => {
    setIsModalDetailOpen(false)
  }


  useEffect(() => {
    if(!account) {
      
    } else {
      async function fetchNFTs() {
        setLoading(true);
        const nfts = await fetchUserNFTs(account);
  
        const listed = nfts.filter((nft) => nft.isListed);
        const unlisted = nfts.filter((nft) => !nft.isListed);
  
        setListedNFTs(listed);
        setUnlistedNFTs(unlisted);
        setLoading(false);
        console.log(`listed nft:`,listed);
        console.log(`unlisted nft:`,unlisted);
        
      }
  
      fetchNFTs();
    }
  },[account])

  return (
    <>
      <Layout>
      <Header textColor={'text-black'}>unListed NFT</Header>
      <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 mx-auto lg:gap-4'>
        {unlistedNFTs.map((nft) => (
          <div key={nft.tokenId}>
            <NFTCard nft={nft} onClick={()=>handleListClick(nft)}/>
          </div>
        ))}
      </div>
      <div className='mt-10'>
        <Header textColor={'text-black'}>Listed NFT</Header>
        <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 mx-auto lg:gap-4'>
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
  )
}

export default List