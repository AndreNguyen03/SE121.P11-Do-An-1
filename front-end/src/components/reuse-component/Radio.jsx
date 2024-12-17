import React from 'react'

function Radio({btnText, name, forLabel, id, checked, onChange}) {
    return (
        <div className='flex items-center gap-3 mb-3'>
            <input type='radio' id={id} name={name}  checked={checked} onChange={onChange} className='w-[20px] h-[20px] cursor-pointer' />
            <label htmlFor={forLabel} className='select-none cursor-pointer'>{btnText}</label>
        </div>
    )
}

export default Radio