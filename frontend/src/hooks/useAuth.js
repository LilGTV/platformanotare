import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Încercăm să obținem utilizatorul din localStorage la încărcarea componentei
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return {
    user,
    setUser,
    isAuthenticated: !!user,
    login: (userData) => {
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    },
    logout: () => {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setUser(null);
    }
  };
}; 