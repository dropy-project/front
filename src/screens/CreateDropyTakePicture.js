import { useEffect } from 'react';
import { openCamera } from 'react-native-image-crop-picker';
import { Linking } from 'react-native';
import MEDIA_TYPES from '../utils/mediaTypes';
import { compressImage } from '../utils/files';
import useOverlay from '../hooks/useOverlay';

const CreateDropyTakePicture = ({ navigation }) => {
  const { sendAlert } = useOverlay();

  useEffect(() => {
    handleCamera();
  }, []);

  const handleCamera = async () => {
    try {
      const image = await openCamera({
        forceJpg: false,
        maxFiles: 1,
        compressImageQuality: 1,
        cropping: true,
        mediaType: 'photo',
      });

      navigation.navigate('Home', {
        dropyCreateParams: {
          dropyFilePath: await compressImage((await image).path),
          dropyData: null,
          mediaType: MEDIA_TYPES.PICTURE,
          originRoute: 'CreateDropyTakePicture',
        },
      });
    } catch (error) {
      navigation.goBack();

      if (error.code === 'E_NO_CAMERA_PERMISSION') {
        const alertResult = await sendAlert({
          title: 'Camera not granted...',
          description: 'Enable camera access in your settings',
          validateText: 'Open settings',
          denyText: 'Ok !',
        });
        if (alertResult)
          Linking.openSettings();
      }
      console.error('Open camera error', error);
    }
  };

  return null;
};

export default CreateDropyTakePicture;
