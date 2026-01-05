import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import GradientBackground from '../../components/GradientBackground';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export default function SplashScreen({ navigation }: Props) {
  useEffect(() => {
    const t = setTimeout(() => {
      // Decide where to go based on persisted state
      // try {
      //   // Dynamic import to avoid requiring store in tests too early
      //   const { store } = require('../../store');
      //   const state = store.getState();
      //   const loggedIn = state.auth?.loggedIn;
      //   const onboardingCompleted = state.auth?.onboardingCompleted;

      //   if (loggedIn) {
      //     if (onboardingCompleted) navigation.replace('Home');
      //     else navigation.replace('OnboardingInspiration');
      //   } else {
      //     navigation.replace('WelcomeScreen');
      //   }
      // } catch (e) {
      //   navigation.replace('AuthOptions');
      // }
      navigation.replace('WelcomeScreen');
    }, 1400);
    return () => clearTimeout(t);
  }, [navigation]);

  return (
    <GradientBackground>
      <View style={styles.container}>
        <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
        <Text style={styles.title}>Skyborne Drop</Text>
        {/* <Text style={styles.subtitle}>Skyborne Drop</Text> */}
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: { justifyContent: 'center', alignItems: 'center', flex: 1 },
  logo: { width: 70, height: 75, borderRadius: 24, marginBottom: 20 },
  title: { fontSize: 18, fontWeight: '400', color: '#666' },
  subtitle: { marginTop: 8, color: '#666' },
});
