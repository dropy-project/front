import { View, Text, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Styles, { Colors } from '../styles/Styles';

export default function FormCheckBox({ text }) {

  const [checked, setChecked] = useState(false);


  const textBeforeBrackets = text?.split('{')[0];
  const textBetweenBrackets = (text?.match(/{(.*?)}/) ?? [])[1];

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.checkBox} onPress={() => setChecked(old => !old)}>
        {checked && <View style={styles.checked} />}
      </TouchableOpacity>
      <View style={{ paddingHorizontal: 10 }}>
        {textBeforeBrackets !== '' && <Text style={styles.text}>{textBeforeBrackets}</Text>}
        {textBetweenBrackets != null && (
          <TouchableOpacity>
            <Text style={styles.hyperlink}>{textBetweenBrackets}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 18,
    ...Styles.center,
    flexDirection: 'row',
    marginTop: 10,
  },
  checkBox: {
    width: 30,
    height: 30,
    borderRadius: 7,
    borderColor: Colors.grey,
    borderWidth: 3,
    ...Styles.center,
  },
  checked: {
    width: 10,
    height: 10,
    borderRadius: 20,
    backgroundColor: Colors.grey,
  },
  text: {
    fontSize: 16,
    color: Colors.grey,
    width: 150,
  },
  hyperlink: {
    fontSize: 16,
    color: Colors.mainBlue,
    textDecorationLine: 'underline',
  },

});
