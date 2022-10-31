import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { Gesture, GestureDetector, State } from 'react-native-gesture-handler';
import MapView from 'react-native-maps';

const AndroidMap = (props, ref) => {

  const { onRotate, onZoom } = props;

  const callbacks = {
    'zoom': onZoom,
    'heading': onRotate,
  };

  const mapRef = useRef(null);
  const isUpdatingCamera = useRef(false);

  useImperativeHandle(ref, () => ({
    getMapRef: () => mapRef.current,
  }));

  const setCameraPropertySync = async (value, property = 'zoom') => {
    if (isUpdatingCamera.current) return;
    isUpdatingCamera.current = true;

    const currentCamera = await mapRef.current?.getCamera();
    if (currentCamera == null) return;

    await mapRef.current?.setCamera({
      ...currentCamera,
      [property]: currentCamera[property] + value,
    });

    callbacks[property]?.(currentCamera[property] + value);

    isUpdatingCamera.current = false;
  };

  const pinchGesture = Gesture.Pinch()
    .onChange((e) => {
      if (e.state === State.ACTIVE)
        setCameraPropertySync(e.scale - 1, 'zoom');
    });

  const rotateGesture = Gesture.Rotation()
    .onChange((e) => {
      if (e.state === State.ACTIVE)
        setCameraPropertySync(-e.rotation * 3, 'heading');
    });

  return (
    <GestureDetector gesture={Gesture.Race(rotateGesture, pinchGesture)}>
      <MapView
        ref={mapRef}
        {...props}
      >
        {props.children}
      </MapView>
    </GestureDetector>
  );
};

export default forwardRef(AndroidMap);
