import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  nfts: [],
  loading: false,
};

const nftSlice = createSlice({
  name: 'nfts',
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

export const { setNfts, setLoading } = nftSlice.actions;

export default nftSlice.reducer;
