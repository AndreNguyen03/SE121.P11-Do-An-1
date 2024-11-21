import React from 'react'
import Layout from '../components/layout/Layout'
import { nfts } from '../utils'
import NFTCard from '../components/reuse-component/NFTCard'
import Filter from '../components/Discovery/Filter'


function Discovery() {
  return (
    <Layout className={'m-auto'}>
      <div className='h-[850px] w-[1300px]'>
        <div className='h-full w-full grid grid-cols-5  gap-10'>
          <div className='h-full '>
            <Filter/>
          </div>
          <div className='h-full lg:col-span-4 col-span-2'>
            <div className='w-full grid grid-cols-2 gap-5 lg:grid-cols-4'>
              {nfts.map((nft) => {
                return <NFTCard nft={nft} key={nft.id}/>
              })}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Discovery