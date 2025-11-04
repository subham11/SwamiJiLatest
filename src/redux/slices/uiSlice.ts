import { createSlice } from "@reduxjs/toolkit";

type UIState = {
  activeMenu: string | null;
};

const initialState: UIState = { activeMenu: null };

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setActiveMenu: (state, action) => {
      state.activeMenu = action.payload;
    },
  }
});

export const { setActiveMenu } = uiSlice.actions;
export default uiSlice.reducer;
