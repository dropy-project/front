import { useEffect, useState } from 'react';

import Geolocation from '@react-native-community/geolocation';
import CompassHeading from 'react-native-compass-heading';

/**
 * Syncronize the given map view with the actual phone
 * position and orientation
 * @param mapViewRef
 */
const useMapViewSyncronizer = (mapViewRef) => {

  const [userCoordinates, setUserCoordinates] = useState(null);
  const [compassHeading, setCompassHeading] = useState(0);

  useEffect(() => {
    const geolocationWatchId = registerGeolocationListener();
    registerCompassListener();

    return () => {
      Geolocation.clearWatch(geolocationWatchId);
      CompassHeading.stop();
    };
  }, []);

  const registerGeolocationListener = () => Geolocation.watchPosition(
    (infos) => {
      const { coords } = infos;
      setUserCoordinates(coords);
    },
    console.error,
    {
      enableHighAccuracy: true,
      distanceFilter: 10
    }
  );

  const registerCompassListener = () => CompassHeading.start(10, (infos) => {
    const { heading } = infos;
    setCompassHeading(heading);
  });

  useEffect(() => {
    setMapCameraPosition();
  }, [userCoordinates, compassHeading]);

  const setMapCameraPosition = () => {
    if(mapViewRef?.current == null) return;
    if (userCoordinates == null) return;

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
      { duration: 200 }
    );
  };

  return { userCoordinates, compassHeading };
};

export default useMapViewSyncronizer;
