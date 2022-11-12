import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { Platform } from 'react-native';
import MapView from 'react-native-maps';

import mapStyleAndroid from '../assets/mapStyleAndroid.json';
import mapStyleIOS from '../assets/mapStyleIOS.json';
import AndroidMap from './AndroidMap';

const OSMapView = (props, ref) => {
  const mapRef = useRef(null);

  const lastCamera = useRef(null);
  const { setCurrentZoom, setCurrentHeading, setHeadingLocked } = props;

  useImperativeHandle(ref, () => ({
    getMapRef: Platform.OS === 'android' ? mapRef.current.getMapRef : () => mapRef.current,
  }));

  const iosGestureHandler = async (_, { isGesture }) => {
    if (!isGesture)
      return;
    const camera = await mapRef.current?.getCamera();
    if (camera == null)
      return;

    if (lastCamera.current == null) {
      lastCamera.current = camera;
      return;
    }

    setCurrentZoom(camera.zoom);
    setCurrentHeading(camera.heading);
    setHeadingLocked(false);

    lastCamera.current = camera;
  };

  if (Platform.OS === 'android') {
    return (
      <AndroidMap
        ref={mapRef}
        rotateEnabled={false}
        zoomEnabled={false}
        customMapStyle={mapStyleAndroid}
        {...props}
      >
        {props.children}
      </AndroidMap>
    );
  }

  return (
    <MapView
      ref={mapRef}
      {...props}
      rotateEnabled={true}
      zoomEnabled={true}
      customMapStyle={mapStyleIOS}
      onRegionChange={iosGestureHandler}
    >
      {props.children}
    </MapView>
  );
};

export default forwardRef(OSMapView);
