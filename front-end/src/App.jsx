import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import LandingPage from "./pages/LandingPage"
import Discovery from "./pages/Discovery"
import Mint from "./pages/Mint"
import { WalletProvider } from "./context/WalletContext"
import NFTDetailDiscovery from "./pages/NFTDetailDiscovery"
import Profile from "./pages/Profile"

export default function App() {
  return (
    <WalletProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/discovery" element={<Discovery />} />
          <Route path="/mint" element={<Mint />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/nft/:id" element={<NFTDetailDiscovery />} />
        </Routes>
      </Router>
    </WalletProvider>
  )
}