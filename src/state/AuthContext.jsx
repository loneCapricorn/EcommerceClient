import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { login as apiLogin, register as apiRegister } from '../api/auth.js';

const AuthContext = createContext(null);

function decodeJwt(token) {
  try {
    const payload = token.split('.')[1];
    const json = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return json;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [claims, setClaims] = useState(() => (token ? decodeJwt(token) : null));

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      setClaims(decodeJwt(token));
    } else {
      localStorage.removeItem('token');
      setClaims(null);
    }
  }, [token]);

  const isAuthenticated = !!token;
  const roles = (claims && (claims.role || claims['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'])) || [];
  const isAdmin = Array.isArray(roles) ? roles.includes('Admin') : roles === 'Admin';

  async function login(email, password) {
    const t = await apiLogin(email, password);
    setToken(t);
    return t;
  }

  async function register(name, email, password) {
    return apiRegister(name, email, password);
  }

  function logout() {
    setToken(null);
  }

  const value = useMemo(() => ({ token, claims, isAuthenticated, isAdmin, login, register, logout }), [token, claims, isAuthenticated, isAdmin]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}