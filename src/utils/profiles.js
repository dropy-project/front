import API from '../services/API';

export const PRONOUNS = {
  UNKOWN: 'I prefer not to tell',
  HE_HIM: 'He/Him',
  SHE_HER: 'She/Her',
};

export const reportUser = async (userId, sendAlert) => {
  try {
    const response = await API.reportUser(userId);
    console.log('Report API response : ', response.data);
    sendAlert({
      title: 'User reported',
      description: 'Your report has been shipped !',
    });
  } catch (error) {
    if(error.response.status === 400) {
      sendAlert({
        title: 'Take it easy !',
        description: 'You can only report a user once per hour.',
      });
      return;
    }
    sendAlert({
      title: 'Oh no...',
      description: 'We couldn\'t send your report...\nCheck your internet connection!',
    });
    console.error('Error while reporting user', error?.response?.data || error);
  }
};

export const blockUser = async (userId, sendAlert) => {
  try {
    const response = await API.blockUser(userId);
    console.log('Block API response : ', response.data);
  } catch (error) {
    sendAlert({
      title: 'Oh no...',
      description: 'We couldn\'t block this user...\nCheck your internet connection!',
    });
    console.error('Error while reporting user', error?.response?.data || error);
  }
};
