import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ImageSourcePropType,
  Alert,
  Platform,
} from 'react-native';
import { ThemedText } from '../../components/ThemedText';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import GradientBackground from '../../components/GradientBackground';
import { FontFamilies } from '../../constants/fonts';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import Toast from 'react-native-toast-message';
import { useSignup } from '../../store/SignupContext';
import { IconImages, UserIcon } from '../../assets/icons';
import { normalizeErrorMessage } from '../../utils/errorUtils';

type Props = NativeStackScreenProps<RootStackParamList, 'AuthOptions'>;
type AuthProviderProps = 'email' | 'google' | 'apple';

type AuthButtonProps = {
  icon: string | ImageSourcePropType;
  text: string;
  onPress?: () => void;
};

const AuthButton = ({ icon, text, onPress }: AuthButtonProps) => (
  <TouchableOpacity style={styles.authButton} onPress={onPress}>
    {typeof icon === 'string' ? (
      <ThemedText style={styles.authButtonIcon}>{icon}</ThemedText>
    ) : (
      <Image source={icon} style={styles.authButtonImage} />
    )}
    <ThemedText style={styles.authButtonText}>
      {text}
    </ThemedText>
  </TouchableOpacity>
);

export default function AuthOptionsScreen({ navigation }: Props) {
  const { updateStepData } = useSignup();

  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  const configureGoogleSignIn = () => {
    try {
      const webClientId = process.env.GOOGLE_KEY || '';

      GoogleSignin.configure({
        // IMPORTANT: This must be your WEB client ID from Google Cloud Console
        // NOT the Android or iOS client ID
        webClientId: webClientId,

        // Optional: Only needed if you want offline access
        offlineAccess: false,

        // Optional: iOS client ID (only if you have one)
        // iosClientId: 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com',
      });
    } catch (error) {
      console.error('Configuration error:', error);
    }
  };

  const handleGuestSignIn = () => {
    navigation.navigate('GuestHome');
  };

  const handleGoogleSignIn = async () => {
    try {
        try {
        await GoogleSignin.signOut();
      } catch (error:any) {
        // Silently fail if not signed in
        console.log('Not previously signed in');
      }

      // Check if device supports Google Play Services (Android only)
      if (Platform.OS === 'android') {
        await GoogleSignin.hasPlayServices({
          showPlayServicesUpdateDialog: true,
        });
      }

      // Sign in
      const userInfo: any = await GoogleSignin.signIn();

      // Extract user data
      const googleData = {
        firstName: userInfo?.data?.user.givenName || '',
        lastName: userInfo?.data?.user.familyName || '',
        email: userInfo?.data?.user.email,
        authProvider: 'google' as AuthProviderProps,
        googleId: userInfo?.data?.user.id,
      };

      updateStepData('step2', googleData);

     navigation.navigate('OnboardingInspiration');

      // You can navigate to next screen or handle the data as needed
      // navigation.navigate('NextScreen', { userData: googleData });

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: `Signed in as ${googleData.email}`,
      });
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Toast.show({
          type: 'info',
          text1: 'Cancelled',
          text2: 'Sign-in was cancelled',
        });
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Toast.show({
          type: 'info',
          text1: 'In Progress',
          text2: 'Sign-in is already in progress',
        });
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Google Play Services not available or outdated',
        });
      } else if (error.code === '12501') {
        // Common error code for configuration issues
        Toast.show({
          type: 'error',
          text1: 'Configuration Error',
          text2: 'Please check Web Client ID and SHA-1 fingerprint',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Sign-in Failed',
          text2: normalizeErrorMessage(error?.message, 'Unknown error occurred'),
        });
      }
    }
  };

  const handleAppleSignIn = async () => {
    // TODO: Implement Apple Sign-In
    Alert.alert('Info', 'Apple Sign-In coming soon');
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logo}
          />
          <ThemedText style={styles.appName}>
            Skyborne Drop
          </ThemedText>
        </View>

        <View style={styles.content}>
          <ThemedText style={styles.title}>
            Let's Get Started
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Let's dive into your account
          </ThemedText>

          <View style={styles.authButtonsContainer}>
            {/* <AuthButton
              icon={IconImages?.apple}
              text="Continue with Apple"
              onPress={handleAppleSignIn}
            /> */}
            <AuthButton
              icon={UserIcon}
              text="Continue as Guest"
              onPress={handleGuestSignIn}
            />
            <AuthButton
              icon={IconImages?.google}
              text="Continue with Google"
              onPress={handleGoogleSignIn}
            />
          </View>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate('Login')}
          >
            <ThemedText style={styles.loginButtonText}>
              Login
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signupButton}
            onPress={() => navigation.navigate('Signup')}
          >
            <ThemedText style={styles.signupText}>
              Signup
            </ThemedText>
          </TouchableOpacity>
        </View>

        <ThemedText style={styles.legalText}>
          By continuing, you agree to Skyborne drop Terms of Service and Privacy
          Policy
        </ThemedText>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 63,
    marginBottom: 50,
  },
  logo: {
    width: 55,
    height: 63,
    lineHeight: 19,
    resizeMode: 'contain',
    marginRight: 8,
  },
  appName: {
    fontFamily: FontFamilies.SatoshiMedium,
    fontSize: 15,
    color: '#494949',
  },
  content: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontFamily: FontFamilies.SatoshiBold,
    fontSize: 30,
    color: '#494949',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: FontFamilies.SatoshiRegular,
    fontSize: 14,
    color: '#494949',
    marginBottom: 52,
  },
  authButtonsContainer: {
    width: '85%',
    marginBottom: 5,
  },
  authButton: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 54,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: '#D7D7D7',
    marginBottom: 20,
    paddingHorizontal: 70,
  },
  authButtonIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  authButtonImage: {
    width: 20,
    height: 20,
    marginRight: 12,
    resizeMode: 'contain',
  },
  authButtonText: {
    fontFamily: FontFamilies.SatoshiMedium,
    fontSize: 16,
    color: '#494949',
  },
  loginButton: {
    width: '85%',
    height: 54,
    backgroundColor: '#b95d82',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 11,
  },
  loginButtonText: {
    fontFamily: FontFamilies.SatoshiMedium,
    color: '#FFFFFF',
    fontSize: 16,
  },
  signupButton: {
    width: '85%',
    height: 54,
    backgroundColor: '#FFE8E8',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  signupText: {
    fontFamily: FontFamilies.SatoshiMedium,
    color: '#494949',
    fontSize: 16,
  },
  legalText: {
    position: 'absolute',
    bottom: 49,
    fontSize: 13,
    fontFamily: FontFamilies.SatoshiRegular,
    color: '#A3A4A6',
    textAlign: 'center',
    width: '80%',
  },
});
