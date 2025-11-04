import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import uiReducer from "./slices/uiSlice";
import localeReducer from "./slices/localeSlice";
import themeReducer from "./slices/themeSlice";
import authReducer from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    locale: localeReducer,
    theme: themeReducer,
    auth: authReducer
  },
  devTools: process.env.NODE_ENV !== "production"
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
