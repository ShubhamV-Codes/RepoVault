import React, { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoaded, setAuthLoaded] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      setCurrentUser({ id: userId });
    }
    setAuthLoaded(true);
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, authLoaded }}>
      {children}
    </AuthContext.Provider>
  );
};
