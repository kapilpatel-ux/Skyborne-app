import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
  ActivityIndicator,
} from 'react-native';
import {
  Star
} from 'lucide-react-native';
import { Images } from '../../assets/images';
import { useFeedbackViewModel } from '../../viewmodels/useFeedbackViewModel';
// import { Alert } from 'react-native';
import Toast from 'react-native-toast-message';
import { useEffect } from 'react';

interface FeelingOption {
  id: number;
  label: string;
  icon: string;
}

const FeedbackScreen = ({ navigation }: { navigation: any }) => {
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [selectedFeeling, setSelectedFeeling] = useState<number | null>(null);

  const { submitFeedback, isSubmitting, isSuccess, error, clearFeedbackState } = useFeedbackViewModel();

  const feelingOptions: FeelingOption[] = [
    {
      id: 1,
      label: 'Energized',
      icon: Images.energizedIcon,
    },
    {
      id: 2,
      label: 'Relaxed',
      icon: Images.relaxedIcon,
    },
    {
      id: 3,
      label: 'Strong',
      icon: Images.strongIcon,
    },
    {
      id: 4,
      label: 'Tired',
      icon: Images.tiredIcon,
    },
  ];

  const handleSubmitFeedback = async () => {
    // Validation
    if (selectedRating === 0) {
      Toast.show({
        type: 'error',
        text1: 'Rating required',
        text2: 'Please select a rating',
      });
      return;
    }

    if (!selectedFeeling) {
      Toast.show({
        type: 'error',
        text1: 'Feeling required',
        text2: 'Please select how you feel',
      });
      return;
    }

    // Map feeling to comment
    const feelingLabel = feelingOptions.find(f => f.id === selectedFeeling)?.label || '';

    try {
      await submitFeedback({
        rating: selectedRating,
        comment: `I feel ${feelingLabel} after this class.`,
      });
    } catch (err) {
      console.error('Submit feedback error:', err);
    }
  };

  const handleSkip = () => {
    navigation.goBack();
  };

  useEffect(() => {
    if (isSuccess) {
      Toast.show({
        type: 'success',
        text1: 'Thank you!',
        text2: 'Your feedback has been submitted successfully',
      });

      clearFeedbackState();
      navigation.goBack();
    }
  }, [isSuccess]);


  useEffect(() => {
    if (error) {
      Toast.show({
        type: 'error',
        text1: 'Submission failed',
        text2: typeof error === 'string' ? error : 'Failed to submit feedback',
      });

      clearFeedbackState();
    }
  }, [error]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Close Button */}
        <TouchableOpacity style={styles.closeButton} onPress={handleSkip}>
          <Image source={{uri:Images.crossIcon}} />
        </TouchableOpacity>

        {/* Success Animation */}
        <Image
          // source={Images.}
          style={styles.successAnimation}
          resizeMode="contain"
        />

        {/* Title */}
        <Text style={styles.title}>Great Job!</Text>

        {/* Description */}
        <Text style={styles.description}>
          You've completed your session. Keep up the amazing work
        </Text>

        {/* Rating Card */}
        <View style={styles.ratingCard}>
          <Text style={styles.ratingQuestion}>How was the class?</Text>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                style={styles.starButton}
                onPress={() => setSelectedRating(star)}
              >
                <Star
                  size={27}
                  color={selectedRating >= star ? '#F5A700' : '#767676'}
                  fill={selectedRating >= star ? '#F5A700' : 'transparent'}
                  strokeWidth={2}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Feeling Question */}
        <Text style={styles.feelingQuestion}>How do you feel after class</Text>

        {/* Feeling Options */}
        <View style={styles.feelingGrid}>
          {feelingOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.feelingCard,
                selectedFeeling === option.id && styles.feelingCardSelected,
              ]}
              onPress={() => setSelectedFeeling(option.id)}
            >
              <Image source={{uri:option.icon}} style={styles.feelingIcon} />
              <Text style={styles.feelingLabel}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Submit Button */}
        <TouchableOpacity 
          style={[styles.submitButton, isSubmitting && { opacity: 0.7 }]} 
          onPress={handleSubmitFeedback}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.submitButtonText}>Submit Feedback</Text>
          )}
        </TouchableOpacity>

        {/* Skip Button */}
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 22,
  },
  // Close Button
  closeButton: {
    position: 'absolute',
    top: 45,
    right: 16,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  // Success Animation
  successAnimation: {
    width: 150,
    height: 150,
    marginTop: 127,
    marginBottom: 24,
  },
  // Title and Description
  title: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 25,
    lineHeight: 28,
    color: '#494949',
    textAlign: 'center',
    marginBottom: 9,
  },
  description: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 14,
    lineHeight: 19,
    color: 'rgba(5, 5, 5, 0.8)',
    textAlign: 'center',
    width: 267,
    marginBottom: 39,
  },
  // Rating Card
  ratingCard: {
    width: 302,
    height: 97,
    backgroundColor: '#FEF0C5',
    borderRadius: 9.95,
    paddingTop: 13,
    paddingBottom: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 39,
  },
  ratingQuestion: {
    fontFamily: 'Satoshi-Medium',
    fontSize: 15.8,
    lineHeight: 23,
    color: '#494949',
    textAlign: 'center',
    marginBottom: 15,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  starButton: {
    width: 32,
    height: 33,
    justifyContent: 'center',
    alignItems: 'center',
  },
  starIcon: {
    width: 27,
    height: 26,
    borderWidth: 2,
    borderColor: '#767676',
    backgroundColor: 'transparent',
    transform: [{ rotate: '0deg' }],
  },
  starIconSelected: {
    borderColor: '#F5A700',
    backgroundColor: '#F5A700',
  },
  // Feeling Section
  feelingQuestion: {
    fontFamily: 'Satoshi-Medium',
    fontSize: 15.8,
    lineHeight: 23,
    color: '#494949',
    textAlign: 'center',
    marginBottom: 19,
  },
  feelingGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 372,
    paddingHorizontal: 0,
    marginBottom: 43,
  },
  feelingCard: {
    width: 79,
    height: 79,
    backgroundColor: '#FFE8E8',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 15,
    paddingBottom: 15,
    // paddingHorizontal: 10,
  },
  feelingCardSelected: {
    backgroundColor: '#FFD4D4',
    borderWidth: 2,
    borderColor: '#B95E82',
  },
  feelingIcon: {
    width: 24,
    height: 24,
    marginBottom: 7,
  },
  feelingLabel: {
    fontFamily: 'Satoshi-Medium',
    fontSize: 13,
    lineHeight: 18,
    color: 'rgba(5, 5, 5, 0.8)',
    textAlign: 'center',
  },
  // Submit Button
  submitButton: {
    width: 346.08,
    height: 54.3,
    backgroundColor: '#B95E82',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12.7,
  },
  submitButtonText: {
    fontFamily: 'Satoshi-Medium',
    fontSize: 16,
    lineHeight: 22,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  // Skip Button
  skipButton: {
    paddingVertical: 8,
  },
  skipText: {
    fontFamily: 'Satoshi-Medium',
    fontSize: 16,
    lineHeight: 22,
    color: '#B95E82',
    textAlign: 'center',
  },
});

export default FeedbackScreen;