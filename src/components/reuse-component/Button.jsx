import React from 'react'

function Button({border, bg, textColor, btnText, className}) {
  return (
    <button className={`py-2 px-4 min-w-28 rounded-full shadow-md 
    shadow-blue-500 transform transition-all duration-300 ease-in-out
    ${border} ${bg} ${textColor} ${className}`}>
        {btnText}
    </button>
  )
}

export default Button