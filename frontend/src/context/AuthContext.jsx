import React, { createContext, useContext, useState, useEffect } from 'react';
import * as jwt_decode from 'jwt-decode';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      const parsed = JSON.parse(userStr);
      setUser({ ...parsed, id: parsed.id || parsed._id, token });
    } else if (token) {
      try {
        const decoded = jwt_decode.jwtDecode(token);
        setUser({ ...decoded, id: decoded.id || decoded._id, token });
      } catch {
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const login = (token, userObj) => {
    localStorage.setItem('token', token);
    if (userObj) {
      localStorage.setItem('user', JSON.stringify(userObj));
      setUser({ ...userObj, id: userObj.id || userObj._id, token });
    } else {
      const decoded = jwt_decode.jwtDecode(token);
      setUser({ ...decoded, id: decoded.id || decoded._id, token });
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 