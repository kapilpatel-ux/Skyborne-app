import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import GradientBackground from '../../components/GradientBackground';
import Button from '../../components/Button';
import { getData } from 'country-list';
import * as ct from 'countries-and-timezones';

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
  const countries = getData();
  const [selectedCountry, setSelectedCountry] = useState<{
    name: string;
    code: string;
  } | null>(null);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [timezone, setTimezone] = useState<string | null>(null);
  const [showTimezoneDropdown, setShowTimezoneDropdown] = useState(false);

  const timezones = selectedCountry
    ? ct.getTimezonesForCountry(selectedCountry.code)
    : [];

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={require('../../assets/images/back-arrow.png')}
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
                  source={require('../../assets/icons/down-arrow.png')}
                  style={styles.dropdownIcon}
                />
              </TouchableOpacity>

              {/* SMALL SCROLLABLE DROPDOWN */}
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
                style={styles.dropdownInput}
                onPress={() => setShowTimezoneDropdown(!showTimezoneDropdown)}
                disabled={!selectedCountry} // country ke bina disable
              >
                <Text
                  style={
                    timezone ? styles.dropdownText : styles.dropdownPlaceholder
                  }
                >
                  {timezone || 'Select an option'}
                </Text>

                <Image
                  source={require('../../assets/icons/down-arrow.png')}
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

          <View style={styles.ctaButtonContainer}>
            <Button
              title="Complete Profile"
              onPress={() => navigation.navigate('GetStarted')}
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
  countryDropdown: {
    position: 'absolute',
    top: 78,
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
