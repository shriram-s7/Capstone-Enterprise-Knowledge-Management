import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, UserRole } from '../types/auth';
import {
  loginApi,
  logoutApi,
  fetchCurrentUserApi,
  changePasswordApi
} from '../services/authApi';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  role: UserRole | null;
  login: (corporate_email: string, password: string, remember_me?: boolean) => Promise<User>;
  logout: () => Promise<void>;
  changePassword: (current_password: string, new_password: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => {
    return sessionStorage.getItem('finnova_auth_token') || localStorage.getItem('finnova_auth_token');
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Restore session from token on initial mount
  const refreshUser = useCallback(async () => {
    const savedToken = token || sessionStorage.getItem('finnova_auth_token') || localStorage.getItem('finnova_auth_token');
    if (!savedToken) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const userData = await fetchCurrentUserApi(savedToken);
      setUser(userData);
      setToken(savedToken);
    } catch (err) {
      // Invalid or expired token
      sessionStorage.removeItem('finnova_auth_token');
      localStorage.removeItem('finnova_auth_token');
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (corporate_email: string, password: string, remember_me: boolean = false): Promise<User> => {
    setIsLoading(true);
    try {
      const payload = await loginApi(corporate_email, password, remember_me);
      setToken(payload.token);
      setUser(payload.user);

      if (remember_me) {
        localStorage.setItem('finnova_auth_token', payload.token);
      } else {
        sessionStorage.setItem('finnova_auth_token', payload.token);
      }
      return payload.user;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    const currentToken = token;
    sessionStorage.removeItem('finnova_auth_token');
    localStorage.removeItem('finnova_auth_token');
    setToken(null);
    setUser(null);

    if (currentToken) {
      try {
        await logoutApi(currentToken);
      } catch (e) {
        // Ignore network failure on logout
      }
    }
  };

  const changePassword = async (current_password: string, new_password: string) => {
    await changePasswordApi(current_password, new_password, token);
    // After changing password, refresh user
    await refreshUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user && !!token,
        role: user?.role || null,
        login,
        logout,
        changePassword,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
