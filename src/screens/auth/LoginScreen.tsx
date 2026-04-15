import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Platform, BackHandler } from 'react-native';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import TextInput from '../../components/TextInput';
import Button from '../../components/Button';
import { useAuthViewModel } from '../../viewmodels/useAuthViewModel';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import GradientBackground from '../../components/GradientBackground';
import { FontFamilies } from '../../constants/fonts';
import Toast from 'react-native-toast-message';
import { EyeIcon, EyeOffIcon } from '../../icons/FormIcons';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { GOOGLE_KEY } from '@env';
import { useDispatch } from 'react-redux';
import { IconImages } from '../../assets/icons';
import { clearError, setUser } from '../../store/authSlice';
import { socialLoginService } from '../../services/authService';
import { normalizeErrorMessage } from '../../utils/errorUtils';
import { useFocusEffect } from '@react-navigation/native';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

type FormData = {
  email: string;
  password: string;
};





const validationSchema = Yup.object().shape({
  email: Yup.string()
    .trim()
    .required('Email is required')
    .email('Invalid email format')
    .matches(
      /^[^\s@]+@[^\s@]+\.(com|net|org|in|co|io|ai|edu|gov|ae)$/i,
      'Enter a valid email'
    ),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters long'),
});

export default function LoginScreen({ navigation }: Props) {
  const { login, isLoading } = useAuthViewModel();
  const dispatch = useDispatch<any>();
  const [loginError, setLoginError] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (navigation.canGoBack()) {
          navigation.goBack();
        } else {
          navigation.navigate('WelcomeScreen');
        }
        return true;
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => subscription.remove();
    }, [navigation]),
  );

 useEffect(() => {
    configureGoogleSignIn();
    // Clear any stuck auth state when component mounts
    dispatch(clearError());
  }, [dispatch]);

  const configureGoogleSignIn = () => {
    try {
      const webClientId = GOOGLE_KEY || '';
      const iosClientId =
        '398904495705-5sfusc2amh3d00j4nmno4iqmth1o68kr.apps.googleusercontent.com';
      const configureOptions = {
        iosClientId,
        offlineAccess: false,
        ...(Platform.OS === 'android' && webClientId ? { webClientId } : {}),
      };

      GoogleSignin.configure(configureOptions);
    } catch (error) {
      console.error('Configuration error:', error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
       try {
              await GoogleSignin.signOut();
            } catch (error:any) {
              // Silently fail if not signed in
              console.log('Not previously signed in');
            }
      setGoogleLoading(true);

      if (Platform.OS === 'android') {
        await GoogleSignin.hasPlayServices({
          showPlayServicesUpdateDialog: true,
        });
      }

      const userInfo: any = await GoogleSignin.signIn();
      const googleId = userInfo?.data?.user.id;
      const email = userInfo?.data?.user.email;
      const firstName = userInfo?.data?.user.givenName || '';
      const lastName = userInfo?.data?.user.familyName || '';

      // Call social-login API
      const payload = {
        provider: 'google',
        email: email,
        googleId: googleId,
      };

      const response = await socialLoginService(payload);
      if (response.success) {
        const { user, accessToken, refreshToken } = response.data;

        // Store tokens and user data
        await dispatch(
          setUser({
            ...user,
            firstName,
            lastName,
          })
        );

        if ( user?.onboardingCompleted) {
          navigation.replace('Home');
        } else {
          navigation.replace('Pricing');
        }

        // Update auth state with tokens
        dispatch({
          type: 'auth/loginFulfilled',
          payload: {
            data: {
              user: { ...user, firstName, lastName },
              accessToken,
              refreshToken,
            },
          },
        });

        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: `Signed in as ${email}`,
          position: 'top',
          visibilityTime: 2500,
        });

      } else {
        const errorMsg = normalizeErrorMessage(
          response.message,
          'Social login failed'
        );
        setLoginError(errorMsg);
        Toast.show({
          type: 'error',
          text1: 'Login Failed',
          text2: errorMsg,
          position: 'top',
          visibilityTime: 3000,
        });
      }
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
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
        Toast.show({
          type: 'error',
          text1: 'Configuration Error',
          text2: 'Please check Web Client ID and SHA-1 fingerprint',
        });
      } else {
        const errorMsg = normalizeErrorMessage(
          error?.message,
          'Unknown error occurred'
        );
        setLoginError(errorMsg);
        Toast.show({
          type: 'error',
          text1: 'Sign-in Failed',
          text2: errorMsg,
        });
      }
    } finally {
      setGoogleLoading(false);
    }
  };


  const initialValues: FormData = {
    email: '',
    password: '',
  };

const onSubmit = async (
    data: FormData,
    { setSubmitting }: FormikHelpers<FormData>
  ) => {
    try {
      setLoginError('');

      const result = await login(data.email, data.password);

      if (result.success) {
        const onboardingCompleted = result?.data?.data?.user?.onboardingCompleted === true;

        Toast.show({
          type: 'success',
          text1: 'Login Successful',
          text2: 'Welcome back! 👋',
          position: 'top',
          visibilityTime: 2500,
        });

        if (onboardingCompleted) {
          navigation.navigate('Home');
        } else {
          navigation.navigate('Pricing');
        }
      } else {
        const msg = normalizeErrorMessage(
          result.message,
          'Login failed. Please try again.'
        );
        setLoginError(msg);

        Toast.show({
          type: 'error',
          text1: 'Login Failed',
          text2: msg,
          position: 'top',
          visibilityTime: 3000,
        });

        // Explicitly reset submitting state on error
        setSubmitting(false);
      }
    } catch (error: any) {
      const msg = normalizeErrorMessage(
        error?.message,
        'An unexpected error occurred'
      );
      setLoginError(msg);

      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: msg,
        position: 'top',
        visibilityTime: 3000,
      });

      // Explicitly reset submitting state on error
      setSubmitting(false);
    }
  };


  return (
    <GradientBackground>
      <View style={styles.screen}>
        {/* APP BAR */}
        <View style={styles.appBar}>
          <TouchableOpacity
            onPress={() => {
              if (navigation.canGoBack()) {
                navigation.goBack();
              } else {
                navigation.navigate('WelcomeScreen');
              }
            }}
          >
            <Image
              source={{uri:'https://skyborne-images.s3.ap-south-1.amazonaws.com/back-arrow.png'}}
              style={{ width: 16, height: 16, marginHorizontal: 16 }}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <View style={styles.appBarCenter}>
            <Image
              source={require('../../assets/images/logo.png')}
              style={styles.logo}
            />
            <Text style={styles.appName}>Skyborne Drop</Text>
          </View>

          <View style={{ width: 32 }} />
        </View>

        {/* SCROLLABLE CONTENT */}
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <Text style={styles.title}>Welcome Back to Skyborne</Text>
            <Text style={styles.subtitle}>Login to continue your wellness journey</Text>

            {/* Show general login error if exists */}
            {loginError ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorBannerText}>{loginError}</Text>
              </View>
            ) : null}

            <Formik<FormData>
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
              }) => (
                <View>
                  {/* Email */}
                  <Text style={styles.label}>Email Address*</Text>
                  <TextInput
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={values.email}
                    onChangeText={(text) => {
                      handleChange('email')(text);
                      setLoginError('');
                    }}
                    onBlur={handleBlur('email')}
                    placeholder="Enter email"
                    editable={!isSubmitting && !isLoading && !googleLoading}
                  />
                  {touched.email && errors.email && (
                    <Text style={styles.errorText}>{errors.email}</Text>
                  )}

                  {/* Password */}
                  <Text style={styles.label}>Password*</Text>
                  <View style={styles.passwordContainer}>
                    <TextInput
                      style={styles.passwordInput}
                      secureTextEntry={!showPassword}
                      value={values.password}
                      onChangeText={(text) => {
                        handleChange('password')(text);
                        setLoginError('');
                      }}
                      onBlur={handleBlur('password')}
                      placeholder="Enter password"
                      editable={!isSubmitting && !isLoading && !googleLoading}
                    />
                    <TouchableOpacity
                      style={styles.eyeIcon}
                      onPress={() => setShowPassword(!showPassword)}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      {showPassword ? (
                        <EyeIcon color="#494949" size={18} />
                      ) : (
                        <EyeOffIcon color="#494949" size={18} />
                      )}
                    </TouchableOpacity>
                  </View>
                  {touched.password && errors.password && (
                    <Text style={styles.errorText}>{errors.password}</Text>
                  )}

                  <TouchableOpacity 
                    onPress={() => navigation.navigate('ForgotPasswordEmail')}
                    style={{ alignSelf: 'flex-end', marginTop: 8, marginBottom: 16 }}
                  >
                    <Text style={{ 
                      fontFamily: 'Satoshi-Medium',
                      fontSize: 14,
                      color: '#B95E82',
                    }}>
                      Forgot password?
                    </Text>
                  </TouchableOpacity>

                  {/* CTA */}
                  <Button
                    title={isSubmitting || isLoading ? 'Logging in...' : 'Login'}
                    onPress={() => handleSubmit()}
                    disabled={isSubmitting || isLoading || googleLoading}
                  />

                  {/* Divider */}
                  <View style={styles.dividerContainer}>
                    <View style={styles.divider} />
                    <Text style={styles.dividerText}>Or</Text>
                    <View style={styles.divider} />
                  </View>

                  {/* Google Sign-In Button */}
                  <TouchableOpacity
                    style={styles.googleButton}
                    onPress={handleGoogleSignIn}
                    disabled={googleLoading || isSubmitting || isLoading}
                  >
                    <Image
                      source={IconImages?.google}
                      style={styles.googleButtonIcon}
                    />
                    <Text style={styles.googleButtonText}>
                      {googleLoading ? 'Signing in...' : 'Continue with Google'}
                    </Text>
                  </TouchableOpacity>

                  {/* Signup Link */}
                  <View style={styles.signupContainer}>
                    <Text style={styles.signupText}>Don't have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                      <Text style={styles.signupLink}>Sign up</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </Formik>
          </View>
        </ScrollView>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  appBar: {
    minHeight: 120,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 70,
    paddingBottom: 43,
  },
  backBtn: {
    width: 32,
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: '#3A3A3A',
  },
  appBarCenter: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 60,
    height: 65,
    resizeMode: 'contain',
    marginRight: 6,
  },
  appName: {
    fontFamily: FontFamilies.SatoshiMedium,
    fontSize: 15,
    color: '#3A3A3A',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  container: {
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 30,
    color: '#494949',
    marginBottom: 8,
    maxWidth: '80%',
    fontFamily: FontFamilies.SatoshiBold,
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 20,
    fontFamily: FontFamilies.SatoshiRegular,
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  errorBannerText: {
    color: '#EF4444',
    fontSize: 13,
    fontFamily: FontFamilies.SatoshiMedium,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    color: '#494949',
    marginBottom: 8,
    marginTop: 14,
    fontFamily: FontFamilies.SatoshiMedium,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -11 }],
    zIndex: 10,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
    fontFamily: FontFamilies.SatoshiRegular,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#D7D7D7',
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 14,
    color: '#999999',
    fontFamily: FontFamilies.SatoshiRegular,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 54,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#D7D7D7',
    justifyContent: 'center',
    marginBottom: 24,
  },
  googleButtonIcon: {
    width: 20,
    height: 20,
    marginRight: 12,
    resizeMode: 'contain',
  },
  googleButtonText: {
    fontFamily: FontFamilies.SatoshiMedium,
    fontSize: 16,
    color: '#494949',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  signupText: {
    fontSize: 14,
    color: '#0A0A0A',
    fontFamily: FontFamilies.SatoshiRegular,
  },
  signupLink: {
    fontSize: 14,
    color: '#B95E82',
    fontFamily: FontFamilies.SatoshiMedium,
  },
});
