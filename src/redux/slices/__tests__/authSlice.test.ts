import authReducer, {
  setUser,
  setToken,
  logout,
  AuthState,
} from '../authSlice';

describe('authSlice', () => {
  const initialState: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
  };

  it('should handle initial state', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setUser', () => {
    const user = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      role: 'user',
    };

    const actual = authReducer(initialState, setUser(user));
    
    expect(actual.user).toEqual(user);
    expect(actual.isAuthenticated).toBe(true);
  });

  it('should handle setToken', () => {
    const token = 'mock-jwt-token';
    const actual = authReducer(initialState, setToken(token));
    
    expect(actual.token).toBe(token);
  });

  it('should handle logout', () => {
    const authenticatedState: AuthState = {
      user: {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
      },
      token: 'mock-token',
      isAuthenticated: true,
    };

    const actual = authReducer(authenticatedState, logout());
    
    expect(actual).toEqual(initialState);
    expect(actual.user).toBeNull();
    expect(actual.token).toBeNull();
    expect(actual.isAuthenticated).toBe(false);
  });

  it('should handle setting user and token together', () => {
    const user = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      role: 'user',
    };
    const token = 'mock-jwt-token';

    let state = authReducer(initialState, setUser(user));
    state = authReducer(state, setToken(token));

    expect(state.user).toEqual(user);
    expect(state.token).toBe(token);
    expect(state.isAuthenticated).toBe(true);
  });

  it('should maintain immutability', () => {
    const user = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      role: 'user',
    };

    const newState = authReducer(initialState, setUser(user));

    expect(initialState.user).toBeNull();
    expect(newState.user).toEqual(user);
  });
});
