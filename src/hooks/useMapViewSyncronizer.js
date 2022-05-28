import { useEffect } from 'react';
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
    const distanceBetweenCameraAndPosition = calculateDistance(currentCamera.center, userCoordinates);
    const duration = distanceBetweenCameraAndPosition > 0.5 ? 0 : 2000;

    mapViewRef.current.animateCamera(
      {
        center: {
          latitude: userCoordinates.latitude,
          longitude: userCoordinates.longitude
        },
        pitch: 10,
        heading: compassHeading,
        zoom: 17
      },
      { duration }
    );
  };

  const calculateDistance = (coord1, coord2) => {
    const x = Math.pow(coord1.latitude - coord2.latitude, 2);
    const y = Math.pow(coord1.longitude - coord2.longitude, 2);
    return Math.sqrt(x + y);
  };
};

export default useMapViewSyncronizer;
