import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import useCurrentUser from '../hooks/useCurrentUser';

const DebugText = ({ children, date, marginBottom = 0, showBoundingBox = false }) => {
  const { developerMode } = useCurrentUser();

  if (!developerMode)
    return null;

  return (
    <>
      {showBoundingBox && (
        <View pointerEvents='none' style={{
          ...StyleSheet.absoluteFillObject,
          borderWidth: 1,
          borderColor: 'red',
          margin: 1,
          marginBottom,
        }}
        />
      )}
      <Text pointerEvents='none' style={{
        margin: 4,
        padding: 3,
        fontSize: 9,
        position: 'absolute',
        bottom: 0,
        left: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        color: 'white',
        marginBottom,
      }}>
        {date ? `[${new Date(date).toLocaleString()}]` : ''} {children}
      </Text>
    </>
  );
};

export default DebugText;
