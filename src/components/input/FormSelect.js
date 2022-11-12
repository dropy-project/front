import React, { forwardRef, useImperativeHandle, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts } from '../../styles/Styles';


const FormSelect = (props, ref) => {
  const { onEdited = () => {}, title = '', inputStyle, options = [], defaultIndex = 0 } = props;

  const [opened, setOpened] = useState(false);
  const [valueIndex, setValueIndex] = useState(defaultIndex);

  useImperativeHandle(ref, () => ({
    getValue: () => valueIndex,
  }));

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Text style={styles.text}>{title}</Text>
      <TouchableOpacity
        onPress={() => setOpened(!opened)}
        style={{
          ...styles.textInputContainer,
          ...inputStyle,
        }}
      >
        <Text style={{ ...Fonts.regular(12, Colors.darkGrey) }}>{options[valueIndex]}</Text>
        <Ionicons style={{ marginLeft: 4, marginTop: 2 }} name={opened ? 'caret-up' : 'caret-down'} size={12} color={Colors.darkGrey} />
      </TouchableOpacity>
      {opened && (
        <View style={styles.optionsContainer}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setValueIndex(index);
                setOpened(false);
                onEdited(true);
              }
              }
              style={styles.option}
            >
              <Text style={{ ...Fonts.regular(12, Colors.darkGrey) }}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

export default forwardRef(FormSelect);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 25,
  },
  text: {
    ...Fonts.regular(12, Colors.grey),
    marginLeft: 10,
    marginBottom: 5,
  },
  textInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.lighterGrey,
    width: '100%',
    borderRadius: 10,
    padding: 10,
  },
  optionsContainer: {
    bottom: -5,
    backgroundColor: Colors.lighterGrey,
    width: '100%',
    padding: 10,
    borderRadius: 10,
  },
  option: {
    paddingVertical: 5,
    paddingHorizontal: 5,
  },
});
