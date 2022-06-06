import { Platform } from 'react-native';
import { responsiveFontSize } from 'react-native-responsive-dimensions';

const FONT_SIZE_SCALE_FACTOR = 7;
const scaleFromFigma = size => responsiveFontSize(size / FONT_SIZE_SCALE_FACTOR);

export const Colors = {
  mainBlue: '#94B2DE',

  purple1: '#7B6DCD',
  purple2: '#8CB6F6',
  purple3: '#B7C1F7',
  purple4: '#EB9CA5',
  purple5: '#C4BED7',

  white: '#FFFFFF',

  grey: '#7D86A9',
  lightGrey: '#abb2c9',
  darkGrey: '#59607a',
  inputGrey: '#F8F8F8',
  lighterGrey: '#E5ECF1',

  red: '#f28888',
};

const Styles = {
  hardShadows: {
    shadowColor: Colors.mainBlue,

    shadowOpacity: 0.2,
    shadowRadius: 12,

    elevation: 3,
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
