import React, { createContext, useState } from 'react';
import AlertModal from '../components/overlays/AlertModal';
import BottomModal from '../components/overlays/BottomModal';
import Haptics from '../utils/haptics';

export const OverlayContext = createContext(null);

const OverlayContextProvider = ({ children }) => {
  const [showAlertModal, setShowAlertModal] = useState(null);
  const [showBottomAlert, setShowBottomAlert] = useState(null);

  const sendAlert = ({ title, description, denyText, validateText = 'Ok' }) => {
    if (title == null) {
      console.warn('sendAlert: title is required');
      return;
    }
    if (description == null) {
      console.warn('sendAlert: description is required');
      return;
    }
    Haptics.notificationWarning();
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

  const sendBottomAlert = ({ title, description }) => {
    if (title == null) {
      console.warn('sendBottomAlert: title is required');
      return;
    }
    if (description == null) {
      console.warn('sendBottomAlert: description is required');
      return;
    }
    Haptics.notificationError();
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
      <BottomModal visible={showBottomAlert != null} data={showBottomAlert} />
      <AlertModal visible={showAlertModal != null} data={showAlertModal} />
    </OverlayContext.Provider>
  );
};

export default OverlayContextProvider;
