import { useEffect } from 'react';
import { openPicker } from 'react-native-image-crop-picker';
import useOverlay from '../hooks/useOverlay';
import { compressImage } from '../utils/files';
import { missingLibraryPermissionAlert as missingLibraryPersmissionAlert } from '../utils/mediaPermissionsAlerts';
import MEDIA_TYPES from '../utils/mediaTypes';

const CreateDropyFromLibrary = ({ navigation }) => {
  const { sendAlert } = useOverlay();

  useEffect(() => {
    openImageLibraryAndValidate();
  }, []);

  const openImageLibraryAndValidate = async () => {
    try {
      const image = await openPicker({
        cropping: false,
        forceJpg: true,
        maxFiles: 1,
        compressImageQuality: 1,
        mediaType: 'photo',
      });

      navigation.navigate('Home', {
        dropyCreateParams: {
          dropyFilePath: await compressImage(image.path),
          dropyData: null,
          mediaType: MEDIA_TYPES.PICTURE,
          originRoute: 'CreateDropyFromLibrary',
        },
      });
    } catch (error) {
      if (error.code === 'E_NO_LIBRARY_PERMISSION')
        missingLibraryPersmissionAlert(sendAlert);
      console.error('Open image library error', error);
      navigation.goBack();
    }
  };

  return null;
};

export default CreateDropyFromLibrary;
