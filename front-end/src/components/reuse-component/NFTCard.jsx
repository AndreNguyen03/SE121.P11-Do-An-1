import React from 'react';
import { useNavigate } from 'react-router-dom';

const NFTCard = ({ nft, onBuy }) => {
  const { image, name, price, discountedPrice, onSale, tokenId, stock } = nft;
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/nft/${tokenId}`);
  };

  return (
    <div className="relative border p-4 rounded-lg shadow-lg hover:shadow-xl bg-white">
      {/* Sale Label */}
      {onSale && (
        <span className="absolute top-2 left-2 bg-black text-white text-sm px-2 py-1 rounded-md">
          Sale!
        </span>
      )}

      {/* NFT Image */}
      <img
        src={image}
        alt={name}
        className="w-full h-40 object-cover rounded-lg mb-4 cursor-pointer"
        onClick={handleCardClick}
      />

      {/* NFT Details */}
      <h3
        className="text-lg font-bold mb-2 cursor-pointer"
        onClick={handleCardClick}
      >
        {name}
      </h3>
      <div className="text-gray-600">
        {discountedPrice ? (
          <>
            <span className="line-through text-red-500">${price}</span>{' '}
            <span className="text-green-600 font-semibold">${discountedPrice}</span>
          </>
        ) : (
          <span className="font-semibold">${price}</span>
        )}
      </div>
      {!stock && <span className="text-sm text-red-500 mt-2 block">Out of Stock</span>}

      {/* Buy Button */}
      {stock && (
        <button
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700"
          onClick={onBuy}
        >
          Buy
        </button>
      )}
    </div>
  );
};

export default NFTCard;
