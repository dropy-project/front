import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import Styles, { Colors, Fonts } from '../styles/Styles';
import { messageTimeString } from '../utils/time';
import FadeInWrapper from './FadeInWrapper';
import DropyMediaViewer from './DropyMediaViewer';


const ChatBubble = (props) => (
  <FadeInWrapper delay={props?.animationDelay ?? 0}>
    <Bubble {...props} />
  </FadeInWrapper>
);

export default ChatBubble;

const Bubble = ({ isLeft, content, date, read, showDate }) => {
  const navigation = useNavigation();
  if(typeof content !== 'string') {
    return (
      <View style={{ ...styles.dropyContainer, maxHeight: 500 }}>
        <TouchableOpacity onPress={() => navigation.navigate('DisplayDropyMedia', { dropy: content, showBottomModal: false })}>
          <DropyMediaViewer {...content} style={styles.dropyMediaContainer} />
        </TouchableOpacity>
        <Text style={{ ...Fonts.bold(12, Colors.darkGrey), marginTop: 5 }}>{messageTimeString(content.retrieveDate)}</Text>
      </View>
    );
  }

  return (
    <View
      style={{
        ...styles.container,
        justifyContent: isLeft ? 'flex-start' : 'flex-end',
      }}>
      <View
        style={{
          ...styles.bubble,
          backgroundColor: isLeft ? Colors.lightGrey : Colors.mainBlue,
        }}>
        <Text style={styles.textContent}>
          {content}
          <View style={styles.timeStampContainer}>
            {read && (
              <Ionicons
                name="checkmark-done"
                size={17}
                color={Colors.white}
              />
            )}
          </View>
        </Text>
      </View>
      {showDate && (
        <Text style={{
          ...styles.lastMessageTimeStampText,
          right: isLeft ? undefined : '7%',
          left: isLeft ? '7%' : undefined,
        }}>
          {messageTimeString(date)}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 2,
  },
  dropyContainer: {
    paddingVertical: 30,
    flexDirection: 'column',
    alignItems: 'center',
  },
  dropyMediaContainer: {
    height: responsiveWidth(80),
    width: responsiveWidth(60),
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: Colors.lighterGrey,
  },
  bubble: {
    maxWidth: '70%',
    backgroundColor: Colors.purple2,
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 12,
    ...Styles.softShadows,
    shadowColor: Colors.purple2,
  },
  textContent: {
    ...Fonts.bold(13, Colors.white),
    alignItems: 'center',
    flexDirection: 'row-reverse',
  },
  timeStampContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
  },
  lastMessageTimeStampText: {
    position: 'absolute',
    ...Fonts.bold(10, Colors.lightGrey),
    bottom: '-35%',
  },
});
