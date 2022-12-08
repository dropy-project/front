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
import useConversationsSocket from '../../hooks/useConversationsSocket';
import useOverlay from '../../hooks/useOverlay';
import API from '../../services/API';
import Styles, { Colors, Fonts } from '../../styles/Styles';
import { createDropTimeString } from '../../utils/time';
import FadeInWrapper from '../effect/FadeInWrapper';
import LoadingSpinner from '../effect/LoadingSpinner';
import ProfileImage from '../profile/ProfileImage';

const MuseumOverlay = ({ visible = false, setSelectedDropyIndex, setRetrievedDropies }) => {
  const [render, setRender] = useState(false);
  const { sendAlert } = useOverlay();
  const { openChat, conversationIsOpen } = useConversationsSocket();

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
      if (finished)
        setRender(visible);
    });

    return anim.stop;
  }, [visible]);

  useEffect(() => {
    if (!visible)
      return;
    loadDropies();
  }, [visible]);

  const loadDropies = async () => {
    try {
      setLoading(true);
      const response = await API.getUserRetrievedDropies();

      setDropies(response.data);
      setRetrievedDropies(response.data);
      setLoading(false);

      setSelectedDropyIndex(0);
    } catch (error) {
      sendAlert({
        title: 'Oh non...',
        description: 'Je n\'ai pas réussi à charger les drops autour de toi...\nVérifie ta connexion internet !',
      });
      console.error('Error while fetching user dropies', error?.response?.data || error);
    }
  };

  const onScroll = ({ nativeEvent }) => {
    const index = Math.round(nativeEvent.contentOffset.x / (responsiveWidth(80) + 20));
    const clampedIndex = Math.max(0, Math.min(dropies.length - 1, index));
    setSelectedDropyIndex(clampedIndex);
  };

  if (!render)
    return null;

  return (
    <Animated.View style={{
      ...styles.container,
      opacity: menuAnimatedValue,
    }}>
      <LinearGradient
        colors={['rgba(0,0,0,0)', 'rgba(10,0,10,0.7)']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1.5 }}
        style={StyleSheet.absoluteFillObject}
        pointerEvents='none'
      />

      {loading ? (
        <View style={styles.loadingContainer}>
          <LoadingSpinner color={Colors.white} />
        </View>
      ) : (
        <>
          {dropies.length === 0 ? (
            <View style={styles.loadingContainer}>
              <Ionicons
                name='md-bookmark-outline'
                size={30}
                color={Colors.white}
              />
              <Text style={{ ...Fonts.bold(17, Colors.white), marginTop: 20, maxWidth: '60%', textAlign: 'center' }}>
                {'Tu n\'as pas encore récupéré de drops !'}
              </Text>
            </View>
          ) : (
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollViewContentContainer}
              horizontal={true}
              snapToInterval={responsiveWidth(80) + 20}
              decelerationRate='fast'
              showsHorizontalScrollIndicator={false}
              scrollEventThrottle={20}
              onScroll={onScroll}
            >
              {dropies.map((dropy, index) => (
                <FadeInWrapper key={dropy.id} delay={index * 50}>
                  <View style={styles.dropyContainer}>
                    <View style={styles.profileContainer}>
                      <View style={styles.profileImage}>
                        <ProfileImage avatarUrl={dropy.emitter.avatarUrl} displayName={dropy.emitter.displayName} />
                      </View>

                      <View style={styles.profileInfos}>
                        <Text style={{ ...Fonts.bold(17, Colors.darkGrey) }}>{dropy.emitter.displayName}</Text>
                        <Text style={{ ...Fonts.regular(10, Colors.grey), marginTop: 3 }}>@{dropy.emitter.username}</Text>
                      </View>

                      {conversationIsOpen(dropy.conversationId) && (
                        <TouchableOpacity onPress={() => openChat(dropy.conversationId)}>
                          <Ionicons
                            name='md-chatbubble-outline'
                            size={30}
                            color={Colors.grey}
                            style={styles.icons}
                          />
                        </TouchableOpacity>
                      )}
                    </View>

                    <View style={styles.dropInfosContainer}>
                      <View style={styles.dropInfo}>
                        <Text style={{ ...Fonts.bold(10, Colors.grey) }}>Dropped :</Text>
                        <Text style={{ ...Fonts.bold(11, Colors.darkGrey), marginTop: 3 }}>
                          {createDropTimeString(new Date() - new Date(dropy.creationDate))} ago - {dropy.emitter.displayName}
                        </Text>
                      </View>
                      <View style={styles.dropInfo}>
                        <Text style={{ ...Fonts.bold(10, Colors.grey) }}>Found :</Text>
                        <Text style={{ ...Fonts.bold(11, Colors.darkGrey), marginTop: 3 }}>
                          {createDropTimeString(new Date() - new Date(dropy.creationDate))} ago - {dropy.retriever.displayName}
                        </Text>
                      </View>
                    </View>
                  </View>
                </FadeInWrapper>
              ))}
            </ScrollView>
          )}
        </>
      )}
    </Animated.View>
  );
};

export default MuseumOverlay;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: responsiveHeight(40),
  },
  loadingContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    ...Styles.center,
    bottom: responsiveHeight(20),
  },
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
  dropInfosContainer: {
    marginTop: 10,
    paddingHorizontal: 10,
  },
  dropInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
  },
});
