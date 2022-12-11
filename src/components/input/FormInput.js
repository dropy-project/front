import { Feather, Ionicons } from '@expo/vector-icons';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { Colors, Fonts } from '../../styles/Styles';

const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const FormInput = (props, ref) => {
  const {
    onEdited = () => {},
    title = null, placeholder = '',
    defaultValue = '',
    inputStyle,
    style,
    isPassword = false,
    isEmail = false,
    maxLength,
    minLength,
  } = props;

  const [value, setValue] = useState(defaultValue);
  const [selected, setSelected] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [valid, setValid] = useState(true);
  const [validityErrorMessage, setValidityErrorMessage] = useState('');
  const [partialValidity, setPartialValidity] = useState('');

  useEffect(() => {
    setValid(true);
    if (isPassword || isEmail)
      checkValidity(true, true);
  }, [value]);

  const checkValidity = (partialValidation = false, ignoreEmpty = false) => {
    if (ignoreEmpty && value?.trim() === '')
      return true;
    setPartialValidity(partialValidation);

    const notEmpty = value?.trim() !== '';
    const emailValid = (!isEmail || EMAIL_REGEX.test(value.trim()));
    if (!emailValid)
      setValidityErrorMessage('Cet email n\'est pas valide');

    const maxLengthValid = (!maxLength || value?.trim().length <= maxLength);
    if (!maxLengthValid)
      setValidityErrorMessage(`La taille max est de ${maxLength}`);

    const minLengthValid = (!minLength || value?.trim().length >= minLength);
    if (!minLengthValid)
      setValidityErrorMessage(`Doit contenir au moins ${minLength} caractères`);

    const passwordLengthValid = !isPassword || value?.trim().length >= 6;
    if (!passwordLengthValid)
      setValidityErrorMessage('Doit contenir au moins 6 caractères');

    const passwordContainsNumber = !isPassword || /\d/.test(value);
    if (!passwordContainsNumber)
      setValidityErrorMessage('Doit contenir au moins un chiffre');

    const passwordContainsUppercase = !isPassword || /[A-Z]/.test(value);
    if (!passwordContainsUppercase)
      setValidityErrorMessage('Doit contenir au moins une majuscule');

    const inputValid = value != null && notEmpty && emailValid && maxLengthValid && minLengthValid && passwordLengthValid && passwordContainsNumber && passwordContainsUppercase;
    setValid(inputValid);
    return inputValid;
  };

  useImperativeHandle(ref, () => ({
    getValue: () => value?.trim(),
    isValid: checkValidity,
    setInvalid: (reason = null) => {
      setValid(false);
      reason && setValidityErrorMessage(reason);
    },
  }));

  return (
    <View style={{ ...styles.container, ...style }}>
      {title != null && (<Text style={styles.text}>{title}</Text>)}
      <View style={{
        ...styles.textInputContainer,
        ...inputStyle,
        borderColor: valid ? 'transparent' : (partialValidity ? Colors.mainBlue : Colors.red),
      }}>
        <TextInput
          onFocus={() => setSelected(true)}
          onBlur={() => setSelected(false)}
          onChangeText={(text) => {
            setValue(text);
            onEdited(text);
          }}
          style={{ ...Fonts.regular(12, Colors.darkGrey), ...styles.textInput, textAlignVertical: 'top' }}
          placeholder={placeholder}
          placeholderTextColor={Colors.grey}
          returnKeyType='done'
          onEndEditing={() => onEdited(value)}
          textAlignVertical='top'
          secureTextEntry={isPassword && !showPassword}
          autoCapitalize={isEmail || isPassword ? 'none' : 'sentences'}
          autoCorrect={!(isEmail || isPassword)}
          {...props}
        />
        {(!valid && validityErrorMessage !== '') && (
          <Text style={{ ...Fonts.regular(10, (partialValidity ? Colors.darkGrey : Colors.red)), ...styles.errorMessage }}>
            {validityErrorMessage}
          </Text>
        )}
        {selected && maxLength != null && (
          <Text style={{ ...Fonts.bold(10, (value?.length || 0) === maxLength ? Colors.red : Colors.grey) }}>
            {value?.length || 0}/{maxLength}
          </Text>
        )}
        {!selected && !isPassword && (
          <Feather style={{ marginLeft: 4 }} name='edit-2' size={15} color={Colors.darkGrey} />
        )}
        {isPassword && (
          <TouchableOpacity hitSlop={{ bottom: 10, left: 10, right: 10, top: 10 }} onPress={() => setShowPassword((old) => !old)}>
            {showPassword ? (
              <Ionicons name='eye-off-sharp' style={{ marginLeft: 4 }} size={15} color={Colors.darkGrey} />
            ) : (
              <Ionicons name='eye' style={{ marginLeft: 4 }} size={15} color={Colors.darkGrey} />
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
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
    padding: Platform.OS === 'ios' ? 10 : 0,
    paddingLeft: 10,
    paddingTop: 10,
    paddingRight: 10,
  },
  textInput: {
    flex: 1,
    padding: 0,
  },
  errorMessage: {
    position: 'absolute',
    bottom: -20,
    left: 0,
    maxWidth: '80%',
  },
});
