import React from 'react'
import Layout from '../components/layout/Layout'
import Header from '../components/reuse-component/Header'
import { nfts } from '../utils/index'
import NFTCard from '../components/reuse-component/NFTCard'

function List() {
  return (
    <Layout>
      <Header textColor={'text-black'}>My NFT Collections</Header>
      <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 mx-auto lg:gap-4'>
        {nfts.map((nft) => (
          <div key={nft.id}>
            <NFTCard nft={nft} />
          </div>
        ))}
      </div>
      <div className='mt-10'>
        <Header textColor={'text-black'}>Unlisted NFT</Header>
        <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 mx-auto lg:gap-4'>
          {nfts.map((nft) => (
            <div key={nft.id}>
              <NFTCard nft={nft} />
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}

export default List