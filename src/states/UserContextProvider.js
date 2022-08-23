import React, { createContext, useEffect, useState } from 'react';

export const UserContext = createContext(null);

const UserProvider = ({ children }) => {

  const [initialized, setInitialized] = useState(false);
  const [user, setUser] = useState(null);
  const [developerMode, setDeveloperMode] = useState(false);

  useEffect(() => {
    if (user == null || initialized)
      return;

    setInitialized(true);

    if(user.isDeveloper) {
      console.log('Dev mode enabled');
      setDeveloperMode(true);
    }

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
