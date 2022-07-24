import { useContext, useEffect, useState } from 'react';
import { GeolocationContext } from '../states/GeolocationContextProvider';

const useGeolocation = () => {
  const { userCoordinates, compassHeading } = useContext(GeolocationContext);
  return { userCoordinates, compassHeading };
};

export const useInitializedGeolocation = () => {
  const [initialized, setInitialized] = useState(false);

  const { userCoordinates, compassHeading } = useContext(GeolocationContext);

  useEffect(() => {
    const isZero = userCoordinates?.latitude === 0 && userCoordinates?.longitude === 0;
    if(userCoordinates != null && isZero === false) {
      setInitialized(true);
    }
  }, [userCoordinates]);

  return { userCoordinates, compassHeading, initialized };
};

export default useGeolocation;
