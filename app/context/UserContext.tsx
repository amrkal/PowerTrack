import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of the user data
interface User {
  prices_tag: number;
}

// Create a context with default values
const UserContext = createContext<{ user: User; setUser: React.Dispatch<React.SetStateAction<User>> } | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// UserProvider component to wrap the app
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>({ prices_tag: 5 }); // Set default prices_tag value

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
