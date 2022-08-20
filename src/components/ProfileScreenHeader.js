import React from 'react';
import {
  Animated,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { responsiveHeight } from 'react-native-responsive-dimensions';
import LinearGradient from 'react-native-linear-gradient';
import Styles, { Colors, Fonts } from '../styles/Styles';

export const MAX_HEADER_HEIGHT = responsiveHeight(45);
export const MIN_HEADER_HEIGHT = responsiveHeight(25);

const ProfileScreenHeader = ({ scrollAnimValue }) => {

  const navigation = useNavigation();

  const headerTranform = scrollAnimValue.interpolate({
    inputRange: [0, MIN_HEADER_HEIGHT],
    outputRange: [0, -MIN_HEADER_HEIGHT],
    extrapolate: 'clamp',
  });

  const headerCancelTransform = scrollAnimValue.interpolate({
    inputRange: [0, MIN_HEADER_HEIGHT],
    outputRange: [0, MIN_HEADER_HEIGHT],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View style={{ ...styles.animatedHeader, transform: [{ translateY: headerTranform }] }}>

      <Animated.View style={{ ...StyleSheet.absoluteFillObject, transform: [{ translateY: headerCancelTransform }] }}>
        <Image source={require('../assets/guigui1.png')} resizeMode='cover' style={{ width: '100%', height: '100%' }} />
        <LinearGradient
          pointerEvents='none'
          colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.4)']}
          start={{ x: 0.5, y: 0.5 }}
          end={{ x: 0.5, y: 0 }}
          style={StyleSheet.absoluteFillObject}
        />
      </Animated.View>

      <LinearGradient
        colors={['rgba(123, 109, 205, 0)', 'rgba(123, 109, 205, 1)']}
        start={{ x: 0.5, y: 0.6 }}
        end={{ x: 0.6, y: 1.5 }}
        style={StyleSheet.absoluteFillObject}
      />

      <SafeAreaView style={Styles.safeAreaView}>
        <Animated.View style={{ ...styles.headerControlsContainer, transform: [{ translateY: headerCancelTransform }] }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.button}>
            <Feather name="arrow-left" size={30} color={Colors.white} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('Settings')}
            style={styles.button}>
            <Feather name="settings" size={25} color={Colors.white} />
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>

      <View style={styles.headerUserInfosContainer}>
        <View>
          <Text style={{ ...Fonts.bold(25, Colors.white) }}>Guillaume</Text>
          <Text style={{ ...Fonts.regular(13, Colors.white) }}>@Guilaume01</Text>
        </View>
        <Text style={{ ...Fonts.regular(13, Colors.white) }}>he / him</Text>
      </View>
    </Animated.View>
  );
};

export default ProfileScreenHeader;

const styles = StyleSheet.create({
  animatedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: MAX_HEADER_HEIGHT,
    borderBottomRightRadius: 25,
    borderBottomLeftRadius: 25,
    backgroundColor: Colors.white,
    overflow: 'hidden',
  },
  headerControlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  headerUserInfosContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    padding: 20,
  },
});
