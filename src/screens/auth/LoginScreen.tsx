
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
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
  const [loginError, setLoginError] = useState<string>('');

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
      Toast.show({
        type: 'success',
        text1: 'Login Successful',
        text2: 'Welcome back! 👋',
        position: 'top',
        visibilityTime: 2500,
      });

      navigation.navigate('Home');
    } else {
      const msg = result.message || 'Login failed. Please try again.';
      setLoginError(msg);

      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: msg,
        position: 'top',
        visibilityTime: 3000,
      });
    }
  } catch (error: any) {
    const msg = error.message || 'An unexpected error occurred';
    setLoginError(msg);

    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: msg,
      position: 'top',
      visibilityTime: 3000,
    });
  } finally {
    setSubmitting(false);
  }
};

  return (
    <GradientBackground>
      <View style={styles.screen}>
        {/* APP BAR */}
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
              style={styles.logo}
            />
            <Text style={styles.appName}>Skyborne Drop</Text>
          </View>

          <View style={{ width: 32 }} />
        </View>

        {/* CONTENT */}
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
                    setLoginError(''); // Clear error when user types
                  }}
                  onBlur={handleBlur('email')}
                  placeholder="Enter email"
                  editable={!isSubmitting && !isLoading}
                />
                {touched.email && errors.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}

                {/* Password */}
                <Text style={styles.label}>Password*</Text>
                <TextInput
                  secureTextEntry
                  value={values.password}
                  onChangeText={(text) => {
                    handleChange('password')(text);
                    setLoginError(''); // Clear error when user types
                  }}
                  onBlur={handleBlur('password')}
                  placeholder="Enter password"
                  editable={!isSubmitting && !isLoading}
                />
                {touched.password && errors.password && (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )}

                {/* Forgot Password */}
                {/* <TouchableOpacity
                  style={styles.forgotPasswordContainer}
                  onPress={() => {
                    // Navigate to forgot password screen when implemented
                    Alert.alert('Forgot Password', 'This feature will be available soon!');
                  }}
                >
                  <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity> */}

                {/* CTA */}
                <Button
                  title={isSubmitting || isLoading ? 'Logging in...' : 'Login'}
                  onPress={() => handleSubmit()}
                  disabled={isSubmitting || isLoading}
                />

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
    fontSize: 15,
    fontWeight: '500',
    color: '#3A3A3A',
  },
  container: {
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#494949',
    marginBottom: 8,
    maxWidth: '80%',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
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
    fontWeight: '500',
    fontFamily: FontFamilies.SatoshiMedium,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginTop: 12,
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 13,
    color: '#B95E82',
    fontWeight: '500',
    fontFamily: FontFamilies.SatoshiMedium,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
    fontFamily: FontFamilies.SatoshiRegular,
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
    fontWeight: '400',
    fontFamily: FontFamilies.SatoshiRegular,
  },
  signupLink: {
    fontSize: 14,
    color: '#B95E82',
    fontWeight: '600',
    fontFamily: FontFamilies.SatoshiMedium,
  },
});