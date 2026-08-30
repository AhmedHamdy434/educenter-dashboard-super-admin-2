import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AuthUser } from '@/types/auth.types';
import { authApi } from '@/api/auth.api';

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = (accessToken: string, authUser: AuthUser) => {
    localStorage.setItem('token', accessToken);
    localStorage.setItem('user', JSON.stringify(authUser));
    setToken(accessToken);
    setUser(authUser);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    window.location.href = '/login';
  };

  const refreshUser = async () => {
    try {
      const response = await authApi.getProfile();
      if (response.success && response.data) {
        const updatedUser = response.data as AuthUser;
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
      }
    } catch (error) {
      console.error('Failed to refresh user profile:', error);
      logout();
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        try {
          const parsedUser = JSON.parse(storedUser) as AuthUser;
          setUser(parsedUser);
          // Optional: refresh user from server to verify token validity
          const response = await authApi.getProfile();
          if (response.success && response.data) {
            setUser(response.data as AuthUser);
          } else {
            logout();
          }
        } catch {
          logout();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && user?.role === 'SUPER_ADMIN',
        isLoading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
