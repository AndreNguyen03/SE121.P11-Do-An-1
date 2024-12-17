import { createContext, useContext, useState } from "react";

const SudokuContext = createContext();

export const SudokuProvider = ({children}) => {
    const [sudokuInfo, setSudokuInfo] = useState({
        fault: 0,
        time: 0,
        completed: false
    });

    return (
        <SudokuContext.Provider value={{sudokuInfo, setSudokuInfo}}>
            {children}
        </SudokuContext.Provider>
    )
}

export const useSudokuContext = () => useContext(SudokuContext);