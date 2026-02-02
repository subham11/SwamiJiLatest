import themeReducer, {
  setTheme,
  toggleTheme,
  ThemeState,
} from '../themeSlice';

describe('themeSlice', () => {
  const initialState: ThemeState = {
    mode: 'light',
  };

  it('should handle initial state', () => {
    expect(themeReducer(undefined, { type: 'unknown' })).toEqual({
      mode: 'light',
    });
  });

  it('should handle setTheme to dark', () => {
    const actual = themeReducer(initialState, setTheme('dark'));
    expect(actual.mode).toEqual('dark');
  });

  it('should handle setTheme to light', () => {
    const state: ThemeState = { mode: 'dark' };
    const actual = themeReducer(state, setTheme('light'));
    expect(actual.mode).toEqual('light');
  });

  it('should handle toggleTheme from light to dark', () => {
    const actual = themeReducer(initialState, toggleTheme());
    expect(actual.mode).toEqual('dark');
  });

  it('should handle toggleTheme from dark to light', () => {
    const state: ThemeState = { mode: 'dark' };
    const actual = themeReducer(state, toggleTheme());
    expect(actual.mode).toEqual('light');
  });

  it('should maintain immutability', () => {
    const newState = themeReducer(initialState, setTheme('dark'));
    
    expect(initialState.mode).toBe('light');
    expect(newState.mode).toBe('dark');
  });
});
