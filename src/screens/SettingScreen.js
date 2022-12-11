import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import { AntDesign, Feather, Ionicons } from '@expo/vector-icons';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import AppInfo from '../../app.json';
import Styles, { Colors, Fonts } from '../styles/Styles';
import { BackgroundGeolocationContext } from '../states/BackgroundGolocationContextProvider';
import useCurrentUser from '../hooks/useCurrentUser';
import useOverlay from '../hooks/useOverlay';
import API from '../services/API';

import FormToggle from '../components/input/FormToggle';
import DebugText from '../components/other/DebugText';
import GoBackHeader from '../components/other/GoBackHeader';
import DebugUrlsMenu from '../components/other/DebugUrlsMenu';

import { handleOpenURL } from '../utils/links';

const SettingsScreen = ({ navigation }) => {
  const { setDeveloperMode, user, developerMode, customUrls } = useCurrentUser();

  const { backgroundGeolocationEnabled, setBackgroundGeolocationEnabled } = useContext(BackgroundGeolocationContext);

  const { sendAlert } = useOverlay();

  const [notificationsSettings, setNotificationsSettings] = useState(null);
  const notificatinsSettingsRef = useRef(null);

  useEffect(() => {
    fetchNotificationsSettings();
    const unsubscribe = navigation.addListener('blur', () => {
      if (notificatinsSettingsRef.current != null)
        postNotificationsSettings(notificatinsSettingsRef.current);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (notificationsSettings != null)
      notificatinsSettingsRef.current = notificationsSettings;
  }, [notificationsSettings]);

  const fetchNotificationsSettings = async () => {
    try {
      const response = await API.getNotificationsSettings(user);
      setNotificationsSettings(response.data);
    } catch (error) {
      sendAlert({
        title: 'Notifications settings unrecheable',
        description: 'We were unable to retrieve your notification settings',
        validateText: 'Ok',
      });
      console.error(
        'Error while fetch notifications settings',
        error.response?.data || error
      );
      navigation.goBack();
    }
  };

  const postNotificationsSettings = async (settings) => {
    console.log('postNotificationsSettings', settings);
    try {
      await API.postNotificationsSettings(settings);
    } catch (error) {
      sendAlert({
        title: 'Notifications settings not updated',
        description: 'We were unable to update your notification settings',
        validateText: 'Ok',
      });
      console.error(
        'Error while update notifications settings',
        error.response?.data || error
      );
    }
  };

  const logout = async () => {
    await postNotificationsSettings(notificatinsSettingsRef.current);
    notificatinsSettingsRef.current = null;
    await API.logout();
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'Splash',
          params: { cancelAutoLogin: true },
        }
      ],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <GoBackHeader text='Settings' />

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.titleText}>Background location</Text>
        <View style={styles.linkContainer}>
          <View style={{ flex: 0.9 }}>
            <Text style={{ ...Fonts.regular(11, Colors.grey) }}>
              Get alerted when you walk onto a drop with the app closed.
            </Text>
            <Text style={{ ...Fonts.bold(12, Colors.purple2), marginTop: 2 }}>
              Highly recommended
            </Text>
          </View>
          <Switch
            value={backgroundGeolocationEnabled}
            onValueChange={setBackgroundGeolocationEnabled}
            thumbColor={Colors.white}
            trackColor={{
              false: Colors.darkGrey,
              true: Colors.mainBlue,
            }}
            ios_backgroundColor={Colors.darkGrey}
          />
        </View>

        <Text style={styles.titleText}>Notifications</Text>
        <FormToggle
          value={notificationsSettings?.dailyDropyReminder}
          title='Remind me to drop something daily'
          onValueChange={(value) => setNotificationsSettings((old) => ({
            ...old,
            dailyDropyReminder: value,
          }))
          }
        />
        <FormToggle
          value={notificationsSettings?.dropyCollected}
          title='When one of my drop is collected'
          onValueChange={(value) => setNotificationsSettings((old) => ({ ...old, dropyCollected: value }))
          }
        />
        <FormToggle
          value={notificationsSettings?.newFeature}
          title='When a new feature is available'
          onValueChange={(value) => setNotificationsSettings((old) => ({ ...old, newFeature: value }))
          }
        />

        {/* <Text style={styles.titleText}>Others</Text>
        <FormToggle disabled title='Vibrations' />
        <FormToggle disabled title='Show my connection status' /> */}

        <View style={styles.spacer} />

        <TouchableOpacity
          style={{ ...styles.navigateContainer, marginTop: 10 }}
          onPress={() => navigation.navigate('UserDropies')}>
          <Text style={{ ...Fonts.bold(12, Colors.darkGrey) }}>My drops</Text>
          <View style={styles.navigateArrow}>
            <AntDesign name='arrowright' size={24} color={Colors.white} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navigateContainer}
          onPress={() => navigation.navigate('BlockedUsers')}>
          <Text style={{ ...Fonts.bold(12, Colors.darkGrey) }}>
            Blocked users
          </Text>
          <View style={styles.navigateArrow}>
            <AntDesign name='arrowright' size={24} color={Colors.white} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navigateContainer}
          onPress={() => navigation.navigate('Account')}>
          <Text style={{ ...Fonts.bold(12, Colors.darkGrey) }}>My account</Text>
          <View style={styles.navigateArrow}>
            <AntDesign name='arrowright' size={24} color={Colors.white} />
          </View>
        </TouchableOpacity>

        <View style={styles.spacer} />

        <TouchableOpacity
          style={styles.linkContainer}
          onPress={() => handleOpenURL('https://dropy-app.com/help')}>
          <Text style={{ ...Fonts.bold(12, Colors.darkGrey) }}>Help</Text>
          <AntDesign name='arrowright' size={24} color={Colors.darkGrey} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.linkContainer}
          onPress={() => handleOpenURL('https://dropy-app.com/about')}>
          <Text style={{ ...Fonts.bold(12, Colors.darkGrey) }}>About</Text>
          <AntDesign name='arrowright' size={24} color={Colors.darkGrey} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.linkContainer}
          onPress={() => handleOpenURL('https://dropy-app.com/privacy-policy.html')
          }>
          <Text style={{ ...Fonts.bold(12, Colors.darkGrey) }}>
            Privacy Policy
          </Text>
          <AntDesign name='arrowright' size={24} color={Colors.darkGrey} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.linkContainer}
          onPress={() => handleOpenURL('https://dropy-app.com/terms-conditions.html')
          }>
          <Text style={{ ...Fonts.bold(12, Colors.darkGrey) }}>
            Terms & Conditions
          </Text>
          <AntDesign name='arrowright' size={24} color={Colors.darkGrey} />
        </TouchableOpacity>

        <View style={styles.spacer} />

        <TouchableOpacity
          style={{ ...styles.linkContainer, ...Styles.center }}
          onPress={logout}>
          <Text style={{ ...Fonts.bold(12, Colors.red) }}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.spacer} />

        <TouchableOpacity
          onLongPress={() => (user.isDeveloper || __DEV__) && setDeveloperMode((old) => !old)
          }
          activeOpacity={1}>
          <View style={styles.infoTextContainer}>
            <Ionicons name='git-branch' size={19} color={Colors.darkGrey} />
            <Text style={styles.infoText}>{AppInfo.version}</Text>
          </View>
          <View style={styles.infoTextContainer}>
            <Feather name='flag' size={17} color={Colors.darkGrey} />
            <Text style={styles.infoText}>{AppInfo.versionFlag}</Text>
          </View>
          <View style={styles.infoTextContainer}>
            <Feather name='server' size={17} color={Colors.darkGrey} />
            <Text style={styles.infoText}>
              {AppInfo.productionMode ? 'prod' : 'preprod'}
            </Text>
          </View>
        </TouchableOpacity>

        <DebugText marginBottom={20}>DEV MODE</DebugText>
        {(developerMode || customUrls) && (
          <>
            <DebugUrlsMenu />
            <KeyboardSpacer />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.white,
    ...Styles.safeAreaView,
  },
  scrollViewContent: {
    width: responsiveWidth(100),
    alignItems: 'center',
    paddingBottom: 25,
  },
  titleText: {
    ...Fonts.bold(13, Colors.darkGrey),
    width: '80%',
    marginBottom: 10,
    marginTop: 30,
  },
  spacer: {
    width: '90%',
    height: 2,
    borderRadius: 1,
    backgroundColor: Colors.lighterGrey,
    marginVertical: 30,
  },
  linkContainer: {
    flexDirection: 'row',
    width: '90%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  navigateContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.lighterGrey,
    width: '90%',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    ...Styles.softShadows,
    shadowOpacity: 0.2,
    height: 50,
    marginBottom: 10,
  },
  navigateArrow: {
    ...Styles.center,
    backgroundColor: Colors.darkGrey,
    height: '95%',
    width: 50,
    borderRadius: 12,
  },
  infoTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoText: {
    ...Fonts.bold(12, Colors.darkGrey),
    marginLeft: 10,
  },
});
