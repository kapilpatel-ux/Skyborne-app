import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, StatusBar, SafeAreaView, Platform } from 'react-native';
import Button from '../../components/Button';
import GradientBackground from '../../components/GradientBackground';
import { FontFamilies, FontWeights } from '../../constants/fonts';

const { width } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }: any) {
  const handleGetStarted = () => {
    console.log('Get Started Pressed!');
    navigation.replace('AuthOptions');
  };

  return (
    <>
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" translucent />
      <GradientBackground>
        <View style={styles.container}>

          {/* Image Card - Takes up ~60% of screen height */}
          <View style={styles.imageWrapper}>
            <Image
              source={require('../../assets/images/community.jpg')}
              style={styles.image}
              resizeMode="cover"
            />
          </View>

          {/* Content Section */}
          <View style={styles.contentSection}>
            {/* Headline */}
            <Text style={styles.headline}>Welcome to Skyborne Drop</Text>

            {/* Subtitle */}
            <Text style={styles.subtitle}>
              Your journey to holistic wellness starts here. Yoga, fitness, dance, and nutrition all in one place.
            </Text>

            {/* Call-to-action Button */}
            <Button
              title="Get Started"
              onPress={handleGetStarted}
              style={styles.getStartedButton}
              textStyle={styles.getStartedButtonText}
            />
          </View>
        </View>
      </GradientBackground>
    </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingTop: Platform.OS === "android" ? 0 : undefined,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  imageWrapper: {
    width: '100%',          
    height: '60%', // Responsive - takes 60% of available height
    borderBottomLeftRadius: 200,
    borderBottomRightRadius: 200,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  contentSection: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 30,
  },
  headline: {
    fontFamily: FontFamilies.SatoshiBold,
    fontSize: 25,
    fontWeight: FontWeights.bold as "bold",
    color: '#494949',
    textAlign: 'center',
    marginBottom: 13,
  },
  subtitle: {
    fontFamily: FontFamilies.SatoshiRegular,
    fontSize: 14,
    fontWeight: FontWeights.regular as "regular",
    color: '#494949',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
  },
  getStartedButton: {
    width: width * 0.85,
    height: 54,
    borderRadius: 100,
    backgroundColor: '#B95E82',
  },
  getStartedButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 18,
    fontFamily: FontFamilies.SatoshiMedium,
  },
});