import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { Gesture, GestureDetector, State } from 'react-native-gesture-handler';
import MapView from 'react-native-maps';

const AndroidMap = (props, ref) => {
  const mapRef = useRef(null);
  const isUpdatingCamera = useRef(false);

  const { setCurrentZoom, setCurrentHeading, setHeadingLocked } = props;

  useImperativeHandle(ref, () => ({
    getMapRef: () => mapRef.current,
  }));

  const setCameraPropertySync = async (value, property = 'zoom') => {
    if (isUpdatingCamera.current)
      return;
    isUpdatingCamera.current = true;

    const currentCamera = await mapRef.current?.getCamera();
    if (currentCamera == null)
      return;


    await mapRef.current?.setCamera({
      ...currentCamera,
      [property]: currentCamera[property] + value,
    });

    // Get the old camera value for the zoom and the heading
    const newCamera = await mapRef.current?.getCamera();
    if (newCamera == null)
      return;

    // Set the zoom only if the zoom and heading as changed for at least 0.1
    if (Math.abs(newCamera.zoom - currentCamera.zoom) > 0.17)
      setCurrentZoom(newCamera.zoom);

    // Set the heading only if the heading as changed for at least 1
    if (Math.abs(newCamera.heading - currentCamera.heading) > 4) {
      setCurrentHeading(newCamera.heading);
      setHeadingLocked(false);
    }

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
