import { useEffect } from 'react';
import { coordinatesDistance } from '../utils/coordinates';
import useGeolocation from './useGeolocation';

/**
 * Syncronize the given map view with the actual phone
 * position and orientation
 * @param mapViewRef
 */
const useMapViewSyncronizer = (mapViewRef) => {

  const { userCoordinates, compassHeading } = useGeolocation();

  useEffect(() => {
    setMapCameraPosition();
  }, [userCoordinates, compassHeading]);

  const setMapCameraPosition = async () => {
    if(mapViewRef?.current == null) return;
    if (userCoordinates == null) return;

    const currentCamera = await mapViewRef.current.getCamera();
    const distanceBetweenCameraAndPosition = coordinatesDistance(currentCamera.center, userCoordinates);
    const duration = distanceBetweenCameraAndPosition > 100 ? 0 : 2000;

    mapViewRef.current.animateCamera(
      {
        center: {
          latitude: userCoordinates.latitude,
          longitude: userCoordinates.longitude,
        },
        pitch: 10,
        heading: compassHeading,
        zoom: 17,
      },
      { duration }
    );
  };
};

export default useMapViewSyncronizer;
