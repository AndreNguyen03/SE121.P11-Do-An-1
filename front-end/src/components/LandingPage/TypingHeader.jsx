import React from 'react'
import Typewriter from 'typewriter-effect';


function TypingHeader() {
  return (
    <h1 className='text-xl lg:text-6xl'>
      <span>Unlock the Future of Digital </span>
      <Typewriter
        options={{
          strings: [
            'Artistry',
            'Collectibles',
            'Assets'
          ],
          autoStart: true,
          loop: true,
          delay: 100, 
          deleteSpeed: 50,
        }}
      />
    </h1>
  )
}

export default TypingHeader