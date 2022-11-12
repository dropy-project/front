import React, { useEffect, useRef, useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Styles, { Colors, Fonts } from '../../styles/Styles';

const DropDownButton = ({
  buttonColor = Colors.grey,
  options = [{ text: 'Option 1', destructive: false }, { text: 'Option 2', destructive: false }, { text: 'Destructive option', destructive: true }],
  onSelect = () => {},
}) => {
  const animatedVaue = useRef(new Animated.Value(0)).current;

  const [isOpen, setIsOpen] = useState(false);
  const [renderMenu, setRenderMenu] = useState(false);

  const handlePress = (index) => {
    onSelect(index);
    setIsOpen(false);
  };

  useEffect(() => {
    setRenderMenu(true);
    const anim = Animated.timing(animatedVaue, {
      toValue: isOpen ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    });
    anim.start(({ finished }) => {
      if (!finished)
        return;
      setRenderMenu(isOpen);
    });
    return anim.stop;
  }, [isOpen]);

  const animatedScale = animatedVaue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1],
  });

  return (
    <View style={styles.container}>
      {renderMenu && (
        <Animated.View style={{ opacity: animatedVaue }}>
          <TouchableOpacity
            style={styles.backgroundTouchable}
            activeOpacity={1}
            onPress={() => setIsOpen(false)}
          />
        </Animated.View>
      )}
      <TouchableOpacity onPress={() => setIsOpen(true)}>
        <Feather name='more-horizontal' size={30} color={buttonColor} />
      </TouchableOpacity>
      {renderMenu && (
        <Animated.View style={{ ...styles.menuContainer, opacity: animatedVaue, transform: [{ scale: animatedScale }] }}>
          {options.map((option, index) => (
            <React.Fragment key={index}>
              <TouchableOpacity onPress={() => handlePress(index)} style={styles.menuOptionButton}>
                <Text style={{
                  ...Fonts.regular(15, option?.destructive === true ? Colors.red : Colors.darkGrey), marginHorizontal: 15,
                }}>
                  {option.text}
                </Text>
              </TouchableOpacity>
              {index < options.length - 1 && (
                <View style={styles.spacer} />
              )}
            </React.Fragment>
          ))}
        </Animated.View>
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
