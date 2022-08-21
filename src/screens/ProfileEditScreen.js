import { useActionSheet } from '@expo/react-native-action-sheet';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useRef, useState } from 'react';
import {
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
import GoBackHeader from '../components/GoBackHeader';
import ProfileImage from '../components/ProfileImage';
import useCurrentUser from '../hooks/useCurrentUser';
import API from '../services/API';
import Styles, { Colors, Fonts } from '../styles/Styles';
import { compressImage } from '../utils/files';

const ProfileEditScreen = () => {

  const navigation = useNavigation();
  const { user, setUser } = useCurrentUser();
  const { showActionSheetWithOptions } = useActionSheet();

  const [edited, setEdited] = useState(false);

  const aboutInputRef = useRef();
  const displayNameInputRef = useRef();

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

    if(result.didCancel) {
      throw new Error('User cancelled image picker');
    }

    const filePath = await compressImage(result.assets[0].uri);

    const response = await API.postProfilePicture(filePath);
    console.log('API response : ', response.data);
    setUser({ ...user });
  };

  const updateProfilePictureFromCamera = async () => {
    const result = await launchCamera({
      mediaType: 'photo',
      quality: 0.1,
    });

    console.log(result);
  };

  const updateProfile = async () => {
    const displayName = displayNameInputRef.current?.getValue();
    const about = aboutInputRef.current?.getValue();
    const response = await API.postProfileInfos(about, 'UNKOWN', displayName);
    const profile = response.data;
    console.log(profile);
    setUser(profile);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <GoBackHeader text="Profile">
        {edited && (
          <TouchableOpacity onPress={updateProfile}>
            <Text style={{ ...Fonts.regular(16, Colors.mainBlue) }}>save</Text>
          </TouchableOpacity>
        )}
      </GoBackHeader>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}>
        <TouchableOpacity style={styles.profilePictureButton} onPress={onPressEditPicture}>
          <ProfileImage resizeMode='cover' style={{ position: 'absolute', width: '100%', height: '100%' }} />
          <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)' }} />
          <Feather name="edit-2" size={30} color={Colors.white} />
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
