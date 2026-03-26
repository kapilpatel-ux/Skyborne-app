// export const SubscriptionImages = {
//   backwardIcon: require('./icon.png'),
//   videoIcon: require('./videoIcon.png'),  
//   playIcon: require('./playIcon.png'),
//   upgradeIcon: require('./upgradeplan.png'),
//   paymentIcon: require('./updatepayment.png'),
//   invoicesIcon: require('./invoices.png'),
//   rightIcon: require('./rightIcon.png'),
// };


const BASE_URL =
  'https://skyborne-images.s3.ap-south-1.amazonaws.com/subscriptions';
const SVG_BASE_URL =
  'https://skyborne-images.s3.ap-south-1.amazonaws.com/svgicons';

export const SubscriptionImages = {
  backwardIcon: { uri: `${BASE_URL}/icon.png` },
  videoIcon: { uri: `${BASE_URL}/videoIcon.png` },
  playIcon: { uri: `${BASE_URL}/playIcon.png` },
  upgradeIcon: { uri: `${BASE_URL}/upgradeplan.png` },
  upgradeIconSvg: `${SVG_BASE_URL}/Subscription.svg`,
  paymentIcon: { uri: `${BASE_URL}/updatepayment.png` },
  paymentHistoryIconSvg: `${SVG_BASE_URL}/Update+payment+method.svg`,
  invoicesIcon: { uri: `${BASE_URL}/invoices.png` },
  invoicesIconSvg: `${SVG_BASE_URL}/View+invoices.svg`,
  rightIcon: { uri: `${BASE_URL}/rightIcon.png` },
};
