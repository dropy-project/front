import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Styles, { Colors, Fonts } from '../styles/Styles';

const GoBackHeader = ({
  style,
  onPressGoBack,
  onPressOptions,
  text,
  textStyle,
  color = Colors.grey,
  children,
}) => {
  const navigation = useNavigation();

  return (
    <View style={{ ...styles.container, ...style }}>
      <TouchableOpacity
        onPress={onPressGoBack ? onPressGoBack : () => navigation.goBack()}
        style={styles.button}>
        <Feather name="arrow-left" size={30} color={color} />
      </TouchableOpacity>
      <Text style={{ ...styles.tipsStyle, ...textStyle, color }}>{text}</Text>

      {onPressOptions != null ? (
        <TouchableOpacity onPress={onPressOptions}>
          <Feather name="more-horizontal" size={30} color={Colors.white} />
        </TouchableOpacity>
      ) : (
        <>
          {children ? children : <View style={styles.button} />}
        </>
      )}
    </View>
  );
};

export default GoBackHeader;
const styles = StyleSheet.create({
  container: {
    height: 40,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 2,
  },
  tipsStyle: {
    ...Fonts.bold(15, Colors.grey),
  },
  button: {
    width: 40,
    ...Styles.center,
  },
});
