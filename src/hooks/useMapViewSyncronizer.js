import { useEffect } from 'react';
import { coordinatesDistance } from '../utils/coordinates';
import useGeolocation from './useGeolocation';

export const INITIAL_PITCH = 10;
export const INITIAL_ZOOM = 17;

/**
 * Syncronize the given map view with the actual phone
 * position and orientation
 * @param mapViewRef
 */
const useMapViewSyncronizer = (mapViewRef, mapIsReady = true) => {

  const { userCoordinates, compassHeading } = useGeolocation();

  useEffect(() => {
    if(mapIsReady === false) return;
    if(mapViewRef?.current == null) return;
    if (userCoordinates == null) return;

    setMapCameraPosition();
  }, [userCoordinates, compassHeading, mapIsReady]);

  const setMapCameraPosition = async () => {
    const currentCamera = await mapViewRef.current.getCamera();
    const distanceBetweenCameraAndPosition = coordinatesDistance(currentCamera.center, userCoordinates);
    const duration = distanceBetweenCameraAndPosition > 100 ? 0 : 2000;

    mapViewRef.current.animateCamera(
      {
        center: {
          latitude: userCoordinates.latitude,
          longitude: userCoordinates.longitude,
        },
        pitch: INITIAL_PITCH,
        heading: compassHeading,
        zoom: INITIAL_ZOOM,
      },
      { duration }
    );
  };
};

export default useMapViewSyncronizer;
