import React, { useState } from 'react';

function UserCard({ user }) {
  const [isFollowed, setIsFollowed] = useState(user.isFollowed);

  const handleFollowToggle = () => {
    setIsFollowed((prev) => !prev);
  };

  return (
    <div className="border rounded-lg shadow-md p-4 hover:shadow-lg transition">
      <img
        src={user.avatar}
        alt={user.username}
        className="w-24 h-24 rounded-full mx-auto mb-4"
      />
      <h3 className="text-lg font-bold text-center">{user.username}</h3>
      <p className="text-sm text-gray-600 text-center mb-3">{user.bio}</p>
      <p className="text-center text-sm text-gray-500">
        <strong>{user.itemsOwned}</strong> items owned
      </p>
      <button
        className={`mt-4 w-full py-2 rounded-lg text-white ${
          isFollowed ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
        }`}
        onClick={handleFollowToggle}
      >
        {isFollowed ? 'Unfollow' : 'Follow'}
      </button>
    </div>
  );
}

export default UserCard;
