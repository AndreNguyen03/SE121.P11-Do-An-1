import React, { useEffect, useState } from 'react'
import Layout from '../components/layout/Layout'
import NFTCard from '../components/reuse-component/NFTCard'
import Filter from '../components/Discovery/Filter'
import { fetchAllListedNFTs } from '../utils/blockchain'

function Discovery() {
  const [nfts, setNfts] = useState([]);

  useEffect(() => {
    const loadNFTs = async () => {
      const listedNFTs = await fetchAllListedNFTs();
      setNfts(listedNFTs);
    };

    loadNFTs();
  }, []);

  return (
    <Layout className={'m-auto'}>
      <div className='h-[850px] w-[1300px]'>
        <div className='h-full w-full grid grid-cols-5  gap-10'>
          <div className='h-full '>
            <Filter />
          </div>
          <div className='h-full lg:col-span-4 col-span-2'>
            <div className='w-full grid grid-cols-2 gap-5 lg:grid-cols-4'>
              {nfts && nfts.length > 0 ? (
                nfts.map((nft) => {
                  return <div key={nft.tokenId}>
                    <NFTCard nft={nft} />
                  </div>
                })
              ) : (
                <p>No NFTs available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Discovery