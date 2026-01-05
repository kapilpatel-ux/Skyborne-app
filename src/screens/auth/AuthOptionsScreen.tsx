import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ImageSourcePropType,
} from 'react-native';
import { ThemedText } from '../../components/ThemedText';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import GradientBackground from '../../components/GradientBackground';
import { FontFamilies } from '../../constants/fonts';

type Props = NativeStackScreenProps<RootStackParamList, 'AuthOptions'>;

type AuthButtonProps = {
  icon: string | ImageSourcePropType;
  text: string;
};

const AuthButton = ({ icon, text }: AuthButtonProps) => (
  <TouchableOpacity style={styles.authButton}>
    {typeof icon === 'string' ? (
      <ThemedText style={styles.authButtonIcon}>{icon}</ThemedText>
    ) : (
      <Image source={icon} style={styles.authButtonImage} />
    )}
    <ThemedText weight="medium" style={styles.authButtonText}>
      {text}
    </ThemedText>
  </TouchableOpacity>
);

export default function AuthOptionsScreen({ navigation }: Props) {
  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logo}
          />
          <ThemedText weight="medium" style={styles.appName}>
            Skyborne Drop
          </ThemedText>
        </View>

        <View style={styles.content}>
          <ThemedText weight="bold" style={styles.title}>
            Let’s Get Started
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Let’s dive into your account
          </ThemedText>

          <View style={styles.authButtonsContainer}>
            <AuthButton
              icon={require('../../assets/icons/apple.png')}
              text="Continue with Apple"
            />
            <AuthButton
              icon={require('../../assets/icons/google.png')}
              text="Continue with Google"
            />
            <AuthButton
              icon={require('../../assets/icons/facebook.png')}
              text="Continue with Facebook"
            />
          </View>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate('WelcomeScreen')}
          >
            <ThemedText weight="medium" style={styles.loginButtonText}>
              Login
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signupButton}
            onPress={() => navigation.navigate('Signup')}
          >
            <ThemedText weight="medium" style={styles.signupText}>
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
    flexDirection: 'row', // 👈 puts logo + text in one row
    alignItems: 'center', // vertical alignment
    justifyContent: 'center', // center horizontally
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
    fontWeight: '500',
    color: '#494949',
  },
  content: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontFamily: FontFamilies.SatoshiBold,
    fontSize: 30,
    fontWeight: 'bold',
    color: '#494949',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: FontFamilies.SatoshiRegular,
    fontSize: 14,
    fontWeight: '400',
    color: '#494949',
    marginBottom: 52,
  },
  authButtonsContainer: {
    width: '85%',
    marginBottom: 57,
  },
  authButton: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 54,
    // backgroundColor: '#F7F7F7',
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
    width: 20, // Example width
    height: 20, // Example height
    marginRight: 12,
    resizeMode: 'contain',
  },
  authButtonText: {
    fontFamily: FontFamilies.SatoshiMedium,
    fontSize: 16,
    fontWeight: '500',
    color: '#494949',
  },
  loginButton: {
    width: '85%',
    height: 54,
    backgroundColor: '#b95d82',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    // elevation: 5,
    marginBottom: 11,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },

  signupButton: {
    width: '85%',
    height: 54,
    backgroundColor: '#FFE8E8',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    // elevation: 5,
    marginBottom: 20,
  },
  signupText: {
    color: '#494949',
    fontSize: 16,
    fontWeight: '500',
  },
  legalText: {
    position: 'absolute',
    bottom: 49,
    fontSize: 13,
    color: '#A3A4A6',
    textAlign: 'center',
    width: '80%',
    fontWeight: '400',
  },
});
