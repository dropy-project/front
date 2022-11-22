import React, { createContext, useEffect, useState } from 'react';
import Storage from '../utils/storage';

export const UserContext = createContext(null);

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [developerMode, setDeveloperMode] = useState(false);
  const [customUrls, setCustomUrls] = useState(null);

  useEffect(() => {
    if (user == null)
      return;
    console.log('Local user profile loaded :', user?.username);
  }, [user]);

  useEffect(() => {
    loadStoredIPs();
  }, []);

  const loadStoredIPs = async () => {
    const customUrls = await Storage.getItem('@custom_urls');
    if (!customUrls)
      return;
    setCustomUrls(customUrls);
  };

  return (
    <UserContext.Provider value={{
      user,
      setUser,
      developerMode,
      setDeveloperMode,
      customUrls,
      setCustomUrls,
    }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
