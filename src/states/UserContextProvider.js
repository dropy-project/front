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
    const loadCustomUrls = async () => {
      const customUrls = await Storage.getItem('@custom_urls');
      if (!customUrls)
        return;
      setCustomUrls(customUrls);
    };

    loadCustomUrls();
  }, []);

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <UserContext.Provider value={{
      user,
      developerMode,
      customUrls,
      setDeveloperMode,
      setCustomUrls,
      setUser,
    }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
