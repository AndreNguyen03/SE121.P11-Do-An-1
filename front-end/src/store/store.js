import { configureStore } from '@reduxjs/toolkit';
import nftReducer from './nftSlice';
import profileNftReducer from './profileNftSlice';

export const store = configureStore({
  reducer: {
    nft: nftReducer,
    profileNft: profileNftReducer
  },
});


