import { useEffect, useState } from 'react';
import { Keyboard } from 'react-native';


const useKeyboardVisible = (keyboardWillShow = () => {}, keyboardWillHide = () => {}) => {

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    const keyboardWillShowListener = Keyboard.addListener(
      'keyboardWillShow',
      keyboardWillShow
    );

    const keyboardWillHideListener = Keyboard.addListener(
      'keyboardWillHide',
      keyboardWillHide
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, []);
  return isKeyboardVisible;

};

export default useKeyboardVisible;

