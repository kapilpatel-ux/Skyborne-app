
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, ScrollView } from 'react-native';
import GradientBackground from '../../components/GradientBackground';
import Button from '../../components/Button';

const OnboardingHabitsScreen = ({ navigation }:any) => {
  const [waterIntake, setWaterIntake] = useState<null | string>(null);
  const [sleepQuality, setSleepQuality] = useState<any>(null);
  const [exerciseFrequency, setExerciseFrequency] = useState<any>(null);

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollView}>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                           <Image
                             source={require('../../assets/images/back-arrow.png')}
                             style={{ width: 16, height: 16, marginHorizontal: 16 }}
                             resizeMode="contain"
                           />
                         </TouchableOpacity>
              <View style={styles.progressTrack}>
                <View style={styles.progressFill} />
              </View>

              <View style={{ width: 24 }} />
            </View>
          <View style={styles.container}>
            <View style={styles.headerSection}>
              <Text style={styles.title}>Your current habits</Text>
              <Text style={styles.subtitle}>Help us understand your starting point</Text>
            </View>

            {/* Question Block 1 — Water Intake */}
            <View style={styles.questionBlock}>
              <Text style={styles.questionLabel}>Do you drink enough water?</Text>
              <View style={styles.binarySelectionContainer}>
                <TouchableOpacity
                  style={[styles.binaryButton, waterIntake === 'yes' && styles.selectedBinaryButton]}
                  onPress={() => setWaterIntake('yes')}
                >
                  <Text style={styles.binaryButtonText}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.binaryButton, waterIntake === 'no' && styles.selectedBinaryButton]}
                  onPress={() => setWaterIntake('no')}
                >
                  <Text style={styles.binaryButtonText}>No</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Question Block 2 — Sleep Quality */}
            <View style={styles.questionBlock}>
              <Text style={styles.questionLabel}>How is your sleep?</Text>
              <View style={styles.gridContainer}>
                {['Poor', 'Okay', 'Good'].map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[styles.gridCard, sleepQuality === option && styles.selectedCard]}
                    onPress={() => setSleepQuality(option)}
                  >
                    <Text style={styles.gridCardText}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Question Block 3 — Exercise Frequency */}
            <View style={styles.questionBlock}>
              <Text style={styles.questionLabel}>How often do you exercise?</Text>
              <View style={styles.verticalStackContainer}>
                {['Rarely', 'Weekly', 'Regular'].map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[styles.verticalCard, exerciseFrequency === option && styles.selectedCard]}
                    onPress={() => setExerciseFrequency(option)}
                  >
                    <Text style={styles.verticalCardText}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.ctaButtonContainer}>
              <Button
                title="Continue"
                onPress={() => navigation.navigate('OnboardingMotivation')}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 16,
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
  progressTrack: {
    flex: 1,
    height: 6,
    backgroundColor: '#E6E6E6',
    borderRadius: 3,
    marginHorizontal: 72,
  },
  progressFill: {
    width: '85%', // later step than inspiration screen
    height: '100%',
    backgroundColor: '#3A3A3A',
    borderRadius: 3,
  },
  headerSection: {
    marginTop: 24, // Title positioned 28dp below progress indicator (adjusting for nav and progress)
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#3D4C5E', // dark gray
    textAlign: 'center',
    lineHeight: 26 * 1.25,
  },
  subtitle: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '400',
    color: '#494949', // medium gray
    textAlign: 'center',
  },
  questionBlock: {
    marginTop: 45,
  },
  questionLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#494949', // dark gray
    textAlign: 'left',
  },
  // Water Intake Styles
  binarySelectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 19,
    gap: 10,
  },
  binaryButton: {
    height: 59,
    flex: 1,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ECECEC', // light gray
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  selectedBinaryButton: {
    backgroundColor: '#FFE8E8', // soft blush pink
    borderColor: '#B95E82', // muted pink
    borderWidth: 1,
  },
  binaryButtonText: {
    paddingLeft: 12,
    fontSize: 14,
    fontWeight: '500',
    color: '#000000', // dark gray
  },
  // Sleep Quality Styles
  gridContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 19,
    gap: 12,
  },
  gridCard: {
    height: 59,
    flex: 1,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ECECEC',
    justifyContent: 'center',
    alignItems: 'flex-start',

  },
  gridCardText: {
    paddingLeft: 12,
    fontSize: 14,
    fontWeight: '500',
    color: '#000000'
  },
  // Exercise Frequency Styles
  verticalStackContainer: {
    marginTop: 19,
    gap: 10,
  },
  verticalCard: {
    width: '100%',
    height: 59,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ECECEC',
    justifyContent: 'center',
    paddingLeft: 12,
  },
  verticalCardText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },
  selectedCard: {
    borderColor: '#B95E82',
    backgroundColor: '#FFE8E8',
    borderWidth: 1
  },
  // CTA Button
  ctaButtonContainer: {
    marginTop: 52,
    paddingBottom: 46, // Matches root bottom padding
  },
});

export default OnboardingHabitsScreen;
