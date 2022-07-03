import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Styles, { Colors, Fonts } from '../styles/Styles';

const ChatBubble = ({ isLeft, content, timestamp, read }) => {
  return (
    <View
      style={{
        ...styles.container,
        justifyContent: isLeft ? 'flex-start' : 'flex-end',
      }}>
      <View
        style={{
          ...styles.bubble,
          backgroundColor: isLeft ? Colors.purple2 : Colors.mainBlue,
        }}>
        <Text style={styles.textContent}>
          {content}
          <View style={{ ...styles.timeStampContainer }}>
            {read && (
              <Ionicons
                name="checkmark-done"
                size={17}
                color={Colors.white}
              />
            )}
            <Text style={styles.lastMessageTimeStampText}>
              {timestamp ?? '10:20'}
            </Text>
          </View>
        </Text>
      </View>
    </View>
  );
};

export default ChatBubble;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 5,
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
    ...Fonts.bold(14, Colors.white),
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
    ...Fonts.bold(11, Colors.white),
    marginLeft: 4,
    flexWrap: 'wrap',
  },
});
