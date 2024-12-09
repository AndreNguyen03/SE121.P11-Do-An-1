import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import LandingPage from "./pages/LandingPage"
import Discovery from "./pages/Discovery"
import Mint from "./pages/Mint"
import List from "./pages/List"
import { WalletProvider } from "./context/WalletContext"

export default function App() {
  return (
    <WalletProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/discovery" element={<Discovery />} />
          <Route path="/mint" element={<Mint />} />
          <Route path="/list" element={<List />} />
        </Routes>
      </Router>
    </WalletProvider>
  )
}