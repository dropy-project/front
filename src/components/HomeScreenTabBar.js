import React from 'react';
import { StyleSheet, TouchableOpacity, Alert, View, Dimensions } from 'react-native';
import { AntDesign , FontAwesome, FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Styles, { Colors } from '../styles/Styles';
import BottomBarBackground from '../assets/svgs/BottomBarBackground.svg';
import GlassCircle from './GlassCircleButton';

const screenWidth = Dimensions.get('window').width + 100;

const iconsSize = 34;

const d = 'M 0 28 C 0 12.535995 12.535999 0 28 0 L 101.5 0 L 135.268005 0 C 143.283005 0 150.514999 4.8116 153.612 12.204597 L 154.119995 13.417099 C 166.593002 43.1978 208.985992 42.625 220.649994 12.518097 L 220.649994 12.518097 C 223.572998 4.9729 230.832993 0 238.924988 0 L 273.5 0 L 347 0 C 362.463989 0 375 12.535995 375 28 L 375 87 L 0 87 L 0 28 Z';
const HomeScreenTabBar = () => {
  const navigation = useNavigation();

  return (
    // <View style={styles.container}>
  //   </TouchableOpacity> */}
  // </View>
    <View style={styles.container}>
      <View style={styles.backgroundSvgContainer}>
        <Svg
          height="100%"
          preserveAspectRatio="xMinYMin slice"
          width="100%"
          viewBox="0 0 375 87"
        >
          <Path
            d={d}
            fill="white"
            style={Styles.hardShadows}
          />
        </Svg>
      </View>
      {/* <TouchableOpacity onPress={() => navigation.navigate('Museum')}>
        <MaterialIcons name="collections" size={iconsSize} color={Colors.grey} style={styles.icons} />
      </TouchableOpacity> */}
      <GlassCircle style={styles.mainButton} onPress={() => Alert.alert('Je me suis fait touché')}>
        <FontAwesome5 name="plus" size={20} color="white" />
      </GlassCircle>
      {/* <TouchableOpacity onPress={() => navigation.navigate('Chat')}>
        <Ionicons name="md-chatbubble-ellipses" size={iconsSize} color={Colors.grey} style={styles.icons} />
      </TouchableOpacity> */}
    </View>
  );
};

export default HomeScreenTabBar;

const styles = StyleSheet.create({
  // container: {
  //   flexDirection: 'row',
  //   position: 'absolute',
  //   bottom: 0,
  //   right: 0,
  //   left: 0,
  //   height: 100,
  //   borderRadius: 40,
  //   backgroundColor: 'white',
  //   alignItems: 'center',
  //   justifyContent: 'space-around',
  //   ...Styles.hardShadows
  // }
  container: {
    height: 70,
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    ...Styles.center,
  },
  mainButton: {
    position: 'absolute',
    top: '-80%'
  },
  backgroundSvgContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: -20,
    bottom: 0,
    ...Styles.center
  },
  icons: {
    ...Styles.softShadows,
    shadowOpacity: 0.3,
    shadowColor: Colors.grey
  }
});

