import { createSlice } from '@reduxjs/toolkit';
import { User } from '/src/types/DataTypes';

type AuthState = {
  user: User | null;
};

const initialState: AuthState = {
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loggedIn(state, action) {
      state.user = action.payload;
    },
    loggedOut(state) {
      state.user = null;
    },
  },
});

export const { loggedIn, loggedOut } = authSlice.actions;
export default authSlice.reducer;
