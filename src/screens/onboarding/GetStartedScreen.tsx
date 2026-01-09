import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image } from 'react-native';
import GradientBackground from '../../components/GradientBackground';
import Button from '../../components/Button';
import { GetStartedImages } from '../../assets/images/getstarted';

const GetStartedScreen = ({ navigation }: { navigation: any }) => {
  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.title}>Begin Your Skyborne Wellness Journey</Text>

          {/* Frames container */}
          <View style={styles.framesContainer}>
            {/* Frame 1 */}
            <Image
              source={GetStartedImages.frame9} // Frame 2147226197
              style={[styles.frameBase, {
                width: 45,
                height: 45,
                top: 249,
                left: 12,
                opacity: 0.5,
                borderRadius: 500,
              }]}
            />

            {/* Frame 2 */}
            <Image
              source={GetStartedImages.frame7} // Frame 2147226195
              style={[styles.frameBase, {
                width: 60,
                height: 60,
                top: 170,
                left: 44,
                opacity: 1,
                borderRadius: 500,
              }]}
            />

            {/* Frame 3 */}
            <Image
              source={GetStartedImages.frame6} // Frame 2147226194
              style={[styles.frameBase, {
                width: 60,
                height: 60,
                top: 87,
                left: 109,
                opacity: 0.5,
                borderRadius: 500,
              }]}
            />

            {/* Frame 4 */}
            <Image
              source={GetStartedImages.frame5} // Frame 2147226193
              style={[styles.frameBase, {
                width: 60,
                height: 60,
                top: 90,
                left: 208,
                opacity: 0.5,
                borderRadius: 500,
              }]}
            />

            {/* Frame 5 */}
            <Image
              source={GetStartedImages.frame1} // Frame 2147226188
              style={[styles.frameBase, {
                width: 86,
                height: 86,
                top: 153,
                left: 144,
                opacity: 1,
                borderRadius: 500,
              }]}
            />

            {/* Frame 6 */}
            <Image
              source={GetStartedImages.frame8} // Frame 2147226196
              style={[styles.frameBase, {
                width: 60,
                height: 60,
                top: 166,
                left: 256,
                opacity: 1,
                borderRadius: 500,
              }]}
            />

            {/* Frame 7 */}
            <Image
              source={GetStartedImages.frame2} // Frame 2147226189
              style={[styles.frameBase, {
                width: 70,
                height: 70,
                top: 244,
                left: 104,
                opacity: 1,
                borderRadius: 500,
              }]}
            />

            {/* Frame 8 */}
            <Image
              source={GetStartedImages.frame3} // Frame 2147226190
              style={[styles.frameBase, {
                width: 61,
                height: 61,
                top: 239,
                left: 218,
                opacity: 1,
                borderRadius: 500,
              }]}
            />

            {/* Frame 9 */}
            <Image
              source={GetStartedImages.frame4} // Frame 2147226191
              style={[styles.frameBase, {
                width: 53,
                height: 53,
                top: 229,
                left: 320,
                opacity: 0.5,
                borderRadius: 500,
              }]}
            />
          </View>
          <Text style={styles.description}>
            Skyborne Drop merges movement, nutrition, and mindfulness daily. 
            Answer questions to craft a plan that suits your energy and schedule.
          </Text>


          <View style={{ flex: 1 }} />
          <Button
            title="Get Started"
            onPress={() => navigation.navigate('Home')}
            style={styles.getStartedButton}
            textStyle={styles.getStartedButtonText}
          />
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
    paddingTop: 40,
    paddingBottom: 24,
    alignItems: 'center',
  },
  title: {
    marginTop: 56,
    marginLeft:17,
    marginRight:17,
    height: 66,
    width: 320,
    fontFamily: 'Satoshi-Bold',
    fontSize: 30,
    fontWeight: '700',
    lineHeight: 33,
    textAlign: 'center',
    color: '#494949',
    // opacity: 1,
  },
  description: {
    marginTop: 121,          
    width: 348,
    height: 57,
    fontFamily: 'Satoshi-Regular',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 20,          
    textAlign: 'center',
    color: '#050505',
  },
  getStartedButton: {
    position: 'absolute', 
    alignItems: 'center',
    width: 346.08,
    height: 54.3,
    borderRadius: 40,
    backgroundColor: '#B95E82',
    opacity: 1,
    top: 700, 
  },
  getStartedButtonText: {
    fontFamily: 'Satoshi-Medium',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 16,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  framesContainer: {
    width: '100%',
    height: 320,
    position: 'relative',
  },
  frameBase: {
    position: 'absolute',
  },
});

export default GetStartedScreen;
