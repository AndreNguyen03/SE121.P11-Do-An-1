
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  nfts: [],
  loading: false,
};

const profileNftSlice = createSlice({
  name: 'profileNfts', 
  initialState,
  reducers: {
    setNfts: (state, action) => {
      state.nfts = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setNfts, setLoading } = profileNftSlice.actions;

export default profileNftSlice.reducer;
