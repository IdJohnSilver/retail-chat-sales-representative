import { create } from 'zustand';

const TOKEN_KEY = 'access_token';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  setToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>(() => {
  const token = localStorage.getItem(TOKEN_KEY);
  return {
    token,
    isAuthenticated: token !== null,
    setToken: (token: string) => {
      localStorage.setItem(TOKEN_KEY, token);
      useAuthStore.setState({ token, isAuthenticated: true });
    },
    logout: () => {
      localStorage.removeItem(TOKEN_KEY);
      useAuthStore.setState({ token: null, isAuthenticated: false });
    },
  };
});
