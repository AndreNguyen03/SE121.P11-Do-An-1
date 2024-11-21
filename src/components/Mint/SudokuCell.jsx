import React from 'react'

function SudokuCell({ handleChange, value, rowIndex, colIndex }) {
    return (
        <input
            type="text"
            value={value}
            maxLength={1}
            min={1}
            max={6}
            onChange={(e) => handleChange(rowIndex, colIndex, e.target.value)}
            className='rounded w-[100px] h-[100px] text-center text-3xl border-solid focus:ring-2 focus:outline-none border-blue-200 border-[2px] text-blue-500'
        />
    )
}

export default SudokuCell