import localeReducer, {
  setLanguage,
  toggleLanguage,
  LocaleState,
} from '../localeSlice';

describe('localeSlice', () => {
  const initialState: LocaleState = {
    language: 'en',
  };

  it('should handle initial state', () => {
    expect(localeReducer(undefined, { type: 'unknown' })).toEqual({
      language: 'en',
    });
  });

  it('should handle setLanguage to Hindi', () => {
    const actual = localeReducer(initialState, setLanguage('hi'));
    expect(actual.language).toEqual('hi');
  });

  it('should handle setLanguage to English', () => {
    const state: LocaleState = { language: 'hi' };
    const actual = localeReducer(state, setLanguage('en'));
    expect(actual.language).toEqual('en');
  });

  it('should handle toggleLanguage from English to Hindi', () => {
    const actual = localeReducer(initialState, toggleLanguage());
    expect(actual.language).toEqual('hi');
  });

  it('should handle toggleLanguage from Hindi to English', () => {
    const state: LocaleState = { language: 'hi' };
    const actual = localeReducer(state, toggleLanguage());
    expect(actual.language).toEqual('en');
  });

  it('should persist language preference', () => {
    const newState = localeReducer(initialState, setLanguage('hi'));
    expect(newState.language).toBe('hi');

    // Verify state is immutable
    expect(initialState.language).toBe('en');
  });
});
