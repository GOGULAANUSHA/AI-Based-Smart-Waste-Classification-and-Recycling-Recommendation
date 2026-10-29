import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserStats } from '../types';
import { api, authStorage } from '../services/api';

interface AuthContextType {
  user: User | null;
  stats: UserStats | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  demoLogin: (accountType: 'champion' | 'student') => Promise<void>;
  register: (name: string, email: string, password: string, location?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshMe: () => Promise<void>;
  updateProfile: (name: string, location: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshMe = async () => {
    const token = authStorage.getToken();
    if (!token) {
      setUser(null);
      setStats(null);
      setLoading(false);
      return;
    }

    try {
      const data = await api.getMe();
      setUser(data.user);
      setStats(data.stats);
    } catch (err) {
      console.warn('Session expired or invalid, clearing local session:', err);
      authStorage.removeToken();
      setUser(null);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshMe();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.login(email, password);
    authStorage.setToken(res.token);
    setUser(res.user);
    await refreshMe();
  };

  const demoLogin = async (accountType: 'champion' | 'student') => {
    const res = await api.demoLogin(accountType);
    authStorage.setToken(res.token);
    setUser(res.user);
    await refreshMe();
  };

  const register = async (name: string, email: string, password: string, location?: string) => {
    const res = await api.register(name, email, password, location);
    authStorage.setToken(res.token);
    setUser(res.user);
    await refreshMe();
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch {
      // Continue cleanup
    }
    setUser(null);
    setStats(null);
  };

  const updateProfile = async (name: string, location: string) => {
    const res = await api.updateProfile({ name, location });
    setUser(res.user);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        stats,
        loading,
        login,
        demoLogin,
        register,
        logout,
        refreshMe,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
