import React, { useEffect, useState } from 'react';
import SudokuCell from './SudokuCell';
import { generateSudoku6x6, createPuzzle } from './helpers/createPuzzle';

function Sudoku({ onUpdate, sudokuInfo }) {
  const [error, setError] = useState("");
  const [invalidCells, setInvalidCells] = useState([]);
  const [fullGrid] = useState(() => generateSudoku6x6());
  const [initialPuzzle] = useState(() => createPuzzle(fullGrid, 16));
  const [currentPuzzle, setCurrentPuzzle] = useState(initialPuzzle);

  // Store pre-filled cells
  const initialCells = initialPuzzle.reduce((acc, row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (cell !== null) acc.push(`${rowIndex}-${colIndex}`);
    });
    return acc;
  }, []);


  const handleChange = (row, col, value) => {
    if (value === "") {
      updateCell(row, col, null);
      setInvalidCells(prev => prev.filter(cell => cell !== `${row}-${col}`));
      return;
    }

    const intValue = parseInt(value, 10);
    if (isNaN(intValue) || intValue < 1 || intValue > 6) {
      onUpdate(prev => ({ ...prev, fault: prev.fault + 1 }));
      setError("Chỉ được nhập số từ 1 đến 6!");
      return;
    }

    updateCell(row, col, intValue);

    const isCorrect = intValue === fullGrid[row][col];
    updateInvalidCells(row, col, isCorrect);
    if (!isCorrect) {
      onUpdate(prev => ({ ...prev, fault: prev.fault + 1 }));
    }

    setError("");
  };

  const updateCell = (row, col, value) => {
    const newPuzzle = currentPuzzle.map((r, rowIndex) =>
      r.map((cell, colIndex) =>
        rowIndex === row && colIndex === col ? value : cell
      )
    );
    setCurrentPuzzle(newPuzzle);
  };

  const updateInvalidCells = (row, col, isCorrect) => {
    setInvalidCells(prev => {
      if (isCorrect) {
        return prev.filter(cell => cell !== `${row}-${col}`);
      } else {
        return [...prev, `${row}-${col}`];
      }
    });
  };

  const checkCompletion = () => {
    const isComplete = currentPuzzle.every((row, rowIndex) =>
      row.every((cell, colIndex) => cell === fullGrid[rowIndex][colIndex])
    );
    onUpdate(prev => ({ ...prev, completed: isComplete }));
  };

  useEffect(() => {
    checkCompletion();
    console.log(`12`)
  }, [currentPuzzle, onUpdate]);

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleAutoFill = () => {
    const newPuzzle = currentPuzzle.map((row, rowIndex) =>
      row.map((cell, colIndex) => {
        // Nếu ô trống, điền giá trị đúng từ fullGrid
        if (cell === null) {
          return fullGrid[rowIndex][colIndex];
        }
        return cell;
      })
    );
    setCurrentPuzzle(newPuzzle);
  };

  return (
    <div className="flex flex-col items-center p-4">
      <div className="mb-4 flex justify-between w-full">
        <span className="text-lg">⏱️ Timer: {formatTime(sudokuInfo.time)}</span>
        <br />
        <span className="text-lg">❌ Fault: {sudokuInfo.fault}</span>
        <br />
      </div>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <button
        onClick={handleAutoFill}
        className="bg-blue-500 text-white py-2 px-4 rounded mb-4"
      >
        Test
      </button>
      <div className="grid grid-cols-6 gap-3">
        {currentPuzzle.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const isEditable = !initialCells.includes(`${rowIndex}-${colIndex}`) || invalidCells.includes(`${rowIndex}-${colIndex}`);
            const isInvalid = invalidCells.includes(`${rowIndex}-${colIndex}`);
            return (
              <SudokuCell
                key={`${rowIndex}-${colIndex}`}
                value={cell}
                isEditable={isEditable}
                isInvalid={isInvalid}
                onChange={(e) => handleChange(rowIndex, colIndex, e.target.value)}
              />
            );
          })
        )}
      </div>
    </div>
  );
}

export default Sudoku;
