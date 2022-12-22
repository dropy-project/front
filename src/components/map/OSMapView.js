import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { Platform } from 'react-native';

import mapStyleAndroid from '../../assets/mapStyleAndroid.json';
import mapStyleIOS from '../../assets/mapStyleIOS.json';

import AndroidMap from './AndroidMap';
import IosMap from './IosMap';

const OSMapView = (props, ref) => {
  const mapRef = useRef(null);

  useImperativeHandle(ref, () => ({
    getMapRef: mapRef.current.getMapRef,
  }));

  if (Platform.OS === 'android') {
    return (
      <AndroidMap
        ref={mapRef}
        customMapStyle={mapStyleAndroid}
        {...props}
      >
        {props.children}
      </AndroidMap>
    );
  }

  return (
    <IosMap
      ref={mapRef}
      customMapStyle={mapStyleIOS}
      {...props}
    >
      {props.children}
    </IosMap>
  );
};

export default forwardRef(OSMapView);
