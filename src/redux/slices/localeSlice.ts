import { createSlice } from "@reduxjs/toolkit";

type LocaleState = {
  locale: 'en' | 'hi';
};

const initialState: LocaleState = { locale: 'en' };

const localeSlice = createSlice({
  name: "locale",
  initialState,
  reducers: {
    setLocale: (state, action) => {
      state.locale = action.payload;
    }
  }
});

export const { setLocale } = localeSlice.actions;
export default localeSlice.reducer;
