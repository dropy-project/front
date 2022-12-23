import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { Gesture, GestureDetector, State } from 'react-native-gesture-handler';
import MapView from 'react-native-maps';
import { Map } from '../../styles/Styles';

const ZOOM_DELTA = Map.MAX_ZOOM - Map.MIN_ZOOM;

/**
 * Android Map uses a custom gesture handler.
 * This is because rn-maps does not support screen centered rotation on Android.
 * Runtimes values (Zoom / Heading) are self managed by this component.
 */
const AndroidMap = (props, ref) => {
  const mapRef = useRef(null);
  const isUpdatingCamera = useRef(false);

  const lastGestureRotationRef = useRef(0);
  const lastGestureZoomRef = useRef((Map.INITIAL_ZOOM - Map.MIN_ZOOM) / ZOOM_DELTA);

  const { onZoomChange, onHeadingChange, onGestureStart, onGestureEnd } = props;

  useImperativeHandle(ref, () => ({
    getMapRef: () => mapRef.current,
  }));

  const setCameraPropertySync = async (value, property = 'zoom') => {
    if (isUpdatingCamera.current)
      return;
    isUpdatingCamera.current = true;

    await mapRef.current?.setCamera({
      [property]: value,
    });

    isUpdatingCamera.current = false;
  };

  const pinchGesture = Gesture.Pinch()
    .onStart(onGestureStart)
    .onChange((e) => {
      if (e.state !== State.ACTIVE)
        return;

      const addedZoom = e.scale - 1;
      const newZoomNormalized = lastGestureZoomRef.current + addedZoom;
      const newZoomMapScale = (newZoomNormalized * ZOOM_DELTA) + Map.MIN_ZOOM;

      setCameraPropertySync(newZoomMapScale, 'zoom');

      onZoomChange(newZoomMapScale);
    })
    .onFinalize((e) => {
      lastGestureZoomRef.current += e.scale - 1;
      if (lastGestureZoomRef.current < 0)
        lastGestureZoomRef.current = 0;
      else if (lastGestureZoomRef.current > 1)
        lastGestureZoomRef.current = 1;
      onGestureEnd();
    });

  const rotateGesture = Gesture.Rotation()
    .onStart(onGestureStart)
    .onChange((e) => {
      if (e.state !== State.ACTIVE)
        return;

      const rotationDegrees = -e.rotation * 180 / Math.PI;
      const newHeading = lastGestureRotationRef.current + rotationDegrees;

      setCameraPropertySync(newHeading, 'heading');

      onHeadingChange(newHeading);
    })
    .onFinalize((e) => {
      const rotationDegrees = -e.rotation * 180 / Math.PI;
      lastGestureRotationRef.current += rotationDegrees;
      onGestureEnd();
    });

  return (
    <GestureDetector gesture={Gesture.Race(rotateGesture, pinchGesture)}>
      <MapView
        ref={mapRef}
        {...props}
        rotateEnabled={false}
        zoomEnabled={false}
        zoomTapEnabled={false}
      >
        {props.children}
      </MapView>
    </GestureDetector>
  );
};

export default forwardRef(AndroidMap);
