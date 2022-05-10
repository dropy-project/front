import { Platform } from 'react-native';

const Styles = {
  hardShadows: {
    shadowColor: '#000',

    shadowOpacity: 0.2,
    shadowRadius: 20,

    elevation: 3,
    shadowOffset: {
      width: 0,
      height: Platform.OS !== 'ios' ? 0 : 5
    }
  },
  softShadows: {
    shadowColor: '#7F5DF0',
    shadowOffset: {
      width: 0,
      height: 10
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center'
  }
};

export default Styles;
