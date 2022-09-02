
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import useOverlay from '../hooks/useOverlay';
import API from '../services/API';
import Styles, { Colors, Fonts } from '../styles/Styles';
import ProfileImage from './ProfileImage';

const MuseumOverlay = ({ visible = false, setSelectedCoodinates }) => {

  const [render, setRender] = useState(false);
  const { sendAlert } = useOverlay();

  const menuAnimatedValue = useRef(new Animated.Value(0)).current;

  const [loading, setLoading] = useState(true);
  const [dropies, setDropies] = useState([]);

  useEffect(() => {
    setRender(true);

    const anim = Animated.timing(menuAnimatedValue, {
      toValue: visible ? 1 : 0,
      duration: visible ? 600 : 300,
      useNativeDriver: true,
      easing: Easing.elastic(1.1),
    });

    anim.start(({ finished }) => {
      if(finished)
        setRender(visible);
    });

    return anim.stop;
  }, [visible]);

  useEffect(() => {
    if(!visible) return;
    loadDropies();
  }, [visible]);

  const loadDropies = async () => {
    try {
      setLoading(true);
      const response = await API.getUserDropies();
      setDropies(response.data);
      setLoading(false);

      setSelectedCoodinates({
        latitude: response.data[0].latitude,
        longitude: response.data[0].longitude,
      });

      console.log(JSON.stringify(response.data, null, 2));
    } catch (error) {
      sendAlert({
        title: 'Oh no...',
        description: 'We couldn\'t find your drops...\nCheck your internet connection!',
      });
      console.error('Error while fetching user dropies', error?.response?.data || error);
    }
  };

  const onScroll = ({ nativeEvent }) => {
    const index = Math.round(nativeEvent.contentOffset.x / (responsiveWidth(80) + 20));
    const clampedIndex = Math.max(0, Math.min(dropies.length - 1, index));
    setSelectedCoodinates({
      latitude: dropies[clampedIndex].latitude,
      longitude: dropies[clampedIndex].longitude,
    });
  };

  if(!render) return null;

  return (
    <Animated.View style={{ ...StyleSheet.absoluteFillObject, opacity: menuAnimatedValue }}>
      <LinearGradient
        colors={['rgba(0,0,0,0)', 'rgba(10,0,10,0.5)']}
        start={{ x: 0.5, y: 0.3 }}
        end={{ x: 0.5, y: 0.9 }}
        style={StyleSheet.absoluteFillObject}
      />
      <LinearGradient
        colors={['rgba(0,0,0,0)', 'rgba(10,0,10,0.5)']}
        start={{ x: 0.5, y: 1 }}
        end={{ x: 0.5, y: 0.05 }}
        style={StyleSheet.absoluteFillObject}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContentContainer}
        horizontal={true}
        snapToInterval={responsiveWidth(80) + 20}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={20}
        onScroll={onScroll}
      >
        {dropies.map(dropy => (
          <View key={dropy.id} style={styles.dropyContainer}>
            <View style={styles.profileContainer}>
              <View style={styles.profileImage}>
                <ProfileImage />
              </View>

              <View style={styles.profileInfos}>
                <Text style={{ ...Fonts.bold(17, Colors.darkGrey) }}>Michel</Text>
                <Text style={{ ...Fonts.regular(10, Colors.grey), marginTop: 3 }}>@Michel</Text>
              </View>

              <TouchableOpacity>
                <Ionicons
                  name="md-chatbubble-outline"
                  size={30}
                  color={Colors.grey}
                  style={styles.icons}
                />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </Animated.View>
  );
};

export default MuseumOverlay;

const styles = StyleSheet.create({
  scrollView: {
    position: 'absolute',
    bottom: responsiveHeight(20),
    left: 0,
    right: 0,
  },
  scrollViewContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  dropyContainer: {
    width: responsiveWidth(80),
    marginHorizontal: 10,
    backgroundColor: Colors.white,
    borderRadius: 30,
    padding: 15,
  },
  profileContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 25,
    overflow: 'hidden',
  },
  profileInfos: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
});
