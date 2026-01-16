import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { ChevronLeft } from 'lucide-react-native';
import GradientBackground from '../../components/GradientBackground';
import { useClassDetailsViewModel } from '../../viewmodels/useClassDetailsViewModel';
import type { RootStackParamList } from '../../navigation/AppNavigator';

const MOCK_CLASS_DETAILS = {
  _id: 'mock-class-id-123',
  title: 'Power Yoga Flow',
  description:
    'A high-energy yoga session designed to improve flexibility, strength, and mindfulness.',
  imageUrl:
    'https://images.unsplash.com/photo-1552196563-55cd4e45efb3',
  startTime: '2026-01-15T18:30:00.000Z',
  duration: 60,
  level: 'Intermediate',
  rating: 4.8,
  reviews: 214,
  trainer: {
    firstName: 'Aarav',
    lastName: 'Sharma',
  },
  requirements: [
    'Yoga Mat',
    'Water Bottle',
    'Comfortable Clothing',
    'Stable Internet',
  ],
};


type ClassDetailsNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ClassDetails'
>;
type ClassDetailsRouteProp = RouteProp<RootStackParamList, 'ClassDetails'>;

interface ClassDetailsScreenProps {
  navigation: ClassDetailsNavigationProp;
  route: ClassDetailsRouteProp;
}

const ClassDetailsScreen: React.FC<ClassDetailsScreenProps> = ({
  route,
  navigation,
}) => {
  // const classId = route?.params?.classId;
  const classId = route?.params?.classId ?? route?.params?._id;

  console.log('📌 route params:', route?.params);
  console.log('📌 classId in screen:', classId);

  const [isJoining, setIsJoining] = useState(false);
  const [classDetails, setClassDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use class details view model
  const { getClassDetails } = useClassDetailsViewModel();

  // Fetch class details when screen mounts
  // useEffect(() => {
  //   let isMounted = true;

  //   const fetchDetails = async () => {
  //     if (!classId) {
  //       setError('Invalid class ID');
  //       setIsLoading(false);
  //       return;
  //     }

  //     setIsLoading(true);
  //     setError(null);

  //     try {
  //       const details = await getClassDetails(classId);
  //       console.log('details', details);

  //       if (isMounted) {
  //         if (details) {
  //           setClassDetails(details);
  //           setError(null);
  //         } else {
  //           setError('Class details not found');
  //           setClassDetails(null);
  //         }
  //         setIsLoading(false);
  //       }
  //     } catch (err) {
  //       if (isMounted) {
  //         setError(
  //           err instanceof Error ? err.message : 'Failed to load class details',
  //         );
  //         setClassDetails(null);
  //         setIsLoading(false);
  //       }
  //     }
  //   };

  //   fetchDetails();

  //   return () => {
  //     isMounted = false;
  //   };
  // }, [classId, getClassDetails]);

  useEffect(() => {
    // 🔥 TEMP STATIC MODE FOR UI CHECK
    setIsLoading(true);

    setTimeout(() => {
      setClassDetails(MOCK_CLASS_DETAILS);
      setIsLoading(false);
    }, 500);
  }, []);

  const handleJoinClass = async () => {
    setIsJoining(true);
    try {
      // Add join class API call here
      // await joinClassAPI(classId);

      // Navigate to next screen or show success message
      setTimeout(() => {
        setIsJoining(false);
        // navigation.navigate('SessionRoom'); // or your next screen
      }, 1000);
    } catch (err) {
      setIsJoining(false);
      console.error('Error joining class:', err);
    }
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return '--:--';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  if (isLoading) {
    return (
      <GradientBackground>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#B95E82" />
            <Text style={styles.loadingText}>Loading class details...</Text>
          </View>
        </SafeAreaView>
      </GradientBackground>
    );
  }

  if (error) {
    return (
      <GradientBackground>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>Oops!</Text>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => {
                if (classId) {
                  setIsLoading(true);
                  getClassDetails(classId).then(setClassDetails);
                }
              }}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </GradientBackground>
    );
  }

  if (!classDetails) {
    return (
      <GradientBackground>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No class details found</Text>
            <TouchableOpacity
              style={styles.backToHomeButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backToHomeButtonText}>Go Back</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          {/* Header with Back Button */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <ChevronLeft size={24} color="#494949" strokeWidth={2} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Details</Text>
            <View style={styles.headerSpacer} />
          </View>

          {/* Class Image */}
          <View style={styles.imageContainer}>
            {classDetails.imageUrl ? (
              <Image
                source={{ uri: classDetails.imageUrl }}
                style={styles.classImage}
                resizeMode="cover"
              />
            ) : (
              <View style={[styles.classImage, styles.placeholderImage]}>
                <Text style={styles.placeholderText}>No Image</Text>
              </View>
            )}
          </View>

          {/* Class Title, Trainer, and Rating */}
          <View style={styles.titleSection}>
            <View style={styles.titleRow}>
              <View style={styles.titleLeft}>
                <Text style={styles.className}>{classDetails.title}</Text>
                <Text style={styles.trainerText}>
                  Trainer: {classDetails.trainer?.firstName}{' '}
                  {classDetails.trainer?.lastName}
                </Text>
              </View>

              <View style={styles.ratingContainer}>
                {/* Row 1: Star + Rating */}
                <View style={styles.ratingRow}>
                  <Text style={styles.ratingIcon}>⭐</Text>
                  <Text style={styles.ratingValue}>
                    {classDetails.rating || '4.0'}
                  </Text>
                </View>

                {/* Row 2: Reviews */}
                <Text style={styles.reviewsText}>
                  ({classDetails.reviews || 120} reviews)
                </Text>
              </View>
            </View>
          </View>

          {/* Details Cards - Time, Duration, Level */}
          <View style={styles.detailsCard}>
            <View style={styles.detailItem}>
              <View style={styles.detailIconBox}>
                <Text style={styles.detailIconEmoji}>⏰</Text>
              </View>
              <Text style={styles.detailLabel}>Time</Text>
              <Text style={styles.detailValue}>
                {formatTime(classDetails.startTime)}
              </Text>
            </View>

            <View style={styles.detailItem}>
              <View style={styles.detailIconBox}>
                <Text style={styles.detailIconEmoji}>⏱️</Text>
              </View>
              <Text style={styles.detailLabel}>Duration</Text>
              <Text style={styles.detailValue}>
                {classDetails.duration || 60}min
              </Text>
            </View>

            <View style={styles.detailItem}>
              <View style={styles.detailIconBox}>
                <Text style={styles.detailIconEmoji}>📊</Text>
              </View>
              <Text style={styles.detailLabel}>Level</Text>
              <Text style={styles.detailValue}>
                {classDetails.level || 'Intermediate'}
              </Text>
            </View>
          </View>

          {/* About Class Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About class</Text>
            <Text style={styles.aboutText}>
              {classDetails.description ||
                'High-energy dance workout to boost your mood and turn calories...'}
            </Text>
            <TouchableOpacity>
              <Text style={styles.readMoreText}>Read more</Text>
            </TouchableOpacity>
          </View>

          {/* What You'll Need Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What you'll need</Text>
            <View style={styles.needsCard}>
              {classDetails.requirements && classDetails.requirements.length > 0 ? (
                classDetails.requirements.map((requirement: any, index: number) => (
                  <Text key={index} style={styles.needItem}>
                    • {requirement}
                  </Text>
                ))
              ) : (
                <>
                  <Text style={styles.needItem}>• Stable Mind</Text>
                  <Text style={styles.needItem}>• Good Internet Connection</Text>
                  <Text style={styles.needItem}>• Water Bottle</Text>
                  <Text style={styles.needItem}>• Sneakers</Text>
                </>
              )}
            </View>
          </View>

          {/* Spacer for button */}
          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Join Class Button - Fixed at Bottom */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.joinButton, isJoining && styles.joinButtonDisabled]}
            onPress={handleJoinClass}
            disabled={isJoining}
          >
            {isJoining ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.joinButtonText}>Join class</Text>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 20,
  },

  /* LOADING & ERROR STATES */
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: '#494949',
    fontFamily: 'Satoshi-Regular',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#D32F2F',
    marginBottom: 8,
    fontFamily: 'Satoshi-Bold',
  },
  errorText: {
    fontSize: 14,
    color: '#494949',
    textAlign: 'center',
    marginBottom: 24,
    fontFamily: 'Satoshi-Regular',
  },
  retryButton: {
    backgroundColor: '#B95E82',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 40,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Satoshi-Medium',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#494949',
    marginBottom: 16,
    fontFamily: 'Satoshi-Regular',
  },
  backToHomeButton: {
    backgroundColor: '#B95E82',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 40,
  },
  backToHomeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Satoshi-Medium',
  },

  /* HEADER */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 35,
    paddingBottom: 25,
  },
  backButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 22,
    textAlign: 'center',
    color: '#494949',
  },
  headerSpacer: {
    width: 24,
  },

  /* IMAGE */
  imageContainer: {
    height: 257,
    marginHorizontal: 16,
    marginBottom: 18,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#FFEBEB',
  },
  classImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: '#B95E82',
    fontFamily: 'Satoshi-Regular',
  },

  /* TITLE SECTION */
  titleSection: {
    paddingHorizontal: 16,
    marginBottom: 22,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleLeft: {
    flex: 1,
    marginRight: 12,
  },
  className: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 22,
    color: '#494949',
    marginBottom: 8,
  },
  trainerText: {
    fontFamily: 'Satoshi-Medium',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 19,
    color: 'rgba(0, 0, 0, 0.6)',
  },
  ratingContainer: {
    alignItems: 'flex-start',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingIcon: {
    fontSize: 17,
    marginBottom: 4,
    marginRight: 1,
  },
  ratingValue: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 19,
    color: '#000000',
    marginBottom: 2,
  },
  reviewsText: {
    fontFamily: 'Satoshi-Medium',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 19,
    color: 'rgba(0, 0, 0, 0.6)',
  },

  /* DETAILS CARD */
  detailsCard: {
    flexDirection: 'row',
    width: 358,
    height: 121,
    marginHorizontal: 16,
    marginBottom: 28,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 36,
    paddingVertical: 17,
    justifyContent: 'space-between',
  },
  detailItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailIconBox: {
    width: 41,
    height: 38,
    backgroundColor: '#FFE8E8',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailIconEmoji: {
    fontSize: 20,
  },
  detailLabel: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
    textAlign: 'center',
    color: 'rgba(5, 5, 5, 0.5)',
    marginBottom: 4,
  },
  detailValue: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
    textAlign: 'center',
    letterSpacing: 0.16,
    color: '#494949',
  },

  /* SECTIONS */
  section: {
    paddingHorizontal: 16,
    marginBottom: 44,
  },
  sectionTitle: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
    color: '#494949',
    marginBottom: 13,
  },

  /* ABOUT TEXT */
  aboutText: {
    fontFamily: 'Outfit-Regular',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 20,
    color: 'rgba(26, 28, 32, 0.8)',
    marginBottom: 4,
  },
  readMoreText: {
    fontFamily: 'Outfit-Medium',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 20,
    color: '#B95E82',
  },

  /* NEEDS CARD */
  needsCard: {
    width: 358,
    backgroundColor: '#FFE8E8',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 17,
  },
  needItem: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 15.6,
    color: '#494949',
    marginBottom: 7.59,
  },

  /* BUTTON */
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 24,
    backgroundColor: 'transparent',
  },
  joinButton: {
    width: 346.08,
    height: 54.3,
    backgroundColor: '#B95E82',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  joinButtonDisabled: {
    opacity: 0.7,
  },
  joinButtonText: {
    fontFamily: 'Satoshi-Medium',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 22,
    textAlign: 'center',
    color: '#FFFFFF',
  },
});

export default ClassDetailsScreen;
