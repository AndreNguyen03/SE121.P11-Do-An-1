import React from 'react'

const SudokuCell = ({ value, isEditable, onChange, isInvalid }) => {
    return (
      <input
        type="text"
        value={value || ""}
        onChange={onChange}
        className={`rounded-md w-[100px] h-[100px] text-3xl border text-center no-spinner 
          ${isEditable ? "bg-white" : "bg-blue-300"}
          ${isInvalid ? "border-red-500 bg-red-100 border-[2px]" : "border-gray-300"}
          focus:outline-none focus:ring-2 focus:ring-blue-500`}
        disabled={!isEditable}
      />
    );
  };
  
  export default SudokuCell;
  