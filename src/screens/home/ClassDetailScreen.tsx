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
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import GradientBackground from '../../components/GradientBackground';
import { useClassDetailsViewModel } from '../../viewmodels/useClassDetailsViewModel';
import type { RootStackParamList } from '../../navigation/AppNavigator';

type ClassDetailsNavigationProp = StackNavigationProp<
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
  const { classId } = route.params;
  const [isJoining, setIsJoining] = useState(false);
  const [classDetails, setClassDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use class details view model
  const { getClassDetails } = useClassDetailsViewModel();

  // Fetch class details when screen mounts
  useEffect(() => {
    let isMounted = true;

    const fetchDetails = async () => {
      if (!classId) {
        setError('Invalid class ID');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const details = await getClassDetails(classId);
        console.log('details', details);

        if (isMounted) {
          if (details) {
            setClassDetails(details);
            setError(null);
          } else {
            setError('Class details not found');
            setClassDetails(null);
          }
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : 'Failed to load class details',
          );
          setClassDetails(null);
          setIsLoading(false);
        }
      }
    };

    fetchDetails();

    return () => {
      isMounted = false;
    };
  }, [classId, getClassDetails]);

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

//   const handleBack = () => {
//     navigation.goBack();
//   };

  const formatTime = (dateString?: string) => {
    if (!dateString) return '--:--';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
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
              onPress={() => getClassDetails(classId)}
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
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image
                source={require('../../assets/images/back-arrow.png')}
                style={{ width: 16, height: 16, marginHorizontal: 16 }}
                resizeMode="contain"
              />
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
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image
                source={require('../../assets/images/back-arrow.png')}
                style={{ width: 16, height: 16, marginHorizontal: 16 }}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Details</Text>
            <View style={styles.headerPlaceholder} />
          </View>

          {/* Class Image */}
          <View style={styles.imageContainer}>
            {classDetails.imageUrl ? (
              <Image
                source={classDetails.imageUrl}
                style={styles.classImage}
                resizeMode="cover"
              />
            ) : (
              <View style={[styles.classImage, styles.placeholderImage]}>
                <Text style={styles.placeholderText}>No Image</Text>
              </View>
            )}
          </View>

          {/* Class Title and Trainer */}
          <View style={styles.titleSection}>
            <View style={styles.titleRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.className}>{classDetails.title}</Text>
                <Text style={styles.trainerText}>
                  Trainer: {classDetails.trainer?.firstName}{' '}
                  {classDetails.trainer?.lastName}
                </Text>
              </View>
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingIcon}>⭐</Text>
                <Text style={styles.ratingText}>
                  {classDetails.rating || 4.0}
                </Text>
                <Text style={styles.reviewsText}>
                  ({classDetails.reviews || 0} reviews)
                </Text>
              </View>
            </View>
          </View>

          {/* Class Details - Time, Duration, Level */}
          <View style={styles.detailsGrid}>
            <View style={styles.detailCard}>
              <View style={styles.detailIcon}>
                <Text style={styles.iconText}>⏰</Text>
              </View>
              <Text style={styles.detailLabel}>Time</Text>
              <Text style={styles.detailValue}>
                {formatTime(classDetails.startTime)}
              </Text>
            </View>

            <View style={styles.detailCard}>
              <View style={styles.detailIcon}>
                <Text style={styles.iconText}>⏱️</Text>
              </View>
              <Text style={styles.detailLabel}>Duration</Text>
              <Text style={styles.detailValue}>
                {classDetails.duration || 60}min
              </Text>
            </View>

            <View style={styles.detailCard}>
              <View style={styles.detailIcon}>
                <Text style={styles.iconText}>📊</Text>
              </View>
              <Text style={styles.detailLabel}>Level</Text>
              <Text style={styles.detailValue}>
                {classDetails.level || 'All'}
              </Text>
            </View>
          </View>

          {/* About Class Section */}
          {classDetails.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About class</Text>
              <View style={styles.aboutCard}>
                <Text style={styles.aboutText}>{classDetails.description}</Text>
                <TouchableOpacity>
                  <Text style={styles.readMore}>Read more</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* What You'll Need Section */}
          {classDetails.requirements &&
            classDetails.requirements.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>What you'll need</Text>
                <View style={styles.requirementsCard}>
                  {classDetails.requirements.map(
                    (requirement: any, index: number) => (
                      <View key={index} style={styles.requirementItem}>
                        <Text style={styles.bulletPoint}>•</Text>
                        <Text style={styles.requirementText}>
                          {requirement}
                        </Text>
                      </View>
                    ),
                  )}
                </View>
              </View>
            )}

          {/* Service/Category Info */}
          {classDetails.service && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Class Type</Text>
              <View style={styles.serviceCard}>
                <Text style={styles.serviceText}>
                  {classDetails.service.title}
                </Text>
              </View>
            </View>
          )}

          {/* Spacer for button visibility */}
          <View style={{ height: 20 }} />
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
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 100,
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
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Satoshi-Bold',
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
    borderRadius: 8,
  },
  backToHomeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Satoshi-Bold',
  },

  /* HEADER */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 24,
  },
  backButton: {
    width: 36,
    height: 44,
    borderRadius: 6,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    width: 18,
    height: 12,
    transform: [{ rotate: '180deg' }],
  },
  headerTitle: {
    fontFamily: 'Satoshi-Medium',
    fontSize: 18,
    fontWeight: '600',
    color: '#494949',
  },
  headerPlaceholder: {
    width: 36,
  },

  /* IMAGE CONTAINER */
  imageContainer: {
    width: '100%',
    height: 280,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
  },
  classImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    backgroundColor: '#FFE8E8',
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
    marginBottom: 24,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  className: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 24,
    fontWeight: '700',
    color: '#494949',
    marginBottom: 4,
  },
  trainerText: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 14,
    color: '#050505',
  },
  ratingBadge: {
    alignItems: 'center',
  },
  ratingIcon: {
    fontSize: 18,
    marginBottom: 4,
  },
  ratingText: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 14,
    fontWeight: '700',
    color: '#494949',
  },
  reviewsText: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 12,
    color: '#050505',
  },

  /* DETAILS GRID */
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 32,
  },
  detailCard: {
    flex: 1,
    backgroundColor: '#FFE8E8',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  detailIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconText: {
    fontSize: 18,
  },
  detailLabel: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 12,
    color: '#707070',
    marginBottom: 4,
  },
  detailValue: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 14,
    fontWeight: '700',
    color: '#494949',
  },

  /* SECTIONS */
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 18,
    fontWeight: '700',
    color: '#494949',
    marginBottom: 12,
  },

  /* ABOUT CARD */
  aboutCard: {
    backgroundColor: '#FFE8E8',
    borderRadius: 12,
    padding: 16,
  },
  aboutText: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 14,
    lineHeight: 20,
    color: '#050505',
    marginBottom: 8,
  },
  readMore: {
    fontFamily: 'Satoshi-Medium',
    fontSize: 14,
    color: '#B95E82',
    fontWeight: '600',
  },

  /* REQUIREMENTS CARD */
  requirementsCard: {
    backgroundColor: '#FFE8E8',
    borderRadius: 12,
    padding: 16,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  bulletPoint: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 16,
    color: '#494949',
    marginRight: 12,
    fontWeight: '600',
  },
  requirementText: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 14,
    color: '#050505',
    flex: 1,
  },

  /* SERVICE CARD */
  serviceCard: {
    backgroundColor: '#FFE8E8',
    borderRadius: 12,
    padding: 16,
  },
  serviceText: {
    fontFamily: 'Satoshi-Medium',
    fontSize: 14,
    color: '#494949',
  },

  /* BUTTON CONTAINER */
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#ECECEC',
  },
  joinButton: {
    width: '100%',
    height: 52,
    backgroundColor: '#B95E82',
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  joinButtonDisabled: {
    opacity: 0.7,
  },
  joinButtonText: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default ClassDetailsScreen;
