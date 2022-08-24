import React, { createContext, useEffect, useState } from 'react';

export const UserContext = createContext(null);

const UserProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [developerMode, setDeveloperMode] = useState(false);

  useEffect(() => {
    if (user == null)
      return;
    console.log('Current user is', user?.username);
  }, [user]);

  return (
    <UserContext.Provider value={{
      user,
      setUser,
      developerMode,
      setDeveloperMode,
    }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
