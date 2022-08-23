import { useEffect } from 'react';
import { Linking } from 'react-native';
import { openPicker } from 'react-native-image-crop-picker';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import useOverlay from '../hooks/useOverlay';
import { compressImage } from '../utils/files';
import MEDIA_TYPES from '../utils/mediaTypes';

const CreateDropyFromLibrary = ({ navigation }) => {

  const { sendAlert } = useOverlay();

  useEffect(() => {
    openImageLibraryAndValidate();
  }, []);

  const openImageLibraryAndValidate = async () => {
    try {
      const image = await openPicker({
        width: responsiveWidth(100),
        height: responsiveHeight(100),
        cropping: true,
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
      if(error.code === 'E_NO_LIBRARY_PERMISSION') {
        const alertResult = await sendAlert({
          title: 'LIbrary access not granted...',
          description: 'Enable access in your settings',
          validateText: 'Open settings',
          denyText: 'Ok !',
        });
        if(alertResult) {
          Linking.openSettings();
        }
      }
      console.error('Open image library error', error);
      navigation.goBack();
    }
  };

  return null;
};

export default CreateDropyFromLibrary;
