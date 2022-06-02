import { useEffect } from 'react';
import { launchImageLibrary } from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';

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
    await ImageResizer.createResizedImage(imageUri, 500, 600, 'JPEG', 60, 0, imageUri);
    const params = {
      dropyFilePath: imageUri,
      dropyData: null,
    };

    navigation.reset({
      index: 0,
      routes: [{ name: 'Home', params: { dropyCreateParams: params } }],
    });
  };

  return null;
};

export default CreateDropyFromLibrary;
