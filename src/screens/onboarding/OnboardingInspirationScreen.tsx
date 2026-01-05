import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Button from '../../components/Button';
import { useOnboardingStore } from '../../store/onboardingSlice';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import GradientBackground from '../../components/GradientBackground';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'OnboardingInspiration'
>;

const OPTIONS = [
  'Move more & improve flexibility',
  'Get fit & stronger',
  'Eat healthy & feel better',
  'Reduce stress',
  'Build a lasting habit',
  'Just exploring',
];

export default function OnboardingInspirationScreen({ navigation }: Props) {
  const { setInspiration } = useOnboardingStore();
  const [selected, setSelected] = useState<string>('Reduce stress');

  const next = () => {
    setInspiration(selected);
    navigation.navigate('OnboardingGoal');
  };

  return (
    <GradientBackground>
      <View style={styles.screen}>
        {/* HEADER */}
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

        {/* CONTENT */}
        <View style={styles.container}>
          <Text style={styles.title}>
            What inspired you{'\n'}to join Skyborne?
          </Text>

          {OPTIONS.map(item => {
            const isSelected = item === selected;
            return (
              <TouchableOpacity
                key={item}
                onPress={() => setSelected(item)}
                style={[styles.optionCard, isSelected && styles.optionSelected]}
              >
                <Text style={styles.optionText}>{item}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* CTA */}
        <View style={styles.footer}>
          <Button title="Continue" onPress={next} />
        </View>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  /* HEADER */
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
    backgroundColor: '#DADADA',
    borderRadius: 30,
    marginHorizontal: 72,
  },
  progressFill: {
    width: '15%',
    height: '100%',
    backgroundColor: '#494949',
    borderRadius: 30,
  },

  /* CONTENT */
  container: {
    paddingHorizontal: 19,
    paddingTop: 12,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#494949',
    marginBottom: 38,
    lineHeight: 34,
    textAlign: 'center',
  },

  optionCard: {
    width: '100%',
    paddingVertical: 17,
    paddingHorizontal: 12,
    borderRadius: 10,
    minHeight: 59,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
    borderStyle: 'solid',
    borderColor: '#ECECEC',
    borderWidth: 1,
    fontWeight: '500',
    color: '#000000',
  },
  optionSelected: {
    backgroundColor: '#FFE8E8',
    borderWidth: 1,
    borderColor: '#B95E82',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },

  /* FOOTER */
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    marginTop: 'auto',
  },
});
