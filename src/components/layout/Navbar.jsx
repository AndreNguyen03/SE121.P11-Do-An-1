import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../reuse-component/Button'
import Menu from './Menu'
import { useWalletContext } from '../../context/WalletContext';

function Navbar() {
    const { isConnected, connectWallet, account } = useWalletContext();
    const [buttonText,setButtonText] = useState("Connect Wallet")


    useEffect(() => {
        if (isConnected) {
          setButtonText(`${account.substring(0, 6)}...${account.substring(account.length - 4)}`); // Hiển thị tài khoản ngắn
        } else {
          setButtonText("Connect Wallet");
        }
      }, [isConnected, account]);

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
                <Link to="/list">List</Link>
                <Button bg="bg-blue-500" textColor="text-white" btnText={buttonText} onClick={connectWallet}/>
            </div>
            <Menu />
        </div>
    </nav>
  )
}

export default Navbar

