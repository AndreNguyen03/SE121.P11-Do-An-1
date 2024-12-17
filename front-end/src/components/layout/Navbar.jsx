import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../reuse-component/Button'
import Menu from './Menu'
import { useWalletContext } from '../../context/WalletContext';
import { ethers } from 'ethers';

function Navbar() {
  const { isConnected, connectWallet, account, logoutWallet, signer, provider, avatar, balance } = useWalletContext();
  const [dropdownVisible, setDropdownVisible] = useState(false);

  

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleLogout = () => {
    logoutWallet(); // Gọi hàm logout từ WalletContext
    setDropdownVisible(false); // Ẩn menu sau khi logout
    logoutWallet()
  };

  return (
    <nav className='fixed flex justify-between items-center w-full drop-shadow-xl border-b-4 p-4 px-6 lg:px-12 z-50 bg-white'>
      <Link to="/">
        <h1 className='text-lg font-bold'>
          <span className='bg-gradient-to-r from-lime-500 to-blue-400 bg-clip-text text-transparent'>Sudoku</span>
          <span className='ml-1'>NFT</span>
        </h1>
      </Link>
      <div>
        <div className='text-black hidden lg:flex gap-10 items-center font-medium'>
          <Link to="/discovery">Discovery</Link>
          <Link to="/mint">Mint</Link>
          <Link to="/profile">Profile</Link>
          {isConnected ? (
            <div className="relative">
              <div
                className="flex items-center gap-2 cursor-pointer p-2 bg-[#BAF6FD] rounded-full border border-[#BAF6FD]"
                onClick={toggleDropdown}
              >
                <img
                  src={avatar}
                  alt="avatar"
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm font-medium">
                  {balance} SepETH
                </span>
              </div>

              {dropdownVisible && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-lg py-2">
                  <button
                    className="block text-center w-full px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Button bg="bg-blue-500" textColor="text-white" btnText={"Connect Wallet"} onClick={connectWallet} />
          )}
        </div>
        <Menu />
      </div>
    </nav>
  )
}

export default Navbar

