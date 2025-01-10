import React from 'react'
import Button from './Button'
import dfinity from "../../assets/dfinity.svg";
import { useNavigate } from 'react-router-dom';
function NFTCardLandingPage({nft, onClick}) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/nft/${nft.tokenId}`, { state: { nft } }); // Điều hướng đến NFTDetail với id
  };
  return (
    <div  className="cursor-pointer w-[250px] h-[350px] rounded overflow-hidden m-2 bg-[#d8dfe7a5] text-white mx-auto shadow shadow-blue-500 transform hover:-translate-y-1 hover:scale-105 transition-transform duration-200 ease-in-out">
    <img className="w-full h-auto object-cover" src={nft.metadata.image} alt={nft.metadata.name} loading="lazy" />
    <div className="p-2  space-y-2">
      <div className='flex justify-between items-center'>
        {!nft.isListed  && <Button bg="bg-blue-800" textColor="text-white" btnText={"List"} className="min-w-fit px-6 text-sm" onClick={onClick}/>}
      </div>
    </div>
  </div>
  )
}

export default NFTCardLandingPage