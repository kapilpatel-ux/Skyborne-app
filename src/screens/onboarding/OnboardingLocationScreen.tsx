import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import GradientBackground from '../../components/GradientBackground';
import Button from '../../components/Button';
import { getData } from 'country-list';
import * as ct from 'countries-and-timezones';
import { useAuthViewModel } from '../../viewmodels/useAuthViewModel';
import { useOnboardingStore } from '../../store/onboardingSlice';
import { RootState } from '../../store';
import Toast from 'react-native-toast-message';
import { useSignup } from '../../store/SignupContext';
import { IconImages } from '../../assets/icons';

type DropdownInputProps = {
  label: string;
  value: string | null;
  placeholder: string;
};

const DropdownInput = ({ label, value, placeholder }: DropdownInputProps) => (
  <View>
    <Text style={styles.fieldLabel}>{label}</Text>
    <TouchableOpacity style={styles.dropdownInput}>
      <Text style={value ? styles.dropdownText : styles.dropdownPlaceholder}>
        {value || placeholder}
      </Text>
      <Image
        source={IconImages?.downArrow}
        style={styles.dropdownIcon}
      />
    </TouchableOpacity>
  </View>
);

const OnboardingLocationScreen = ({ navigation }: { navigation: any }) => {
  const dispatch = useDispatch();
  const { signup } = useAuthViewModel();
  const authState = useSelector((state: RootState) => state.auth);

  // Zustand store for onboarding data
  const { inspiration, firstGoal, fitnessLevel, habits } = useOnboardingStore();

  // Get signup form data from Redux or context
  const tempUserId = authState.tempUserId;
  const phone = authState.phone;
  const { formData } = useSignup();
  const countries = getData();
  const [selectedCountry, setSelectedCountry] = useState<{
    name: string;
    code: string;
  } | null>(null);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [timezone, setTimezone] = useState<string | null>(null);
  const [showTimezoneDropdown, setShowTimezoneDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const timezones = selectedCountry
    ? ct.getTimezonesForCountry(selectedCountry.code)
    : [];

  const showToast = (
    message: string,
    type: 'success' | 'error' | 'info' = 'info',
  ) => {
    Toast.show({
      type,
      text1:
        type === 'success' ? 'Success' : type === 'error' ? 'Error' : 'Info',
      text2: message,
      position: 'top',
      visibilityTime: 3000,
    });
  };

  const handleCompleteProfile = async () => {
    // Validation
    if (!selectedCountry) {
      showToast('Please select a country', 'error');
      return;
    }
    if (!timezone) {
      showToast('Please select a timezone', 'error');
      return;
    }
    if (!tempUserId) {
      showToast('Invalid session. Please restart signup.', 'error');
      return;
    }

    setIsLoading(true);

    try {
      // Prepare the complete signup payload
      const signupPayload = {
        tempUserId,
        phoneNumber: phone,
        country: selectedCountry.name,
        countryCode: selectedCountry.code,
        timezone,
        firstName: formData?.step2?.firstName,
        lastName: formData?.step2?.lastName,
        email: formData?.step2?.email,
        password: formData?.step2?.password,
        authProvider: formData?.step2?.authProvider,
        // Onboarding data from Zustand store
        motivation: inspiration,
        goal: firstGoal,
        fitnessLevel: fitnessLevel ? Number(fitnessLevel) : null,
        habits: habits
          ? {
              waterIntake: habits.waterIntake
                ? Number(habits.waterIntake)
                : null,
              sleepQuality: habits.sleepQuality
                ? Number(habits.sleepQuality)
                : null,
              exerciseFrequency: habits.exerciseFrequency
                ? Number(habits.exerciseFrequency)
                : null,
            }
          : {
              waterIntake: null,
              sleepQuality: null,
              exerciseFrequency: null,
            },
      };

      console.log('Signup payload:', JSON.stringify(signupPayload, null, 2));

      // Call signup API
      const response = await signup(signupPayload);

      if (response?.success || response?.data) {
        // API was successful
        const { user, accessToken, refreshToken } = response?.data || response;

        // Store tokens and user data
        // This depends on your AsyncStorage setup
        // You can also dispatch Redux actions here if needed

        showToast('Profile completed successfully!', 'success');

        // Navigate to next screen or dashboard
        setTimeout(() => {
          navigation.navigate('Pricing'); // or your home screen
        }, 500);
      } else {
        showToast(response?.message || 'Failed to complete profile', 'error');
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      showToast(error?.message || 'An error occurred during signup', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={{
                uri: 'https://skyborne-images.s3.ap-south-1.amazonaws.com/back-arrow.png',
              }}
              style={{ width: 16, height: 16, marginHorizontal: 16 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Where are you located?</Text>
          </View>

          <View style={{ width: 24 }} />
        </View>
        <View style={styles.container}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.formSection}>
              <View style={{ position: 'relative' }}>
                <Text style={styles.fieldLabel}>Select Country</Text>

                <TouchableOpacity
                  style={styles.dropdownInput}
                  onPress={() => setShowCountryDropdown(!showCountryDropdown)}
                >
                  <Text
                    style={
                      selectedCountry
                        ? styles.dropdownText
                        : styles.dropdownPlaceholder
                    }
                  >
                    {selectedCountry
                      ? `${selectedCountry.name} (${selectedCountry.code})`
                      : 'Select an option'}
                  </Text>

                  <Image
                    source={IconImages?.downArrow}
                    style={styles.dropdownIcon}
                  />
                </TouchableOpacity>

                {showCountryDropdown && (
                  <View style={styles.countryDropdown}>
                    <ScrollView
                      showsVerticalScrollIndicator={false}
                      nestedScrollEnabled
                    >
                      {countries.map(item => (
                        <TouchableOpacity
                          key={item.code}
                          style={styles.countryItem}
                          onPress={() => {
                            setSelectedCountry(item);
                            setTimezone(null);
                            setShowCountryDropdown(false);
                          }}
                        >
                          <Text style={styles.dropdownText}>
                            {item.name} ({item.code})
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>

              <View style={{ height: 28 }} />

              <View style={{ marginTop: 20, position: 'relative' }}>
                <Text style={styles.fieldLabel}>Timezone</Text>

                <TouchableOpacity
                  style={[
                    styles.dropdownInput,
                    !selectedCountry && styles.dropdownInputDisabled,
                  ]}
                  onPress={() => setShowTimezoneDropdown(!showTimezoneDropdown)}
                  disabled={!selectedCountry}
                >
                  <Text
                    style={
                      timezone
                        ? styles.dropdownText
                        : styles.dropdownPlaceholder
                    }
                  >
                    {timezone || 'Select an option'}
                  </Text>

                  <Image
                    source={IconImages?.downArrow}
                    style={styles.dropdownIcon}
                  />
                </TouchableOpacity>

                {showTimezoneDropdown && timezones!.length > 0 && (
                  <View style={styles.timezoneDropdown}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                      {timezones!.map(tz => (
                        <TouchableOpacity
                          key={tz.name}
                          style={styles.countryItem}
                          onPress={() => {
                            setTimezone(`${tz.name} (${tz.utcOffsetStr})`);
                            setShowTimezoneDropdown(false);
                          }}
                        >
                          <Text style={styles.dropdownText}>
                            {tz.name} ({tz.utcOffsetStr})
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>
            </View>
          </ScrollView>

          <View style={styles.ctaButtonContainer}>
            <Button
              title={isLoading ? 'Completing...' : 'Complete Profile'}
              onPress={handleCompleteProfile}
              disabled={isLoading}
            />
            {isLoading && (
              <ActivityIndicator
                size="large"
                color="#007AFF"
                style={{ marginTop: 16 }}
              />
            )}
          </View>
        </View>
      </SafeAreaView>
      <Toast />
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 26,
    paddingBottom: 24,
  },
  header: {
    minHeight: 120,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 70,
    paddingBottom: 12,
  },
  backIcon: {
    fontSize: 28,
    color: '#3A3A3A',
  },
  title: {
    width: 263,
    height: 66,
    fontFamily: 'Satoshi-Bold',
    fontWeight: '700',
    fontSize: 30,
    lineHeight: 33,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#494949',
    opacity: 1,
    alignSelf: 'center',
    maxWidth: 263,
  },
  titleContainer: {
    position: 'absolute',
    left: 70,
    top: 70,
    height: 66,
    width: 263,
    alignItems: 'center',
  },
  formSection: {
    marginTop: 80,
  },
  fieldLabel: {
    fontFamily: 'Satoshi-Bold',
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 18,
    color: '#494949',
    textAlign: 'left',
    width: 111,
  },
  dropdownInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: 56,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    paddingHorizontal: 16,
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
  },
  dropdownInputDisabled: {
    // opacity: 0.5,
  },
  dropdownText: {
    fontFamily: 'Satoshi-Medium',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 15.4,
    color: '#000000B2',
  },
  dropdownPlaceholder: {
    fontFamily: 'Satoshi-Medium',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 15.4,
    color: '#000000B2',
  },
  dropdownIcon: {
    width: 18,
    height: 18,
    tintColor: '#8A95A5',
  },
  ctaButtonContainer: {
    marginTop: 40,
    paddingBottom: 24,
  },
  countryDropdown: {
    position: 'absolute',
    top: 78,
    maxHeight: 180,
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 12,
    marginTop: 6,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 2,
  },
  timezoneDropdown: {
    position: 'absolute',
    top: 78,
    width: '100%',
    left: 0,
    maxHeight: 180,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 12,
    marginTop: 6,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 1,
  },
  countryItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2',
  },
});

export default OnboardingLocationScreen;
