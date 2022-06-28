import { Platform } from 'react-native';
import ImageResizer from 'react-native-image-resizer';

/**
 * Compress an image
 * @param imageUri path to the image to compress
 * @returns path of the compressed image (JPEG)
 */
export const compressImage = async (imageUri) => {
  const response = await ImageResizer.createResizedImage(imageUri, 772, 1029, 'JPEG', 50, 0);
  return processPathForPlatform(response.path);
};

/**
 * Remove `file://` from the path on Android
 * @param path
 * @returns processed path
 */
export const processPathForPlatform = (path) => Platform.OS === 'ios' ? path : `file://${path}`;
