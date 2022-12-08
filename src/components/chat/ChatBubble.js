import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import Styles, { Colors, Fonts } from '../../styles/Styles';
import { chunckHeaderTimeString, messageTimeString } from '../../utils/time';
import FadeInWrapper from '../effect/FadeInWrapper';
import DropyMediaViewer from '../other/DropyMediaViewer';
import DebugText from '../other/DebugText';


const ChatBubble = (props) => (
  <FadeInWrapper delay={props?.animationDelay ?? 0}>
    {props.isChunkFirstMessage && (
      <Text style={styles.chunkFirstMessageText}>{chunckHeaderTimeString(props?.date)}</Text>
    )}
    <Bubble {...props} />
  </FadeInWrapper>
);

export default ChatBubble;

const Bubble = ({ isLeft, content, date, read, showDate, hourDifference }) => {
  const navigation = useNavigation();
  if (typeof content !== 'string') {
    return (
      <View style={{ ...styles.dropyContainer, maxHeight: 500 }}>
        <TouchableOpacity onPress={() => navigation.navigate('DisplayDropyMedia', { dropy: content, showBottomModal: false })}>
          <DropyMediaViewer dropy={content} style={styles.dropyMediaContainer} />
        </TouchableOpacity>
        <Text style={{ ...Fonts.bold(12, Colors.darkGrey), marginTop: 5 }}>{messageTimeString(content.retrieveDate)}</Text>
        <DebugText showBoundingBox date={date}>Dropy msg</DebugText>
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
        </Text>
      </View>
      {showDate && (
        <Text style={{
          ...styles.lastMessageTimeStampText,
          right: isLeft ? undefined : '7%',
          left: isLeft ? '7%' : undefined,
        }}>
          {(read && !isLeft) && 'Lu • '}{messageTimeString(date)}
        </Text>
      )}
      <DebugText showBoundingBox date={date}>{hourDifference}h diff | txt : [{content}]</DebugText>
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
    paddingVertical: 10,
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
  lastMessageTimeStampText: {
    position: 'absolute',
    ...Fonts.bold(10, Colors.lightGrey),
    bottom: '-35%',
  },
  chunkFirstMessageText: {
    ...Fonts.bold(11, Colors.lightGrey),
    marginTop: 30,
    marginBottom: 5,
    textAlign: 'center',
  },
});
