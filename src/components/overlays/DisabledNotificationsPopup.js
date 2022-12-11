import { AntDesign } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { checkNotifications } from 'react-native-permissions';
import Styles, { Colors, Fonts } from '../../styles/Styles';

const DisabledNotificationsPopup = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    checkNotifications().then(({ status }) => {
      setVisible(status !== 'granted');
    });
  }, []);

  if (!visible)
    return null;

  return (
    <TouchableOpacity onPress={() => Linking.openSettings()} style={{ ...styles.container }}>
      <Text style={{ ...Fonts.regular(12, Colors.white) }}>Notifications are disabled</Text>
      <TouchableOpacity onPress={() => setVisible(false)} hitSlop={{ bottom: 10, left: 20, right: 10, top: 10 }}>
        <AntDesign name='close' size={17} color={Colors.white} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default DisabledNotificationsPopup;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: -50,
    backgroundColor: Colors.grey,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '80%',
    ...Styles.hardShadows,
  },
});
