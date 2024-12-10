import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { SudokuProvider } from './context/SudokuContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SudokuProvider>
      <App />
    </SudokuProvider>
  </StrictMode>,
)
