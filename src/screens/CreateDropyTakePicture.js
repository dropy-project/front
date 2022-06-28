import { Camera, CameraType } from 'expo-camera';
import React, { useEffect, useRef, useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { responsiveHeight } from 'react-native-responsive-dimensions';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Styles, { Colors, Fonts } from '../styles/Styles';
import GoBackHeader from '../components/GoBackHeader';
import MEDIA_TYPES from '../utils/mediaTypes';
import { compressImage } from '../utils/files';

const CreateDropyTakePicture = ({ navigation }) => {

  const cameraRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraType, setCameraType] = useState(CameraType.back);

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  const reverseCamera = () => {
    setCameraType(cameraType === CameraType.back ? CameraType.front : CameraType.back);
  };

  const takePicture = async () => {
    const picture = await cameraRef.current.takePictureAsync();

    if(picture?.uri == null) {
      return;
    }

    const params = {
      dropyFilePath: await compressImage(picture?.uri),
      dropyData: null,
      mediaType: MEDIA_TYPES.PICTURE,
      originRoute: 'CreateDropyTakePicture',
    };

    navigation.reset({
      index: 0,
      routes: [{ name: 'Home', params: { dropyCreateParams: params } }],
    });
  };

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView style={styles.container}>
        <GoBackHeader onPressGoBack={ () => navigation.navigate('Home')} color={Colors.darkGrey} />
        <View style={{ ...StyleSheet.absoluteFillObject, ...Styles.center }}>
          <Text style={{ ...Fonts.regular(18, Colors.darkGrey) }}>Oups...</Text>
          <Text style={{ ...Fonts.regular(16, Colors.darkGrey), marginTop: 10 }}>Camera not authorized</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'light-content'}></StatusBar>
      <GoBackHeader onPressGoBack={ () => navigation.navigate('Home')} color={Colors.white} text={'Tips: smile !'}/>
      <Camera ref={cameraRef} style={StyleSheet.absoluteFillObject} type={cameraType} onMountError={console.error}>
        <View style={styles.bottomContainer}>
          <View style={styles.recordBtnContainer}>
            <TouchableOpacity style={styles.recordBtn} onPress={takePicture} />
          </View>
          <TouchableOpacity onPress={reverseCamera} style={styles.invertCameraTypeBtn}>
            <MaterialCommunityIcons name="swap-horizontal-variant" size={24} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </Camera>
    </SafeAreaView>
  );
};

export default CreateDropyTakePicture;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: responsiveHeight(6),
    height: 80,
    width: '100%',
    ...Styles.center,
  },
  recordBtnContainer: {
    width: 80,
    height: 80,
    borderRadius: 80,
    borderWidth: 3,
    borderColor: Colors.white,
    padding: 4,
    ...Styles.center,
  },
  recordBtn: {
    borderRadius: 80,
    backgroundColor: 'white',
    width: '100%',
    height: '100%',
  },
  invertCameraTypeBtn: {
    ...Styles.center,
    position: 'absolute',
    right: '25%',
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: Colors.white,
  },
});
