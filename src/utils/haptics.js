import * as ExpoHaptics from 'expo-haptics';


const impactLight = () => ExpoHaptics.impactAsync(ExpoHaptics.ImpactFeedbackStyle.Light);
const impactMedium = () => ExpoHaptics.impactAsync(ExpoHaptics.ImpactFeedbackStyle.Medium);
const impactHeavy = () => ExpoHaptics.impactAsync(ExpoHaptics.ImpactFeedbackStyle.Heavy);

const notificationSuccess = () => ExpoHaptics.notificationAsync(ExpoHaptics.NotificationFeedbackType.Success);
const notificationWarning = () => ExpoHaptics.notificationAsync(ExpoHaptics.NotificationFeedbackType.Warning);
const notificationError = () => ExpoHaptics.notificationAsync(ExpoHaptics.NotificationFeedbackType.Error);

const Haptics = {
  impactLight,
  impactMedium,
  impactHeavy,
  notificationSuccess,
  notificationWarning,
  notificationError,
};

export default Haptics;
