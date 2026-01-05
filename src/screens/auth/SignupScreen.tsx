import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import TextInput from '../../components/TextInput';
import Button from '../../components/Button';
import { useAuthViewModel } from '../../viewmodels/useAuthViewModel';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import GradientBackground from '../../components/GradientBackground';
import { FontFamilies } from '../../constants/fonts';

type Props = NativeStackScreenProps<RootStackParamList, 'Signup'>;

type FormData = {
  name: string;
  email: string;
  password: string;
  country: string;
};

export default function SignupScreen({ navigation }: Props) {
  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      country: '',
    },
  });

  const { signup } = useAuthViewModel();
  const [agree, setAgree] = useState(false);

  const onSubmit = async (data: FormData) => {
    navigation.navigate('OTP', { phone: data.email });
    // if (!agree) return;
    // const res = await signup(data);
    // if (res?.success) {
    // navigation.navigate('OTP', { phone: data.email });
    // }
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
          <Text style={styles.title}>Create Your Skyborne Account</Text>

          {/* First Name */}
          <Text style={styles.label}>First Name*</Text>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <TextInput value={value} onChangeText={onChange} />
            )}
          />

          {/* Email */}
          <Text style={styles.label}>Email Address*</Text>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <TextInput
                keyboardType="email-address"
                value={value}
                onChangeText={onChange}
              />
            )}
          />

          {/* Password */}
          <Text style={styles.label}>Password*</Text>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <TextInput
                secureTextEntry
                value={value}
                onChangeText={onChange}
              />
            )}
          />

          {/* Country */}
          <Text style={styles.label}>Country*</Text>
          <TextInput placeholder="Select an option" />

          {/* Terms */}
          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setAgree(!agree)}
          >
            <View style={[styles.checkbox, agree && styles.checkboxChecked]} />
            <Text style={styles.termsText}>
              I agree to Skyborne’s <Text style={styles.link}>Terms</Text> and{' '}
              <Text style={styles.link}>Data Policy</Text>
            </Text>
          </TouchableOpacity>

          {/* CTA */}
          <Button title="Login" onPress={handleSubmit(onSubmit)} />
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
    color: '##494949',
    marginBottom: 42,
    maxWidth: '80%',
  },
  label: {
    fontSize: 14,
    color: '#494949',
    marginBottom: 8,
    marginTop: 14,
    fontWeight: '500',
    fontFamily: FontFamilies.SatoshiMedium,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ccc',
    borderStyle: 'solid',
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: '#B5647E',
    borderColor: '#B5647E',
  },
  termsText: {
    fontSize: 13,
    color: '#0A0A0A',
    fontWeight: '500',
  },
  link: {
    color: '#B95E82',
    fontWeight: '500',
  },
});
