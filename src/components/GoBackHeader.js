import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Styles, { Colors, Fonts } from '../styles/Styles';

const GoBackHeader = ({ onPressGoBack, text, style }) => {

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPressGoBack} style={styles.headerStyle}>
        <Feather name="arrow-left" size={30} color={Colors.lightGrey} />
      </TouchableOpacity>
      <Text style={{ ...styles.tipsStyle, ...style }}>{ text }</Text>
    </View>
  );
};

export default GoBackHeader;

const styles = StyleSheet.create({
  container: {
    height: 40,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20
  },
  tipsStyle: {
    ...Fonts.regular(15, '#949494')
  },
  headerStyle:{
    position: 'absolute',
    width: '100%' }
});
