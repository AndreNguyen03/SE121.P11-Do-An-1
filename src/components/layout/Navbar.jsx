import React from 'react'
import { Link } from 'react-router-dom'
import Button from '../reuse-component/Button'
import Menu from './Menu'

function Navbar() {
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
                <Button bg="bg-blue-500" textColor="text-white" btnText="Connect Wallet"/>
            </div>
            <Menu />
        </div>
    </nav>
  )
}

export default Navbar