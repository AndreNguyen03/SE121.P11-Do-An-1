import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function UserCard({ user }) {
  const navigate = useNavigate();

  console.log("Dữ liệu user trong UserCard:", user);


  

  const handleCardClick = () => {
    if (!user.walletAddress) {
      console.error("walletAddress của user bị undefined:", user);
      return;
    }
  
    const navigationState = {
      owner: user.walletAddress,
      userInfo: {
        name: user.username,
        image: user.avatar,
        bio: user.bio,
        followedUsers: user.followedUsers || [],
      },
    };

  
    console.log("Điều hướng với state:", navigationState);
    navigate(`/profile/${user.walletAddress}`, { state: navigationState });
  };
  


  return (
    <div className="border rounded-lg shadow-md p-4 hover:shadow-lg transition bg-white"
      
      >
      <img
        src={user.avatar}
        alt={user.username}
        className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
      />
      <h3 className="text-lg font-bold text-center">{user.username}</h3>
      <p className="text-sm text-gray-600 text-center mb-3">{user.bio}</p>
      <p className="text-center text-sm text-gray-500">
        <strong>{user.itemsOwned}</strong> items owned
      </p>
      <button
        className={`mt-4 w-full py-2 rounded-lg text-white bg-blue-500 hover:bg-blue-600 transition`}
        onClick={handleCardClick}
      >
        View Profile
      </button>
    </div>
  );
}

export default UserCard;
