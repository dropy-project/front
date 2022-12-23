import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import MapView from 'react-native-maps';

/**
 * IosMap uses the gesture handler builts into react-native-maps.
 * Runtimes values (Zoom / Heading) are managed by rn-maps.
 */
const IosMap = (props, ref) => {
  const { onZoomChange, onHeadingChange, onGestureStart, onGestureEnd } = props;

  const mapRef = useRef(null);

  useImperativeHandle(ref, () => ({
    getMapRef: () => mapRef.current,
  }));

  const onRegionChange = async (_, { isGesture }) => {
    if (!isGesture)
      return;

    onGestureStart();

    const camera = await mapRef.current?.getCamera();
    if (camera == null)
      return;

    onZoomChange(camera.zoom);
    onHeadingChange(camera.heading);
  };

  const onRegionChangeComplete = async (_, { isGesture }) => {
    if (!isGesture)
      return;
    onGestureEnd();
  };

  return (
    <MapView
      ref={mapRef}
      rotateEnabled={true}
      zoomEnabled={true}
      zoomTapEnabled={false}
      {...props}
      onRegionChange={onRegionChange}
      onRegionChangeComplete={onRegionChangeComplete}
      onResponderRelease={onGestureEnd}
    >
      {props.children}
    </MapView>
  );
};

export default forwardRef(IosMap);
