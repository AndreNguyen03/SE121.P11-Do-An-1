import React from 'react'
import {motion} from 'framer-motion';
import heroImg from '../../assets/nft1.jpeg'

function HeroImg() {
  return (
    <motion.img 
        src={heroImg}
        alt='Hero Image'
        className=' rounded-3xl mt-14 lg:mt-0 w-full lg:w-1/3'
        animate={{
            y: [0,-20,0]
        }}
        transition={{
            duration:2,
            ease:'easeInOut',
            repeat:Infinity,
        }}
    />
  )
}

export default HeroImg