import React, { useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Styles, { Colors, Fonts } from '../styles/Styles';

const DropDownButton = ({
  buttonColor = Colors.grey,
  options = [
    { text: 'Option 1', destructive: false },
    { text: 'Option 2', destructive: false },
    { text: 'Destructive option', destructive: true }
  ],
  onSelect = () => {},
}) => {

  const [isOpen, setIsOpen] = useState(false);

  const _onSelect = (index) => {
    onSelect(index);
    setIsOpen(false);
  };

  return (
    <View style={styles.container}>
      {isOpen && (
        <TouchableOpacity
          style={styles.backgroundTouchable}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        />
      )}
      <TouchableOpacity onPress={() => setIsOpen(true)}>
        <Feather name="more-horizontal" size={30} color={buttonColor} />
      </TouchableOpacity>
      {isOpen && (
        <View style={styles.menuContainer}>
          {options.map((option, index) => (
            <React.Fragment key={index}>
              <TouchableOpacity onPress={() => _onSelect(index)} style={styles.menuOptionButton}>
                <Text style={{
                  ...Fonts.ligth(15, option?.destructive === true ? Colors.red : Colors.darkGrey), marginHorizontal: 15,
                }}>
                  {option.text}
                </Text>
              </TouchableOpacity>
              {index < options.length - 1 && (
                <View style={styles.spacer} />
              )}
            </React.Fragment>
          ))}
        </View>
      )}
    </View>
  );
};

export default DropDownButton;

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
  },
  backgroundTouchable: {
    position: 'absolute',
    top: -responsiveHeight(10),
    right: -responsiveHeight(10),
    width: responsiveWidth(200),
    height: responsiveHeight(200),
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  menuContainer: {
    position: 'absolute',
    backgroundColor: Colors.white,
    borderRadius: 15,
    ...Styles.softShadows,
  },
  menuOptionButton: {
    minWidth: 250,
    padding: 10,
  },
  spacer: {
    width: '100%',
    height: 1,
    backgroundColor: Colors.darkGrey,
  },
});
