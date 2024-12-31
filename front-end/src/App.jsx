import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import LandingPage from "./pages/LandingPage"
import Explore from "./pages/Explore"
import Create from "./pages/Create"
import { WalletProvider } from "./context/WalletContext"
import NFTDetailDiscovery from "./pages/NFTDetailDiscovery"
import Profile from "./pages/Profile"
import ViewProfile from "./pages/ViewProfile"
import NotFound from "./pages/NotFound"

export default function App() {
  return (
    <WalletProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/Explore" element={<Explore />} />
            <Route path="/Create" element={<Create />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:walletAddress" element={<ViewProfile />} />
            <Route path="/nft/:id" element={<NFTDetailDiscovery />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
    </WalletProvider>
  )
}