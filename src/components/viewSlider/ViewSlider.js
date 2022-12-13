import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import {
  Animated,
  BackHandler,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Styles, { Colors, Fonts } from '../../styles/Styles';
import { DotIndicator } from './DotIndicator';

const ViewSlider = ({ children, onViewIndexChanged = () => {} }, ref) => {
  const [currentViewIndex, setCurrentViewIndex] = useState(1);
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  const keyboardOverlayAnimatedValue = useRef(new Animated.Value(0)).current;
  const translateViewAnimatedValue = useRef(new Animated.Value(currentViewIndex * -responsiveWidth(100))).current;

  const [renderKeyboardOverlay, setRenderKeyboardOverlay] = useState(false);

  useImperativeHandle(ref, () => ({
    nextView() {
      if (currentViewIndex < children.length - 1)
        setCurrentViewIndex((old) => old + 1);
    },
    previousView() {
      if (currentViewIndex > 0)
        setCurrentViewIndex((old) => old - 1);
    },
    goToView(index) {
      if (index >= 0 && index < children.length)
        setCurrentViewIndex(index);
    },
  }));

  useEffect(() => {
    onViewIndexChanged(currentViewIndex);
    const anim = Animated.timing(translateViewAnimatedValue, {
      toValue: currentViewIndex * -responsiveWidth(100),
      duration: 500,
      useNativeDriver: true,
    });
    anim.start();
    return () => anim.stop();
  }, [currentViewIndex]);

  useEffect(() => {
    setRenderKeyboardOverlay(true);
    const anim = Animated.timing(keyboardOverlayAnimatedValue, {
      toValue: keyboardOpen ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    });
    anim.start();
    return () => anim.stop(({ finished }) => finished && setRenderKeyboardOverlay(keyboardOpen));
  }, [keyboardOpen]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      setCurrentViewIndex((old) => {
        if (old - 1 < 0)
          return old;
        return old - 1;
      });
      return true;
    });
    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => setKeyboardOpen(true));
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => setKeyboardOpen(false));
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      {renderKeyboardOverlay && (
        <Animated.View style={{
          position: 'absolute',
          width: responsiveWidth(100),
          height: responsiveHeight(100),
          backgroundColor: 'rgba(250, 250, 250, 0.95)',
          opacity: keyboardOverlayAnimatedValue,
        }}/>
      )}
      {Platform.OS === 'ios' && <KeyboardSpacer onToggle={setKeyboardOpen} topSpacing={-50}/>}
      <Animated.View style={{
        transform: [{ translateX: translateViewAnimatedValue }],
        flexDirection: 'row',
        alignItems: 'flex-end',
      }}>
        {children}
      </Animated.View>
      {currentViewIndex === 1 && (
        <TouchableOpacity
          style={{ ...Styles.center, position: 'absolute', bottom: 0, width: '100%' }}
          onPress={() => setCurrentViewIndex(0)}
          hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
        >
          <Text style={{ marginBottom: 10, ...Fonts.bold(13, Colors.lightGrey) }}>
            {'Déjà inscrit·e ?'}
          </Text>
        </TouchableOpacity>
      )}
      {currentViewIndex === 0 && (
        <TouchableOpacity
          style={{ ...Styles.center, position: 'absolute', bottom: 0, width: '100%' }}
          onPress={() => setCurrentViewIndex(1)}
          hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
        >
          <Text style={{ marginBottom: 10, ...Fonts.bold(13, Colors.lightGrey) }}>
            {'Je n\'ai pas encore de compte'}
          </Text>
        </TouchableOpacity>
      )}
      {currentViewIndex > 1 && currentViewIndex < children.length - 1 && (
        <DotIndicator
          currentIndex={currentViewIndex - 1}
          onPressSkip={() => setCurrentViewIndex((old) => old + 1)}
          isSkippable={currentViewIndex === 3 || currentViewIndex === 7}
        />
      )}
    </View>
  );
};

export default forwardRef(ViewSlider);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: responsiveWidth(100),
    flexDirection: 'column-reverse',
  },
});
