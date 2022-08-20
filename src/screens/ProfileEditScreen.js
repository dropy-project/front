import { useActionSheet } from '@expo/react-native-action-sheet';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import FormInput from '../components/FormInput';
import GoBackHeader from '../components/GoBackHeader';
import Styles, { Colors } from '../styles/Styles';

const ProfileEditScreen = () => {

  const { showActionSheetWithOptions } = useActionSheet();

  const onPressEditPicture = () => {
    showActionSheetWithOptions({
      options: ['Take a photo', 'Choose from library', 'Cancel'],
      cancelButtonIndex: 2,
      title: 'Where do you want to get your picture from?',
    }, (buttonIndex) => {
      if (buttonIndex === 0) {
        updateProfilePictureFromCamera();
      } else if (buttonIndex === 1) {
        updateProfilePictureFromLibrary();
      }
    });
  };

  const updateProfilePictureFromLibrary = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1,
      presentationStyle: 'overFullScreen',
    });

    console.log(result);
  };

  const updateProfilePictureFromCamera = async () => {
    const result = await launchCamera({
      mediaType: 'photo',
      quality: 0.1,
    });

    console.log(result);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <GoBackHeader text="Profile" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}>
        <TouchableOpacity style={styles.profilePictureButton} onPress={onPressEditPicture}>
          <Image source={require('../assets/guigui1.png')} resizeMode='cover' style={{ position: 'absolute', width: '100%', height: '100%' }} />
          <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)' }} />
          <Feather name="edit-2" size={30} color={Colors.white} />
        </TouchableOpacity>

        <FormInput title="Name" placeholder="What's your name?"  />
        <FormInput title="About" placeholder="WHat makes you special?" multiline />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileEditScreen;

const styles = StyleSheet.create({
  container: {
    ...Styles.safeAreaView,
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollViewContent: {
    width: '100%',
    paddingVertical: 20,
    alignItems: 'center',
  },
  profilePictureButton: {
    width: 100,
    height: 100,
    borderRadius: 30,
    backgroundColor: Colors.purple2,
    ...Styles.center,
    overflow: 'hidden',
  },
});
