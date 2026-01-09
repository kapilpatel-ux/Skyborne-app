import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/splash/SplashScreen';
import AuthOptionsScreen from '../screens/auth/AuthOptionsScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import OTPVerificationScreen from '../screens/auth/OTPVerificationScreen';
import OnboardingInspirationScreen from '../screens/onboarding/OnboardingInspirationScreen';
import OnboardingGoalScreen from '../screens/onboarding/OnboardingGoalScreen';
import OnboardingTimeCommitmentScreen from '../screens/onboarding/OnboardingTimeCommitmentScreen';
import OnboardingFitnessLevelScreen from '../screens/onboarding/OnboardingFitnessLevelScreen';
import OnboardingHabitsScreen from '../screens/onboarding/OnboardingHabitsScreen';
import OnboardingLocationScreen from '../screens/onboarding/OnboardingLocationScreen';
import OnboardingMotivationScreen from '../screens/onboarding/OnboardingMotivationScreen';
import WelcomeScreen from '../screens/onboarding/WelcomeScreen';
import HomeScreen from '../screens/home/HomeScreen';
import PricingScreen from '../screens/onboarding/PricingScreen';
import GetStartedScreen from '../screens/onboarding/GetStartedScreen';
import ExploreScreen from '../screens/home/ExploreScreen';
import ScheduleScreen from '../screens/home/ScheduleScreen';
import ProfileScreen from '../screens/home/ProfileScreen';

export type RootStackParamList = {
  Splash: undefined;
  AuthOptions: undefined;
  Signup: undefined;
  OTP: { phone?: string } | undefined;
  OnboardingInspiration: undefined;
  OnboardingGoal: undefined;
  OnboardingTimeCommitment: undefined;
  OnboardingFitnessLevel: undefined;
  OnboardingHabits: undefined;
  OnboardingLocation: undefined;
  OnboardingMotivation: undefined;
  WelcomeScreen: undefined;
  Pricing: undefined;
  GetStarted: undefined;
  Home: undefined;
  Explore: undefined;     
  Schedule: undefined;  
  Profile: undefined;
};
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="AuthOptions" component={AuthOptionsScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="OTP" component={OTPVerificationScreen} />
      <Stack.Screen name="OnboardingInspiration" component={OnboardingInspirationScreen} />
      <Stack.Screen name="OnboardingGoal" component={OnboardingGoalScreen} />
      <Stack.Screen name="OnboardingTimeCommitment" component={OnboardingTimeCommitmentScreen} />
      <Stack.Screen name="OnboardingFitnessLevel" component={OnboardingFitnessLevelScreen} />
      <Stack.Screen name="OnboardingHabits" component={OnboardingHabitsScreen} />
      <Stack.Screen name="OnboardingLocation" component={OnboardingLocationScreen} />
      <Stack.Screen name="OnboardingMotivation" component={OnboardingMotivationScreen} />
      <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
      <Stack.Screen name="Pricing" component={PricingScreen} />
      <Stack.Screen name="GetStarted" component={GetStartedScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Explore" component={ExploreScreen} />
      <Stack.Screen name="Schedule" component={ScheduleScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}
