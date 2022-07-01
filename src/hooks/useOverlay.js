import { useContext } from 'react';
import { OverlayContext } from '../states/OverlayContextProvider';

const useOverlay = () => {
  return useContext(OverlayContext);
};

export default useOverlay;
