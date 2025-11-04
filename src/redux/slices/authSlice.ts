'use client';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type UserRole = 'admin' | 'user';
export type AuthUser = { username: string; role: UserRole } | null;

// Hardcoded users (demo only)
export const HARDCODED_USERS = {
  admin: { username: 'admin', password: 'admin123', role: 'admin' as UserRole },
  user: { username: 'user', password: 'user123', role: 'user' as UserRole },
};

type AuthState = {
  user: AuthUser;
};

const initialState: AuthState = { user: null };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<{ username: string; role: UserRole }>) {
      state.user = { username: action.payload.username, role: action.payload.role };
    },
    logout(state) {
      state.user = null;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
