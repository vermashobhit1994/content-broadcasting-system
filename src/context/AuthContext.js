"use client";

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Persist user session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  /**
   * Simulated Login Logic
   * Section 8 requirement: Role-based access control (RBAC)
   */
  const login = async (email, password) => {
    // Artificial delay to simulate API call for UI loading states
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Determine role: Email containing 'admin' is Principal, else Teacher
    const role = email.toLowerCase().includes('admin') ? 'principal' : 'teacher';
    
    const userData = {
      email,
      role,
      token: "mock-jwt-token-12345",
    };

    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    return userData; // Return data so the UI can redirect immediately
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};