import React, { useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import { SimpleLineIcons } from '@expo/vector-icons';
import GoBackHeader from '../components/other/GoBackHeader';
import Styles, { Colors, Fonts } from '../styles/Styles';
import API from '../services/API';
import useOverlay from '../hooks/useOverlay';

import FormInput from '../components/input/FormInput';
import GlassButton from '../components/input/GlassButton';
import useCurrentUser from '../hooks/useCurrentUser';

const ResetPasswordScreen = ({ navigation }) => {
  const { user } = useCurrentUser();

  const [email, setEmail] = useState(user?.email || '');

  const emailInputRef = useRef();

  const { sendAlert } = useOverlay();

  const sendRequest = async () => {
    if (!emailInputRef.current?.isValid()) {
      sendAlert({
        title: 'Oh non...',
        description: 'Cet email n\'est pas valide ! \n Entre un email valide',
      });
      return;
    }

    try {
      const response = await API.checkEmailAvailable(email);
      if (!response.data) {
        API.requestResetPassword(email);
        sendAlert({
          title: 'Email envoyé !',
          description: 'Un email t\'a été envoyé pour réinitialiser ton mot de passe',
        });
        navigation.goBack();
      } else {
        sendAlert({
          title: 'Oh non...',
          description: 'Cet email n\'existe pas ! \n Entre un email valide',
        });
      }
      return response.data;
    } catch (error) {
      sendAlert({
        description: 'Vérifie ta connexion internet',
        title: 'Oups une erreur est survenue',
        validateText: 'Ok',
      });
      console.error('Error while checking if an email is available', email, error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <GoBackHeader text='Reset Password' />
      <View style={styles.content}>
        <View style={styles.formBox}>
          <SimpleLineIcons name='key' size={74} color={Colors.purple1} style={{ transform: [{ rotate: '180deg' }] }} />
          <View style={styles.form}>
            <Text style={styles.title}>Réinitialiser son mot de passe</Text>
            <FormInput
              ref={emailInputRef}
              placeholder='Email'
              inputStyle={{ backgroundColor: Colors.lighterGrey }}
              onEdited={setEmail}
              isEmail
              defaultValue={email}
              autoComplete='email'
            />
          </View>
          <Text style={styles.description}>Un lien permettant de créer ton nouveau mot de passe te sera ensuite envoyé sur ton adresse email.</Text>
          <GlassButton buttonText='Envoyer' style={styles.backButton} onPress={() => sendRequest()} fontSize={17} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ResetPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.white,
    ...Styles.safeAreaView,
  },
  content: {
    width: responsiveWidth(100),
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 20,
    height: '90%',
  },
  formBox: {
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '80%',
    height: '80%',
    margin: 30,
  },
  form: {
    width: '100%',
    alignItems: 'center',
    height: '20%',
  },
  title: {
    ...Fonts.bold(14, Colors.grey),
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    width: '70%',
    textAlign: 'center',
    lineHeight: 14,
    ...Fonts.regular(12, Colors.grey),
  },
  backButton: {
    width: '50%',
    height: 50,
    borderRadius: 20,
  },
});
