import React, { createContext, useState, useContext } from 'react';

export const AuthContext = createContext();

// Role constants
export const ROLES = {
  INSTITUTE_ADMIN: 'INSTITUTE_ADMIN',
  DEPARTMENT_ADMIN: 'DEPARTMENT_ADMIN'
};

export const AuthProvider = ({ children }) => {
  // Start with no user (will show login page)
  const [user, setUser] = useState(null);

  const login = (data) => setUser(data);
  const logout = () => setUser(null);

  // Role checking utilities
  const isInstituteAdmin = () => {
    return user?.role === ROLES.INSTITUTE_ADMIN;
  };

  const isDepartmentAdmin = () => {
    return user?.role === ROLES.DEPARTMENT_ADMIN;
  };

  const getUserRole = () => {
    return user?.role || null;
  };

  const getUserDepartment = () => {
    return user?.department || null;
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        login, 
        logout,
        isInstituteAdmin,
        isDepartmentAdmin,
        getUserRole,
        getUserDepartment
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
