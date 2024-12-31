import { createRoot } from 'react-dom/client'
import './index.css'
import { store } from './store/store.js'
import { Provider } from 'react-redux'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LandingPage from './pages/LandingPage.jsx'
import Profile from './pages/Profile.jsx'
import Discovery from './pages/Discovery.jsx'
import Mint from './pages/Mint.jsx'
import ViewProfile from './pages/ViewProfile.jsx'
import NFTDetailDiscovery from './pages/NFTDetailDiscovery.jsx'
import NotFound from './pages/NotFound.jsx'
import { WalletProvider } from './context/WalletContext.jsx'


const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { path: '/profile', element: <Profile /> },
  { path: '/discovery', element: <Discovery /> },
  { path: '/mint', element: <Mint /> },
  { path: '/profile/:walletAddress', element: <ViewProfile /> },
  { path: '/nft/:id', element: <NFTDetailDiscovery /> },
  { path: '*', element: <NotFound /> },
]);


createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <WalletProvider>
        <RouterProvider router={router} />
    </WalletProvider>
  </Provider>
)
