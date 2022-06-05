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
    await ImageResizer.createResizedImage(imageUri, 500, 600, 'JPEG', 10, 0, imageUri);

    const params = {
      dropyFilePath: imageUri,
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
