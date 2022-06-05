import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../styles/Styles';

const GoBackHeader = ({ onPressGoBack }) => {

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPressGoBack}>
        <Feather name="arrow-left" size={30} color={Colors.grey} />
      </TouchableOpacity>
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
  },

});
