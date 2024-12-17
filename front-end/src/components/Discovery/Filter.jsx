import React, { useState } from 'react'
import Paper from '../reuse-component/Paper'
import Radio from '../reuse-component/Radio'

function Filter() {

  const [selectedOption, setSelectedOption] = useState('alphabet');
  
  const handleChange = (e) => {
    setSelectedOption(e.target.id);
  }

  return (
    <div className='flex flex-col items-center gap-3'>
      <div className="relative bg-white w-[250px] shadow-md">
        <input type="text" id="default_outlined" className="block px-2.5 pb-2.5 pt-4 w-full text-[1rem] text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500  focus:ring-1 focus:outline-none focus:border-blue-600 peer " placeholder=" " />
        <label htmlFor="default_outlined" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Search NFTs</label>
      </div>

      <Paper>
        <Radio btnText={'Alphabet'} name={'checkbox-group'} forLabel={'alphabet'} id={'alphabet'} checked={selectedOption == 'alphabet'} onChange={handleChange}/>
        <Radio btnText={'Price - High to low'} name={'checkbox-group'} forLabel={'hightolow'} id={'hightolow'}  checked={selectedOption == 'hightolow'} onChange={handleChange}/>
        <Radio btnText={'Price - Low to high'} name={'checkbox-group'} forLabel={'lowtohigh'} id={'lowtohigh'} checked={selectedOption == 'lowtohigh'} onChange={handleChange}/>
        <Radio btnText={'Rarity'} name={'checkbox-group'} forLabel={'rarity'} id={'rarity'} checked={selectedOption == 'rarity'} onChange={handleChange}/>
      </Paper>
    </div>
  )
}

export default Filter