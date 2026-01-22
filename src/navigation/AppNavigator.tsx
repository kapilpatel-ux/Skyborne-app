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
import { SignupProvider } from '../store/SignupContext';
import ManageSubscriptionScreen from '../screens/home/ManageSubscription';
import SessionHistoryScreen from '../screens/home/SessionHistory';
import SupportScreen from '../screens/home/Support';
import FeedbackScreen from '../screens/home/Feedback';
import PaymentVerification from '../screens/onboarding/PaymentVerificationScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import EditProfileScreen from '../screens/home/EditProfileScreen';
import ClassDetailsScreen from '../screens/home/ClassDetailScreen';
import ViewAll from '../screens/home/ViewAll';
import UpgradePlanScreen from '../screens/home/UpgradePlan';
import GuestScreen from '../screens/home/GuestScreen';
import PaymentHistory from '../screens/home/PaymentHistory';
import YogaDetailsScreen from '../screens/home/YogaDetail';
import ZumbaDetailsScreen from '../screens/home/ZumbaDetail';
import FitnessDetailsScreen from '../screens/home/FitnessDetail';

export type RootStackParamList = {
  Splash: undefined;
  AuthOptions: undefined;
  Signup: undefined;
  OTP: { phone?: string; email?: string } | undefined;
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
  ViewAll: undefined;
  UpgradePlan: undefined;
  Profile: undefined;
  GuestHome: undefined;
  YogaDetails: undefined;
  FitnessDetails: undefined;
  ZumbaDetails: undefined;
  PaymentHistory: undefined;
  ManageSubscription: undefined;
  SessionHistory: undefined;
  Support: undefined;
  ClassDetails: {
    classId: string;
  };
  Feedback: undefined;
  PaymentVerification: undefined;
  Login: undefined;
  EditProfile: undefined;
};
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <SignupProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="AuthOptions" component={AuthOptionsScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="OTP" component={OTPVerificationScreen} />
        <Stack.Screen
          name="OnboardingInspiration"
          component={OnboardingInspirationScreen}
        />
        <Stack.Screen name="OnboardingGoal" component={OnboardingGoalScreen} />
        <Stack.Screen
          name="OnboardingTimeCommitment"
          component={OnboardingTimeCommitmentScreen}
        />
        <Stack.Screen
          name="OnboardingFitnessLevel"
          component={OnboardingFitnessLevelScreen}
        />
        <Stack.Screen
          name="OnboardingHabits"
          component={OnboardingHabitsScreen}
        />
        <Stack.Screen
          name="OnboardingLocation"
          component={OnboardingLocationScreen}
        />
        <Stack.Screen
          name="OnboardingMotivation"
          component={OnboardingMotivationScreen}
        />
        <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
        <Stack.Screen name="Pricing" component={PricingScreen} />
        <Stack.Screen name="GetStarted" component={GetStartedScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Explore" component={ExploreScreen} />
        <Stack.Screen
          name="PaymentVerification"
          component={PaymentVerification}
        />
        <Stack.Screen name="Schedule" component={ScheduleScreen} />
        <Stack.Screen name="ViewAll" component={ViewAll} />

        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen
          name="ManageSubscription"
          component={ManageSubscriptionScreen}
        />
        <Stack.Screen name="ClassDetails" component={ClassDetailsScreen} />
        <Stack.Screen name="SessionHistory" component={SessionHistoryScreen} />
        <Stack.Screen name="UpgradePlan" component={UpgradePlanScreen} />
        <Stack.Screen name="GuestHome" component={GuestScreen} />
        <Stack.Screen name="PaymentHistory" component={PaymentHistory} />
        <Stack.Screen name="YogaDetails" component={YogaDetailsScreen} />
        <Stack.Screen name="FitnessDetails" component={FitnessDetailsScreen} />
        <Stack.Screen name="ZumbaDetails" component={ZumbaDetailsScreen} />

        <Stack.Screen name="Support" component={SupportScreen} />
        <Stack.Screen name="Feedback" component={FeedbackScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      </Stack.Navigator>
    </SignupProvider>
  );
}
