import React from 'react'
import TypingHeader from './TypingHeader'
import Button from '../reuse-component/Button'
import { Link } from 'react-router-dom'
import HeroImg from './HeroImg'
function Hero() {
  return (
    <div className='flex flex-col lg:flex-row justify-around items-center'>
      <aside className='w-1/2 text-black space-y-4 lg:space-y-8'>
        <TypingHeader />
        <p className='text-md lg:text-xl'>Dive to the Universe Where Creativity Meets Blockchain. Explore Exclusive NFTs, Curated Just For You</p>
        <div className='flex items-center gap-7'>
          <Link to={'/discovery'}>
            <Button bg={'bg-blue-700'} textColor={'text-white'} btnText={'Discover'} className={'text-xl font-bold px-8'} />
          </Link>
          <Link to={'/mint'}>
            <Button border='border border-black' textColor={'text-black'} btnText={'Mint'} className={'shadow-none text-xl font-bold'} />
          </Link>
        </div>
      </aside>
      <HeroImg />
    </div>
  )
}

export default Hero