import { createContext, useContext, useState } from 'react';
import { login as loginRequest } from '../api/leads';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [email, setEmail] = useState(localStorage.getItem('crm_email'));

  const login = async (emailInput, password) => {
    const data = await loginRequest(emailInput, password);
    localStorage.setItem('crm_token', data.token);
    localStorage.setItem('crm_email', data.email);
    setEmail(data.email);
  };

  const logout = () => {
    localStorage.removeItem('crm_token');
    localStorage.removeItem('crm_email');
    setEmail(null);
  };

  const isAuthenticated = Boolean(localStorage.getItem('crm_token'));

  return (
    <AuthContext.Provider value={{ email, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
