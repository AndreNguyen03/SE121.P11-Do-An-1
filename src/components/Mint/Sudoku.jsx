import React, { useState } from 'react'
import SudokuCell from './SudokuCell'

function Sudoku() {
    const initialGrid = [
        [1, null, null, null, 4, null],
        [null, null, 6, null, null, 3],
        [null, 4, null, 1, null, null],
        [null, null, 5, null, 6, null],
        [5, null, null, 3, null, null],
        [null, null, null, null, null, null],
      ];
    
      const [grid, setGrid] = useState(initialGrid);
    
      const handleChange = (row, col, value) => {
        const num = parseInt(value, 10);
        if (!isNaN(num) && num >= 1 && num <= 6) {
          const newGrid = [...grid];
          newGrid[row][col] = num;
          setGrid(newGrid);
        } else if (value === "") {
          const newGrid = [...grid];
          newGrid[row][col] = null;
          setGrid(newGrid);
        }
      };
    
      return (
        <div className='grid grid-cols-[repeat(6,100px)] gap-3'>
          {grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <SudokuCell key={`${rowIndex}-${colIndex}`} value={cell || ""} handleChange={handleChange} rowIndex={rowIndex} colIndex={colIndex}/>
            ))
          )}
        </div>
      );
}

export default Sudoku