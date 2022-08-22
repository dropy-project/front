import { useActionSheet } from '@expo/react-native-action-sheet';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useRef, useState } from 'react';
import {
  Keyboard,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import FormInput from '../components/FormInput';
import FormSelect from '../components/FormSelect';
import GoBackHeader from '../components/GoBackHeader';
import LoadingSpinner from '../components/LoadingSpinner';
import ProfileImage from '../components/ProfileImage';
import useCurrentUser from '../hooks/useCurrentUser';
import useOverlay from '../hooks/useOverlay';
import API from '../services/API';
import Styles, { Colors, Fonts } from '../styles/Styles';
import { compressImage } from '../utils/files';
import { PRONOUNS } from '../utils/profiles';

const ProfileEditScreen = () => {

  const navigation = useNavigation();

  const { sendAlert } = useOverlay();

  const { user, setUser } = useCurrentUser();
  const { showActionSheetWithOptions } = useActionSheet();

  const [edited, setEdited] = useState(false);
  const [infosUploading, setInfosUploading] = useState(false);
  const [pictureUploading, setPictureUploading] = useState(false);

  const aboutInputRef = useRef();
  const displayNameInputRef = useRef();
  const pronounsRef = useRef();

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

    processPickerResponseUpload(result);
  };

  const updateProfilePictureFromCamera = async () => {
    const result = await launchCamera({
      mediaType: 'photo',
      quality: 0.1,
    });

    processPickerResponseUpload(result);
  };

  const processPickerResponseUpload = async (pickerResponse) => {
    if(pickerResponse.didCancel) {
      throw new Error('User cancelled image picker');
    }

    setPictureUploading(true);
    try {
      const filePath = await compressImage(pickerResponse.assets[0].uri);
      const response = await API.postProfilePicture(filePath);
      console.log('API response : ', response.data);
      setUser({ ...user });
    } catch (error) {
      sendAlert({
        title: 'Oh no...',
        description: 'Your profile picture has been lost somewhere...\nCheck your internet connection!',
      });
      console.error('Error while uploading profile picture', error?.response?.data || error);
    } finally {
      setPictureUploading(false);
    }
  };

  const updateProfile = async () => {
    setInfosUploading(true);
    try {
      Keyboard.dismiss();

      let valid = true;
      if(!displayNameInputRef.current.isValid()) {
        valid = false;
      }
      if(!aboutInputRef.current.isValid()) {
        valid = false;
      }

      if(!valid) return;

      const displayName = displayNameInputRef.current?.getValue();
      const about = aboutInputRef.current?.getValue();
      const pronouns = Object.keys(PRONOUNS)[pronounsRef.current?.getValue()];
      const response = await API.postProfileInfos(about, pronouns, displayName);

      const profile = response.data;
      setUser(profile);

      navigation.goBack();
    } catch (error) {
      sendAlert({
        title: 'Oh no...',
        description: 'We could\'nt update your profile\nCheck your internet connection!',
      });
      console.error('Error while updatng profile', error?.response?.data || error);
    } finally {
      setInfosUploading(false);
      setEdited(false);
    }
  };

  const handleGoBack = async () => {
    if (!edited) {
      navigation.goBack();
      return;
    }

    const result = await sendAlert({
      title: 'Are you sure?',
      description: 'You haven\'t saved your changes yet!\nAre you sure you want to go back?',
      validateText: 'Save',
      denyText: 'Go back',
    });

    if (result) {
      updateProfile();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <GoBackHeader onPressGoBack={handleGoBack} text="Profile">
        <View style={{ width: 40 }}>
          {infosUploading ? (
            <LoadingSpinner color={Colors.mainBlue} size={20} />
          ) : (
            <>
              {edited && (
                <TouchableOpacity onPress={updateProfile}>
                  <Text style={{ ...Fonts.bold(16, Colors.mainBlue) }}>save</Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </GoBackHeader>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}>
        <TouchableOpacity style={styles.profilePictureButton} onPress={onPressEditPicture}>
          <ProfileImage resizeMode='cover' style={{ position: 'absolute', width: '100%', height: '100%' }} />
          <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)' }} />
          {pictureUploading ? (
            <LoadingSpinner color={Colors.white} size={30} />
          ) : (
            <Feather name="edit-2" size={30} color={Colors.white} />
          )}
        </TouchableOpacity>

        <FormInput
          ref={displayNameInputRef}
          onEdited={(edited) => edited && setEdited(true)}
          title="Name"
          defaultValue={user.displayName}
          placeholder="What's your name?"
          maxLength={25}
        />

        <FormInput
          ref={aboutInputRef}
          onEdited={(edited) => edited && setEdited(true)}
          title="About"
          defaultValue={user.about}
          placeholder="What makes you special?"
          multiline
          maxLength={250}
          inputStyle={{ minHeight: 100 }}
        />

        <FormSelect
          ref={pronounsRef}
          defaultIndex={Object.keys(PRONOUNS).indexOf(user.pronouns)}
          title="Pronouns"
          onEdited={(edited) => edited && setEdited(true)}
          options={Object.values(PRONOUNS)}
        />
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
