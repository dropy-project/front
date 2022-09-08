import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import React, { useRef, useState , useEffect } from 'react';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { AntDesign } from '@expo/vector-icons';
import DropyLogo from '../assets/svgs/dropy_logo_grey.svg';
import Styles, { Colors } from '../styles/Styles';

export default function Onboarding() {

  const [currentViewIndex, setCurrentViewIndex] = useState(0);

  const translateViewAnimatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.timing(translateViewAnimatedValue, {
      toValue: currentViewIndex * -responsiveWidth(100),
      duration: 500,
      useNativeDriver: true,
    //   easing: Easing.ease,
    });
    anim.start();
    return () => anim.stop();
  }, [currentViewIndex]);

  return (
    <SafeAreaView style={styles.container}>
      <DropyLogo height={70} width={70} color={'green'}/>
      <View style={styles.viewContainer}>
        <Animated.View style={{ transform: [{ translateX: translateViewAnimatedValue }], flexDirection: 'row' }}>
          <View style={styles.view}>
            <Text style={styles.emoji}>👋</Text>
            <View>
              <Text>Hey there</Text>
              <Text>ready to drop ?</Text>
            </View>
            <Button onPress={() => setCurrentViewIndex(1)} />
          </View>

          <View style={styles.view}>
            <Text>BITE to drop ?</Text>
            <Button onPress={() => setCurrentViewIndex(0)} />
          </View>

          <View style={styles.view}>
            <View>
              <Text>PUTE there</Text>
              <Text>ready to drop ?</Text>
            </View>
          </View>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const Button = ({ onPress, disabled = false }) => (
  <TouchableOpacity onPress={onPress} style={{ ...styles.button, opacity: disabled ? 0.5 : 1 }} disabled={disabled}>
    <AntDesign name="arrowright" size={32} color="white"/>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...Styles.center,
    justifyContent: 'space-between',
    ...Styles.safeAreaView,
  },
  viewContainer: {
    width: responsiveWidth(100),
    height: responsiveHeight(50),
    borderColor: 'blue',
    borderWidth: 1,
    flexDirection: 'row',
  },
  view: {
    width: responsiveWidth(100),
    height: responsiveHeight(50),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 40,
  },
  button: {
    backgroundColor: Colors.purple1,
    borderRadius: 18,
    ...Styles.softShadows,
    ...Styles.center,
    paddingHorizontal: 15,
    paddingVertical: 7,
  },

});
