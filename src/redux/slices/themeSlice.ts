import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ThemeName = 'Sunset Glow' | 'Autumn Harvest' | 'Harvest Moon';

export interface ThemeColors {
  primary: string;
  secondary: string;
  tertiary: string;
  accent: string;
  highlight: string;
}

export interface ThemeOption {
  name: ThemeName;
  colors: ThemeColors;
}

export const themes: Record<ThemeName, ThemeColors> = {
  'Sunset Glow': {
    primary: '#FF4500',
    secondary: '#FF6347',
    tertiary: '#FFA07A',
    accent: '#FFD700',
    highlight: '#F4C430',
  },
  'Autumn Harvest': {
    primary: '#8B4513',
    secondary: '#D2691E',
    tertiary: '#FF8C00',
    accent: '#FFA500',
    highlight: '#F4C430',
  },
  'Harvest Moon': {
    primary: '#8B0000',
    secondary: '#B22222',
    tertiary: '#FF4500',
    accent: '#FFA500',
    highlight: '#F4C430',
  },
};

interface ThemeState {
  currentTheme: ThemeName;
  colors: ThemeColors;
}

const initialState: ThemeState = {
  currentTheme: 'Sunset Glow',
  colors: themes['Sunset Glow'],
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<ThemeName>) => {
      state.currentTheme = action.payload;
      state.colors = themes[action.payload];
    },
  },
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;
