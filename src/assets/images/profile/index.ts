// export const ProfileImages = {
//   ArrowIcon1: require('./icon.png'),
//   ArrowIcon2: require('./Icon2.png'),
//   SettingsIcon: require('./settingsIcon.png'),
//   ProfileImg: require('./profileImage.png'),
//   pencilIcon: require('./PencilIcon.png'),
//   sandWAtch: require('./SandWatch.png'),
//   subscriptionIcon: require('./SubscriptionIcon.png'),
//   historyIcon: require('./HistoryIcon.png'),
//   timezonIcon: require('./TimezoneIcon.png'),
//   supportIcon: require('./Support.png'),
// };

const BASE_URL = 'https://skyborne-images.s3.ap-south-1.amazonaws.com/profile';
const COMMON_URL = 'https://skyborne-images.s3.ap-south-1.amazonaws.com';

export const ProfileImages = {
  ArrowIcon1: { uri: `${BASE_URL}/icon.png` },
  ArrowIcon2: { uri: `${BASE_URL}/Icon2.png` },
  SettingsIcon: { uri: `${BASE_URL}/settingsIcon.png` },
  ProfileImg: { uri: `${BASE_URL}/profileImage.png` },
  pencilIcon: { uri: `${BASE_URL}/PencilIcon.png` },
  sandWAtch: { uri: `${BASE_URL}/SandWatch.png` }, // ⚠️ ensure file exists in S3
  subscriptionIcon: { uri: `${BASE_URL}/SubscriptionIcon.png` },
  historyIcon: { uri: `${BASE_URL}/HistoryIcon.png` },
  timezonIcon: { uri: `${BASE_URL}/TimezoneIcon.png` },
  supportIcon: { uri: `${BASE_URL}/Support.png` },
};

export const AllItems = {
  badge: { uri: `${COMMON_URL}/badge.png` },
  laptop: { uri: `${COMMON_URL}/laptop.png` },
  sand: { uri: `${COMMON_URL}/sand.png` },
  fire: { uri: `${COMMON_URL}/fire.png` },
};
