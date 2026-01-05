import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import GradientBackground from '../../components/GradientBackground';
import { useAuthViewModel } from '../../viewmodels/useAuthViewModel';

type Props = NativeStackScreenProps<RootStackParamList, 'OTP'>;

export default function OTPVerificationScreen({ navigation, route }: Props) {
  const { verifyOtp } = useAuthViewModel();

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputs = useRef<TextInput[]>([]);

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const onVerify = async () => {
    const code = otp.join('');
    const res = await verifyOtp({
      code,
      phone: route.params?.phone,
    });

    if (res?.success) {
      navigation.replace('OnboardingInspiration');
    }
  };

  return (
    <GradientBackground>
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require('../../assets/images/back-arrow.png')}
            style={{ width: 16, height: 16, marginHorizontal: 16 }}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <View style={styles.appBarCenter}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.appBarLogo}
          />
          <Text style={styles.appBarTitle}>Skyborne Drop</Text>
        </View>

        {/* Spacer to balance back button */}
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.container}>
        <Text style={styles.title}>Enter OTP</Text>

        <View style={styles.otpRow}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={ref => {
                if (ref) inputs.current[index] = ref;
              }}
              style={styles.otpBox}
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              onChangeText={text => handleChange(text, index)}
            />
          ))}
        </View>

        <Text style={styles.infoText}>
          OTP Sent to XXXXXXX{route.params?.phone?.slice(-2) ?? '00'}
        </Text>

        <Text style={styles.resendText}>
          Didn’t receive it? <Text style={styles.resendLink}>Resend code</Text>
        </Text>

        <TouchableOpacity style={styles.continueButton} onPress={onVerify}>
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </GradientBackground>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    paddingTop: 70,
  },
  backIcon: {
    fontSize: 35,
    color: '#3A3A3A',
  },
  appBarCenter: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  appBarLogo: {
    width: 50,
    height: 55,
    resizeMode: 'contain',
    marginRight: 6,
  },
  appBarTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#3A3A3A',
  },

  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#494949',
    marginBottom: 30,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 54,
  },
  otpBox: {
    width: 48,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D7D7D7',
    backgroundColor: 'rgba(255,255,255,0)',
    textAlign: 'center',
    fontSize: 18,
    color: '#333',
  },
  infoText: {
    fontSize: 16,
    color: '#000000',
    marginBottom: 15,
    fontWeight: '500',
  },
  resendText: {
    fontSize: 14,
    color: '#6A7282',
    marginBottom: 40,
    fontWeight: '500',
  },
  resendLink: {
    color: '#B5647E',
    fontWeight: '500',
  },
  continueButton: {
    height: 54,
    borderRadius: 28,
    backgroundColor: '#B5647E',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 40,
  },
  continueText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
  },
});
