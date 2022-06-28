import { Platform } from 'react-native';
import { responsiveFontSize } from 'react-native-responsive-dimensions';

const FONT_SIZE_SCALE_FACTOR = 7;
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
};

const Styles = {
  hardShadows: {
    shadowColor: Colors.mainBlue,

    shadowOpacity: 0.5,
    shadowRadius: 12,

    elevation: 7,
    shadowOffset: {
      width: 0,
      height: Platform.OS !== 'ios' ? 0 : 5,
    },
  },
  softShadows: {
    shadowColor: Colors.mainBlue,
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 5,

    shadowOffset: {
      width: 0,
      height: Platform.OS !== 'ios' ? 0 : 5,
    },
  },
  blueShadow: {
    shadowColor: Colors.mainBlue,
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,

    shadowOffset: {
      width: 0,
      height: 3,
    },
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
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

export default Styles;
