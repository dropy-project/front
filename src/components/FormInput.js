import { Feather } from '@expo/vector-icons';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { Colors, Fonts } from '../styles/Styles';


const FormInput = (props, ref) => {
  const { onEdited = () => {}, title = '""', placeholder = '', defaultValue = '' } = props;

  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    onEdited(value !== defaultValue);
  }, [value]);

  useImperativeHandle(ref, () => ({
    getValue: () => value,
  }));

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Text style={styles.text}>{title}</Text>
      <View style={styles.textInputContainer}>
        <TextInput
          onChangeText={(text) => setValue(text)}
          style={{ ...Fonts.regular(12, Colors.darkGrey), ...styles.textInput }}
          placeholder={placeholder}
          placeholderTextColor={Colors.lightGrey}
          returnKeyType="done"
          onEndEditing={() => onEdited(value)}
          {...props}
        />
        <Feather name="edit-2" size={15} color={Colors.darkGrey} />
      </View>
    </KeyboardAvoidingView>
  );
};

export default forwardRef(FormInput);

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
  textInput: {
    flex: 1,
  },
});
