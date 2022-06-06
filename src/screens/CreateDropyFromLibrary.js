import { useEffect } from 'react';
import { launchImageLibrary } from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
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

      await resizeImageAndValidate(result.assets[0].uri);

    } catch (error) {
      console.log(error);
      navigation.goBack();
    }
  };

  const resizeImageAndValidate = async (imageUri) => {
    const response = await ImageResizer.createResizedImage(imageUri, 772, 1029, 'JPEG', 50, 0);

    const params = {
      dropyFilePath: response.path,
      dropyData: null,
      mediaType: MEDIA_TYPES.PICTURE,
      originRoute: 'CreateDropyFromLibrary',
    };

    navigation.reset({
      index: 0,
      routes: [{ name: 'Home', params: { dropyCreateParams: params } }],
    });
  };

  return null;
};

export default CreateDropyFromLibrary;
