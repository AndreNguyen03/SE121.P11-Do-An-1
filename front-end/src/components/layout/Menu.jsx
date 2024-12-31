import React, { useState } from 'react'
import { IoMdMenu } from 'react-icons/io'
import { Link } from 'react-router-dom';
import Button from '../reuse-component/Button';
import { MdClose } from 'react-icons/md';

function Menu() {

    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    }

    return (
        <div className='block lg:hidden'>
            <button onClick={toggleMenu}>
                {!isOpen ? <IoMdMenu className='text-xl text-black' /> : <MdClose className='text-xl text-red-500'/>}
            </button>
            <div className={`lg:hidden ${isOpen ? 'flex flex-col p-6 absolute left-0 bg-blue-300 w-full items-center gap-4 text-lg top-14' : 'hidden'}`}>
                <Link to="/Explore">Explore</Link>
                <Link to="/Create">Create</Link>
                <Link to="/list">List</Link>
                <Button bg="bg-blue-500" textColor="text-white" btnText="Connect Wallet" />
            </div>
        </div>
    )
}

export default Menu