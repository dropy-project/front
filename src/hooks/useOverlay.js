/* eslint-disable no-unused-vars */
import { useContext } from 'react';
import { OverlayContext } from '../states/OverlayContextProvider';

const useOverlay = () => {
  const {
    sendAlert,
    sendBottomAlert,
  } = useContext(OverlayContext);
  return {
    sendAlert,
    sendBottomAlert,
  };
};

export default useOverlay;
