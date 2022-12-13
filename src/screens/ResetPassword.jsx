import React from 'react';
import { Text, View, SafeAreaView, StyleSheet } from 'react-native';
import GoBackHeader from '../components/other/GoBackHeader';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import Styles, { Colors, Fonts } from '../styles/Styles';

const ResetPassword = () => (
  <SafeAreaView style={styles.container}>
    <GoBackHeader text='Reset Password' />
    <View style={styles.content}>
    </View>
  </SafeAreaView>
);

export default ResetPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.white,
    ...Styles.safeAreaView,
  },
  content: {
    width: responsiveWidth(100),
    alignItems: 'center',
    marginTop: 20,
    height: '80%',
  },
});
