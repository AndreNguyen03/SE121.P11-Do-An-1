import React, { useState } from 'react';
import Button from './Button';
import dfinity from "../../assets/dfinity.svg";
import { useNavigate } from 'react-router-dom';
import { useWalletContext } from '../../context/WalletContext';

function NFTCardProfile({ nft, onClick }) {
  const {account} = useWalletContext();
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/nft/${nft.tokenId}`, { state: { nft } }); // Điều hướng đến NFTDetail với id
    console.log(nft);
  };

  const handleWrapperClick = () => {
    if (nft.isListed) {
      handleCardClick(); // Chỉ điều hướng khi NFT chưa được liệt kê
    }
  };


  return (
    <div
      onClick={handleWrapperClick}
      className="cursor-pointer w-[250px] h-[350px] rounded overflow-hidden m-2 bg-[#d8dfe7a5] text-white mx-auto shadow shadow-blue-500 transform hover:-translate-y-1 hover:scale-105 transition-transform duration-200 ease-in-out relative"
    >
      <img className="w-full h-auto object-cover" src={nft.metadata.image} alt={nft.metadata.name} />

      <div className="p-2 pb-4 space-y-2">
        <h1 className="font-bold text-md text-blue-700">{nft.metadata.name}</h1>
        <div className="flex justify-between items-center pt-5">
          <div className="flex items-center gap-2">
            <img src={dfinity} alt="" className="w-6" />
            <p className="text-sm text-black"><strong>{!nft.isListed ? "" : `${nft.price} SepoliaETH`}</strong></p>
          </div>
          {!nft.isListed && nft.owner.toLowerCase() === account && (
            <Button
              bg="bg-blue-800"
              textColor="text-white"
              btnText={"List"}
              className="min-w-fit px-6 text-sm"
              onClick={(e) => {
                e.stopPropagation(); // Ngăn chặn sự kiện onClick lan đến thẻ chính
                onClick();
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default NFTCardProfile;
