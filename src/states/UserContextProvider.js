import React, { createContext, useEffect, useState } from 'react';

export const UserContext = createContext(null);

const UserProvider = ({ children }) => {

  const [user, setUser] = useState(null);

  useEffect(() => {
    if (user == null)
      return;
    console.log('Current user is', user?.userName);
  }, [user]);

  return (
    <UserContext.Provider value={{
      user,
      setUser
    }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
