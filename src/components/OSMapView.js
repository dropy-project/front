import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { Platform } from 'react-native';
import MapView from 'react-native-maps';

import mapStyleAndroid from '../assets/mapStyleAndroid.json';
import mapStyleIOS from '../assets/mapStyleIOS.json';
import AndroidMap from './AndroidMap';

const OSMapView = (props, ref)  => {

  const mapRef = useRef(null);
  useImperativeHandle(ref, () => ({
    getMapRef: Platform.OS === 'android' ?
      mapRef.current.getMapRef :
      () => mapRef.current,
  }));

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
    >
      {props.children}
    </MapView>
  );
};

export default forwardRef(OSMapView);
