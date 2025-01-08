import { createRoot } from 'react-dom/client'
import './index.css'
import { store } from './store/store.js'
import { Provider } from 'react-redux'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LandingPage from './pages/LandingPage.jsx'
import Profile from './pages/Profile.jsx'
import ViewProfile from './pages/ViewProfile.jsx'
import NFTDetailDiscovery from './pages/NFTDetailDiscovery.jsx'
import NotFound from './pages/NotFound.jsx'
import { WalletProvider } from './context/WalletContext.jsx'
import Explore from './pages/Explore.jsx'
import Create from './pages/Create.jsx'
import NFTDetail from './pages/NFTDetail.jsx'
import NFTListingPage from './pages/NFTListingPage.jsx'
import { ToastContainer } from 'react-toastify'


const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { path: '/profile', element: <Profile /> },
  { path: '/explore', element: <Explore /> },
  { path: '/Mint', element: <Create /> },
  { path: '/profile/:walletAddress', element: <ViewProfile /> },
  { path: '/nft/:id', element: <NFTDetailDiscovery /> },
  { path: '/nftdetail/:tokenId', element: <NFTDetail /> },
  { path: '*', element: <NotFound /> },
  { path: '/listing', element: <NFTListingPage /> },
]);


createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <WalletProvider>
        <RouterProvider router={router} />
      <ToastContainer position="top-right" autoClose={3000} />
    </WalletProvider>
  </Provider>
)
