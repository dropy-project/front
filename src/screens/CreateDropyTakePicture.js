import { useEffect } from 'react';
import { openCamera } from 'react-native-image-crop-picker';
import MEDIA_TYPES from '../utils/mediaTypes';
import { compressImage } from '../utils/files';
import useOverlay from '../hooks/useOverlay';
import { missingCameraPersmissionAlert } from '../utils/mediaPermissionsAlerts';

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
      if (error.code === 'E_NO_CAMERA_PERMISSION')
        missingCameraPersmissionAlert(sendAlert);
      console.error('Open camera error', error);
    }
  };

  return null;
};

export default CreateDropyTakePicture;
