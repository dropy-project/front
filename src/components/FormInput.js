import { Feather, Ionicons } from '@expo/vector-icons';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { Colors, Fonts } from '../styles/Styles';


const FormInput = (props, ref) => {
  const { onEdited = () => {}, title = null, placeholder = '', defaultValue = '', inputStyle, style, isPassword = false } = props;

  const [value, setValue] = useState(defaultValue);
  const [selected, setSelected] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [valid, setValid] = useState(true);

  useEffect(() => {
    onEdited(value !== defaultValue);
  }, [value]);

  useImperativeHandle(ref, () => ({
    getValue: () => value.trim(),
    isValid: () => {
      setValid(value?.trim().length > 0);
      return value?.trim().length > 0;
    },
  }));

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ ...styles.container, ...style }}
    >
      {title != null && (<Text style={styles.text}>{title}</Text>)}
      <View style={{
        ...styles.textInputContainer,
        ...inputStyle,
        borderColor: valid ? 'transparent' : Colors.red,
      }}>
        <TextInput
          onFocus={() => setSelected(true)}
          onBlur={() => setSelected(false)}
          onChangeText={(text) => setValue(text)}
          style={{ ...Fonts.regular(12, Colors.darkGrey), ...styles.textInput }}
          placeholder={placeholder}
          placeholderTextColor={Colors.grey}
          returnKeyType="done"
          onEndEditing={() => onEdited(value)}
          textAlignVertical="top"
          secureTextEntry={isPassword && !showPassword}

          {...props}
        />
        {selected && props.maxLength != null && (
          <Text style={{ ...Fonts.bold(10, (value?.length || 0) === props.maxLength ? Colors.red : Colors.grey) }}>
            {value?.length || 0}/{props.maxLength}
          </Text>
        )}
        {!selected && !isPassword && (
          <Feather style={{ marginLeft: 4 }} name="edit-2" size={15} color={Colors.darkGrey} />
        )}
        {isPassword && (
          <TouchableOpacity onPress={() =>  setShowPassword(old => !old)}>
            {showPassword ? (
              <Ionicons name="eye-off-sharp" style={{ marginLeft: 4 }} size={20} color={Colors.darkGrey} />
            ) : (
              <Ionicons name="eye" style={{ marginLeft: 4 }} size={20} color={Colors.darkGrey} />
            )}
          </TouchableOpacity>
        )}
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
    borderWidth: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.lighterGrey,
    width: '100%',
    borderRadius: 10,
    padding: 10,
  },
  textInput: {
    flex: 1,
    padding: 0,
  },
});
