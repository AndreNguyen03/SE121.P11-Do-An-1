import React from 'react'

function Paper({children, className}) {
  return (
    <div className={`${className} py-5 px-5 bg-white h-full rounded shadow-md w-[250px]`}>
        {children}
    </div>
  )
}

export default Paper