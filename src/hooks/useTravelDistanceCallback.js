import { useEffect, useRef } from 'react';
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
  triggerDistanceMeters = 20,
  /**
   * Call the callback even if the user has not moved after the specified
   * time delay (undefined = no timeout behaviour)
   * @default undefined
   */
  timeoutTime = undefined
) => {

  const lastTrigger = useRef({ coordinates: null, timestamp: null });

  const { userCoordinates } = useGeolocation();

  useEffect(() => {
    if(timeoutTime == null) return;
    const interval = setInterval(() => {
      if(Date.now() - lastTrigger.current.timestamp > timeoutTime) {
        trigger();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if(userCoordinates == null) return;
    if(distanceCallback == null) return;

    if(lastTrigger.current.coordinates == null) {
      trigger();
      return;
    }

    const distance = coordinatesDistance(userCoordinates, lastTrigger.current.coordinates);
    if(distance > triggerDistanceMeters) {
      trigger();
    }
  }, [userCoordinates]);

  const trigger = () => {
    lastTrigger.current = {
      coordinates: userCoordinates,
      timestamp: Date.now(),
    };
    distanceCallback();
  };
};

export default useTravelDistanceCallback;
