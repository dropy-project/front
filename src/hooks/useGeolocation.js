import { useContext } from 'react';
import { GeolocationContext } from '../states/GeolocationContextProvider';

const useGeolocation = () => {
  const { userCoordinates, compassHeading } = useContext(GeolocationContext);
  return { userCoordinates, compassHeading };
};

export default useGeolocation;
