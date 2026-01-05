import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import GradientBackground from '../../components/GradientBackground';
import Button from '../../components/Button';

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
        source={require('../../assets/icons/down-arrow.png')}
        style={styles.dropdownIcon}
      />
    </TouchableOpacity>
  </View>
);

const OnboardingLocationScreen = ({ navigation }: { navigation: any }) => {
  const [country, _setCountry] = useState<string | null>(null);
  const [timezone, _setTimezone] = useState<string | null>(null);

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image
                source={require('../../assets/images/back-arrow.png')}
                style={{ width: 16, height: 16, marginHorizontal: 16, marginTop: 20}}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Where are you located?</Text>
            </View>

            <View style={{ width: 28 }} />
          </View>

          <View style={styles.formSection}>
            <DropdownInput
              label="Select Country"
              value={country}
              placeholder="Select an option"
            />

            <View style={{ height: 28 }} />

            <View style={{ marginTop: 20 }}>
              <DropdownInput
                label="Timezone"
                value={timezone}
                placeholder="Select an option"
              />
            </View>
          </View>

          <View style={styles.ctaButtonContainer}>
            <Button
              title="Complete Profile"
              onPress={() => navigation.navigate('Pricing')}
            />
          </View>
        </View>
      </SafeAreaView>
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
    marginTop: 45,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  backIcon: {
    fontSize: 28,
    color: '#3A3A3A',
  },
  title: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 30,
    fontWeight: '700',
    color: '#494949',
    textAlign: 'center',
    lineHeight: 33,
    maxWidth: 263,
  },
  titleContainer: {
    position: 'absolute',
    left: 55,
    top: 25,
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
    flex: 1,
    justifyContent: 'flex-end',
    marginTop: 40,
    paddingBottom: 24,
  },
});

export default OnboardingLocationScreen;
