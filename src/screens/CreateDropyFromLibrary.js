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
        presentationStyle: 'overFullScreen',
      });

      const params = {
        dropyFilePath: await compressImage(result.assets[0].uri),
        dropyData: null,
        mediaType: MEDIA_TYPES.PICTURE,
        originRoute: 'CreateDropyFromLibrary',
      };

      navigation.reset({
        index: 0,
        routes: [{ name: 'Home', params: { dropyCreateParams: params } }],
      });

    } catch (error) {
      console.log(error);
      navigation.goBack();
    }
  };

  return null;
};

export default CreateDropyFromLibrary;
