import { useEffect } from 'react';
import { launchImageLibrary } from 'react-native-image-picker';
import { compressImage } from '../utils/files';
import MEDIA_TYPES from '../utils/mediaTypes';

const CreateDropyFromLibrary = ({ navigation }) => {


  useEffect(() => {
    openImageLibraryAndValidate();
  }, []);

  const openImageLibraryAndValidate = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 1,
        presentationStyle: 'popover',
      });

      if(result.didCancel) {
        throw new Error('User cancelled image picker');
      }

      navigation.navigate('Home', {
        dropyCreateParams: {
          dropyFilePath: await compressImage(result.assets[0].uri),
          dropyData: null,
          mediaType: MEDIA_TYPES.PICTURE,
          originRoute: 'CreateDropyFromLibrary',
        },
      });

    } catch (error) {
      console.error('Open image library error', error);
      navigation.goBack();
    }
  };

  return null;
};

export default CreateDropyFromLibrary;
