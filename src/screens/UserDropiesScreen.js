import { Feather } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';

import FadeInWrapper from '../components/effect/FadeInWrapper';
import LoadingSpinner from '../components/effect/LoadingSpinner';
import DropyMediaViewer from '../components/other/DropyMediaViewer';
import GoBackHeader from '../components/other/GoBackHeader';

import useOverlay from '../hooks/useOverlay';
import API from '../services/API';
import Styles, { Colors, Fonts } from '../styles/Styles';
import { chunckHeaderTimeString } from '../utils/time';

const UserDropiesScreen = ({ navigation }) => {
  const { sendAlert } = useOverlay();

  const [loading, setLoading] = useState(true);
  const [dropies, setDropies] = useState([]);

  useEffect(() => {
    const loadDropies = async () => {
      try {
        setLoading(true);
        const response = await API.getUserDropies();
        setDropies(response.data);
        setLoading(false);
      } catch (error) {
        sendAlert({
          title: 'Patatra !',
          description: 'Impossible de récupérer tes drops.\nVérifie ta connexion internet',
        });
        console.error('Error while fetching user dropies', error?.response?.data || error);
        navigation.goBack();
      }
    };

    loadDropies();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deleteDropy = async (dropyId) => {
    const confirmed = await sendAlert({
      title: 'Attention !',
      description: 'Plus personne ne pourra voir ton drop',
      denyText: 'Annuler',
      validateText: 'Supprimer',
    });

    if (!confirmed)
      return;


    try {
      const response = await API.deleteUserDropy(dropyId);
      console.log('Delete API response', response.data);
      setDropies((old) => old.filter((dropy) => dropy.id !== dropyId));
    } catch (error) {
      sendAlert({
        title: 'Pas de bol !',
        description: 'Ton drop n\'a pas pu être supprimé.\nVérifie ta connexion internet',
      });
      console.error('Error while fetching user dropies', error?.response?.data || error);
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'dark-content'} />
      <GoBackHeader text='Mes drops' />
      {loading ? (
        <View style={{ height: responsiveHeight(80), ...Styles.center }}>
          <LoadingSpinner />
        </View>
      ) : (
        <FlatList
          data={dropies}
          indicatorStyle='black'
          showsVerticalScrollIndicator
          contentContainerStyle={styles.scrollViewContent}
          ListEmptyComponent={() => (
            <View style={{ height: responsiveHeight(80), ...Styles.center }}>
              <Text style={{ ...Fonts.regular(13, Colors.darkGrey), textAlign: 'center' }}>{'C\'est plutôt vide par ici !\nTu n\'as pas encore trouvé de drop...'}</Text>
            </View>
          )}
          renderItem={({ item: dropy, index }) => (
            <FadeInWrapper key={dropy.id} delay={index * 50}>
              <TouchableOpacity
                style={styles.dropyContainer}
                onPress={() => navigation.navigate('DisplayDropyMedia', { dropy, showBottomModal: false })}
              >
                <DropyMediaViewer dropy={dropy} />
                <LinearGradient
                  colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 1)']}
                  start={{ x: 0.5, y: 0.6 }}
                  end={{ x: 0.5, y: 1.1 }}
                  style={StyleSheet.absoluteFillObject}
                />
                <View style={styles.infoContainer}>
                  <View>
                    <Text style={{ ...Fonts.bold(12, Colors.white) }}>Posé {chunckHeaderTimeString(dropy.creationDate).toLowerCase()}</Text>
                    <Text style={{ ...Fonts.regular(10, Colors.white), marginTop: 2 }}>
                      {dropy?.retriever?.id == null ? 'Pas encore trouvé' : `Trouvé par @${dropy?.retriever?.username}`}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => deleteDropy(dropy.id)}>
                    <Feather name='trash-2' size={24} color={Colors.red} />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </FadeInWrapper>
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default UserDropiesScreen;

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
    paddingBottom: 10,
  },
  dropyContainer: {
    marginTop: 20,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: Colors.lighterGrey,
    width: responsiveWidth(90),
    height: responsiveWidth(90),
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  infoContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 30,
  },
});
