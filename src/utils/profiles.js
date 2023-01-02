import API from '../services/API';

export const PRONOUNS = {
  UNKNOWN: 'je préfère ne pas le dire',
  HE_HIM: 'il',
  SHE_HER: 'elle',
  OTHER: 'autre',
};

export const reportUser = async (userId, sendAlert, dropyId = undefined) => {
  try {
    const response = await API.reportUser(userId, dropyId);
    console.log('Report API response : ', response.data);
    sendAlert({
      title: 'Utilisateur signalé !',
      description: 'Ton signalement a bien été pris en compte.',
    });
  } catch (error) {
    if (error.response.status === 401) {
      sendAlert({
        title: 'Mollo l\'asticot !',
        description: 'Tu ne peux pas signaler plus d\'une fois par heure',
      });
      return;
    }
    sendAlert({
      title: 'Pas de bol...',
      description: 'Ton signalement n\'a pas pu être pris en compte...\nVérifie ta connexion internet',
    });
    console.error('Error while reporting user', error?.response?.data || error);
  }
};

export const blockUser = async (userId, sendAlert, navigation) => {
  try {
    const response = await API.blockUser(userId);
    console.log('Block API response : ', response.data);
    navigation?.popToTop();
  } catch (error) {
    sendAlert({
      title: 'Pas de bol...',
      description: 'Ton signalement n\'a pas pu être pris en compte...\nVérifie ta connexion internet',
    });
    console.error('Error while reporting user', error?.response?.data || error);
  }
};
