import React from 'react'
import Button from './Button'
import dfinity from "../../assets/dfinity.svg";
function NFTCard({nft, onClick}) {
  return (
    <div className="w-52 rounded overflow-hidden m-2 bg-[#d8dfe7a5] text-white mx-auto shadow shadow-blue-500 transform hover:-translate-y-1 hover:scale-105 transition-transform duration-200 ease-in-out">
    <img className="w-full h-40 object-cover" src={nft.metadata.image} alt={nft.metadata.name} />
    <div className="p-2 pb-4 space-y-2">
      <h1 className="font-bold text-md text-blue-700">{nft.metadata.name}</h1>
      <div className='flex justify-between items-center'>
        <div className='flex items-center gap-2'>
          <img src={dfinity} alt="" className='w-6' />
          <p className="text-sm text-black">{nft.price} SepoliaETH</p>
        </div>
        {!nft.isListed  && <Button bg="bg-blue-800" textColor="text-white" btnText={"List"} className="min-w-fit py-0.5 text-sm" onClick={onClick}/>}
      </div>
    </div>
  </div>
  )
}

export default NFTCard