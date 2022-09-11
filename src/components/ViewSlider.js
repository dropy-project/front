import React, { useRef , useState , useEffect } from 'react';
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

export default function ViewSlider({ children, onViewIndexChanged }) {

  const [currentViewIndex, setCurrentViewIndex] = useState(0);

  const translateViewAnimatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    onViewIndexChanged(currentViewIndex);
    const anim = Animated.timing(translateViewAnimatedValue, {
      toValue: currentViewIndex * -responsiveWidth(100),
      duration: 500,
      useNativeDriver: true,
      //   easing: Easing.ease,
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
      {currentViewIndex === 0 ? (
        <TouchableOpacity style={{ ...Styles.center, position: 'absolute', bottom: 0, alignSelf: 'center' }}>
          <Text style={{ marginBottom: 20, ...Fonts.bold(13, Colors.grey) }}>I already have an account</Text>
        </TouchableOpacity>
      ) : (
        <DotIndicator currentIndex={currentViewIndex - 1} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  viewContainer: {
    width: responsiveWidth(100),
    height: responsiveHeight(50),
    // borderColor: 'blue',
    // borderWidth: 1,
    flexDirection: 'row',
  },
});
