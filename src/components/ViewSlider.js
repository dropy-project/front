import React, { useRef , useState , useEffect, useImperativeHandle, forwardRef } from 'react';
import {
  View,
  Text,
  Animated,
  TouchableOpacity,
  BackHandler,
  StyleSheet
} from 'react-native';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Styles, { Colors, Fonts } from '../styles/Styles';
import { DotIndicator } from './DotIndicator';

const ViewSlider = ({ children, onViewIndexChanged = () => {} }, ref) => {

  const [currentViewIndex, setCurrentViewIndex] = useState(1);

  const translateViewAnimatedValue = useRef(new Animated.Value(currentViewIndex * -responsiveWidth(100))).current;

  useImperativeHandle(ref, () => ({
    nextView() {
      if (currentViewIndex < children.length - 1) {
        setCurrentViewIndex(currentViewIndex + 1);
      }
    },
    previousView() {
      if (currentViewIndex > 0) {
        setCurrentViewIndex(currentViewIndex - 1);
      }
    },
    goToView(index) {
      if (index >= 0 && index < children.length) {
        setCurrentViewIndex(index);
      }
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
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      setCurrentViewIndex(old => {
        if(old - 1 < 0) return old;
        return old - 1;
      });
      return true;
    });
    return () => backHandler.remove();
  }, []);

  return (
    <View style={styles.viewContainer}>
      <Animated.View style={{ transform: [{ translateX: translateViewAnimatedValue }], flexDirection: 'row' }}>
        {children}
      </Animated.View>
      {currentViewIndex === 1 && (
        <TouchableOpacity style={{ ...Styles.center, position: 'absolute', bottom: 0, width: '100%' }} onPress={() => setCurrentViewIndex(0)}>
          <Text style={{ marginBottom: 20, ...Fonts.bold(13, Colors.grey) }}>I already have an account</Text>
        </TouchableOpacity>
      )}
      {currentViewIndex > 1 && currentViewIndex < children.length - 1 && (
        <DotIndicator currentIndex={currentViewIndex - 1} onPressSkip={() => setCurrentViewIndex(old => old + 1)} isSkippable={currentViewIndex === 3 || currentViewIndex === 7}/>
      )}
    </View>
  );
};

export default forwardRef(ViewSlider);

const styles = StyleSheet.create({
  viewContainer: {
    width: responsiveWidth(100),
    height: responsiveHeight(50),
    // borderColor: 'blue',
    // borderWidth: 1,
    flexDirection: 'row',
  },
});
