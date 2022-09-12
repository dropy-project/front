import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Styles, { Colors, Fonts } from '../styles/Styles';

const GoBackHeader = ({
  inverted,
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
    <View style={[{ ...styles.container, ...style }, inverted && { flexDirection: 'row-reverse' }]}>
      <TouchableOpacity
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        onPress={onPressGoBack ? onPressGoBack : () => navigation.goBack()}
        style={styles.button}>
        <Feather name={inverted ? 'arrow-right' : 'arrow-left'} size={30} color={color} />
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
