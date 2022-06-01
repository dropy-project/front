import { useEffect, useState } from 'react';
import { coordinatesDistance } from '../utils/coordinates';
import useGeolocation from './useGeolocation';

const useTravelDistanceCallback = (
  /**
   * Called when the user has moved more than the specified trigger
   * distance
   */
  distanceCallback = undefined,
  /**
   * Distance in meters the user need to move to trigger the callback
   * @default 20
   */
  triggerDistanceMeters = 20
) => {

  const [lastTriggerCoordinates, setLastTrigerCoordinates] = useState(null);

  const { userCoordinates } = useGeolocation();

  useEffect(() => {
    if(distanceCallback == null) return;
    if(lastTriggerCoordinates == null) {
      setLastTrigerCoordinates(userCoordinates);
      distanceCallback();
      return;
    }

    const distance = coordinatesDistance(userCoordinates, lastTriggerCoordinates);
    if(distance > triggerDistanceMeters) {
      setLastTrigerCoordinates(userCoordinates);
      distanceCallback();
    }
  }, [userCoordinates]);
};

export default useTravelDistanceCallback;
