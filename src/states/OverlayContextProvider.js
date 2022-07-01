import React, { createContext, useState } from 'react';
import AlertModal from '../components/overlays/AlertModal';
import BottomModal from '../components/overlays/BottomModal';

export const OverlayContext = createContext(null);

const OverlayContextProvider = ({ children }) => {

  const [showAlertModal, setShowAlertModal] = useState(null);
  const [showBottomAlert, setShowBottomAlert] = useState(null);

  const sendAlert = (title = 'My alert', description = 'My description', denyText = 'Cancel', validateText = 'Ok') => {
    return new Promise((resolve) => {
      setShowAlertModal({
        title,
        description,
        denyText,
        validateText,
        onPressValidate: () => {
          resolve(true);
          setShowAlertModal(null);
        },
        onPressDeny: () => {
          resolve(false);
          setShowAlertModal(null);
        },
      });
    });
  };

  const sendBottomAlert = (title = 'Oops, we could not send this dropy into outer space...', description = 'We\'ll try again when your internet connection gets better') => {
    return new Promise((resolve) => {
      setShowBottomAlert({
        title,
        description,
        onPressClose: () => {
          resolve(true);
          setShowBottomAlert(null);
        },
      });
    });
  };

  return (
    <OverlayContext.Provider value={{
      sendAlert,
      sendBottomAlert,
    }}>
      {children}
      <BottomModal visible={showBottomAlert != null} {...showBottomAlert} />
      <AlertModal visible={showAlertModal != null} {...showAlertModal} />
    </OverlayContext.Provider>
  );
};

export default OverlayContextProvider;
