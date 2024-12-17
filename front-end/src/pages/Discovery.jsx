import React, { useEffect, useState } from 'react'
import Layout from '../components/layout/Layout'
import NFTCard from '../components/reuse-component/NFTCard'
import { fetchAllListedNFTs } from '../utils/blockchain'
import Skeleton from 'react-loading-skeleton'; // Import thư viện Skeleton
import 'react-loading-skeleton/dist/skeleton.css'; // Import CSS cho Skeleton

function Discovery() {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true); // Thêm state loading

  useEffect(() => {
    const loadNFTs = async () => {
      const listedNFTs = await fetchAllListedNFTs();
      setNfts(listedNFTs);
      setLoading(false); // Sau khi tải xong, cập nhật loading thành false
    };

    loadNFTs();
  }, []);

  return (
    <Layout className={'m-auto'}>
      <h1 className='text-4xl font-bold'>Buy NFTs</h1>
      <h3 className='pb-3'>Browse and buy NFTs from this collection.</h3>
      <div className='h-[900px] w-[1600px]'>
        <div className='h-full w-full grid grid-cols-5  gap-10'>
          <div className='h-full lg:col-span-5 col-span-2'>
            <div className='w-full grid grid-cols-2 gap-5 lg:grid-cols-5'>
              {loading ? (
                // Hiển thị skeleton khi đang tải dữ liệu
                [...Array(10)].map((_, index) => (
                  <div key={index}>
                    <Skeleton height={350} />
                  </div>
                ))
              ) : nfts && nfts.length > 0 ? (
                // Hiển thị NFT khi đã tải xong
                nfts.map((nft) => {
                  return (
                    <div key={nft.tokenId}>
                      <NFTCard nft={nft} />
                    </div>
                  );
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