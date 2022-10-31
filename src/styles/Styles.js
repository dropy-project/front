import { Platform } from 'react-native';
import { responsiveFontSize } from 'react-native-responsive-dimensions';

const FONT_SIZE_SCALE_FACTOR = 7;
const IS_IOS = Platform.OS === 'ios';

const scaleFromFigma = size => responsiveFontSize(size / FONT_SIZE_SCALE_FACTOR);

export const Colors = {
  purple1: '#7B6DCD',
  purple2: '#A89FDF',
  purple3: '#B7C1F7',

  mainBlue: '#94B2DE',

  white: '#FFFFFF',

  grey: '#7D86A9',

  darkGrey: '#59607a',
  lightGrey: '#abb2c9',
  lighterGrey: '#E5ECF1',

  red: '#f28888',
  green: '#8FDCB7',

  androidShadows: '#1d1d57',
  androidSoftShadows: '#697180',
};

const Styles = {
  hardShadows: {
    shadowColor: IS_IOS ? Colors.mainBlue : Colors.androidShadows,

    shadowOpacity: 0.5,
    shadowRadius: 12,

    elevation: 15,
    shadowOffset: {
      width: 0,
      height: IS_IOS ? 0 : 5,
    },
  },
  softShadows: {
    shadowColor: IS_IOS ? Colors.mainBlue : Colors.androidSoftShadows,
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 10,

    shadowOffset: {
      width: 0,
      height: 0,
    },
  },
  blueShadow: {
    shadowColor: IS_IOS ? Colors.mainBlue : Colors.androidShadows,
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,

    shadowOffset: {
      width: 0,
      height: 3,
    },
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  safeAreaView: {
    paddingTop: IS_IOS ? 0 : 20,
  },
};

export const Fonts = {
  ligth: (fontSize = 15, fontColor = Colors.lightGrey) => ({
    fontSize: scaleFromFigma(fontSize),
    fontFamily: 'SpaceGrotesk_300Light',
    color: fontColor,
  }),
  regular: (fontSize = 15, fontColor = Colors.lightGrey) => ({
    fontSize: scaleFromFigma(fontSize),
    fontFamily: 'SpaceGrotesk_400Regular',
    color: fontColor,
  }),
  bold: (fontSize = 15, fontColor = Colors.lightGrey) => ({
    fontSize: scaleFromFigma(fontSize),
    fontFamily: 'SpaceGrotesk_600SemiBold',
    color: fontColor,
  }),
};

export const Map = {
  INITIAL_PITCH: 0,
  INITIAL_ZOOM: 17.3,
  MIN_ZOOM: 16,
  MAX_ZOOM: 18,
  MIN_ZOOM_DEVELOPER: 15,
  MUSEUM_PITCH: 45,
  MUSEUM_ZOOM: 13,
};

export default Styles;
