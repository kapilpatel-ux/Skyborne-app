import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import GradientBackground from '../../components/GradientBackground';
import { HomeImages } from '../../assets/images/home';
import { getUserRegion, getRegionDateFromISO } from '../../utils/timezoneUtils';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import { ExploreImages } from '../../assets/images/explore';
import GuestSidebar from './GuestSidebar';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

interface UserRegion {
  timezone: string;
  region: string;
}

  const categories = [
    {
      id: 1,
      title: 'Yoga',
      source: ExploreImages.trending1,
      page:'YogaDetails'
    },
    {
      id: 2,
      title: 'Fitness Classes',
      source: ExploreImages.fitness,
      page:'FitnessDetails'
    },
    {
      id: 3,
      title: 'Zumba Dance',
      source: ExploreImages.zumba,
      page:'ZumbaDetails'
    },
    {
      id: 4,
      title: 'Diet & Nutrition',
      source: ExploreImages.diet,
      comingSoon: true,
    },
  ];


const GuestScreen: React.FC<HomeScreenProps> = ({ navigation }) => {

  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [userRegion, setUserRegion] = useState<UserRegion | null>(null);
  const [isRegionLoading, setIsRegionLoading] = useState(true);

  const [upcomingMeetings, setUpcomingMeetings] = useState<any[]>([]);
  const [todayMeetings, setTodayMeetings] = useState<any[]>(categories);


  const handleNavigate = () =>{
    navigation.navigate('Login');
  }

  // Initialize user region on mount - critical for timezone handling
  useEffect(() => {
    try {
      const region = getUserRegion();
      setUserRegion(region);
      console.log('✅ User Region Initialized:', region);
    } catch (err) {
      console.error('❌ Failed to get user region:', err);
      // Fallback to UTC if region detection fails
      setUserRegion({ timezone: 'UTC', region: 'APAC' });
    } finally {
      setIsRegionLoading(false);
    }
  }, []);

  // Debounced search - send request to backend

  const handleClassPress = (classId: string) => {
    navigation.navigate(classId as any );
  };

const DynamicSessionCard = ({ meeting }: any) => {
  const isComingSoon = meeting?.comingSoon;

  return (
    <TouchableOpacity
      style={[
        styles.sessionCard,
        isComingSoon , // same like categories
      ]}
      key={meeting.id}
      onPress={() => !isComingSoon && handleClassPress(meeting.page)}
      activeOpacity={0.7}
      disabled={isComingSoon}
    >
      <View style={styles.sessionContent}>
        <Text style={styles.sessionTitle}>{meeting.title}</Text>
        <Text style={styles.sessionSubtitle}>{meeting.subTitle}</Text>
      </View>

      <View>
        <Image
          source={meeting?.source}
          style={styles.sessionImage}
          resizeMode="cover"
        />

        {/* Overlay */}
        {isComingSoon && <View style={styles.comingSoonOverlay} />}

        {/* Badge */}
        {isComingSoon && (
          <View style={styles.comingSoonBadge}>
            <Text style={styles.comingSoonText}>Coming Soon</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};



  const DynamicClassCard = () => {
    return (
      <TouchableOpacity style={styles.classCard} activeOpacity={0.7}>
        <Image
          source={{
            uri: 'https://skyborne-images.s3.ap-south-1.amazonaws.com/shimmer.jpg',
          }}
          style={styles.classImage}
          resizeMode="cover"
        />
      </TouchableOpacity>
    );
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          {/* Top Header with Menu and Search */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.hamburgerContainer}
              onPress={() => setSidebarVisible(true)}
              activeOpacity={0.7}
            >
              <Image
                source={HomeImages.hamburgerMenu}
                style={styles.hamburgerIcon}
              />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Skyborne Drop</Text>
            <TouchableOpacity
              style={styles.searchContainer}
                onPress={handleNavigate}
            >
              <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>
          </View>

          {/* User Profile Section */}
          {
            <View style={styles.profileContainer}>
              <View style={styles.profileTextContainer}>
                <Text style={styles.greetingText}>Hello Explorer!</Text>
                <Text style={styles.subGreetingText}>
                  Discover your wellness journey{' '}
                </Text>
              </View>
            </View>
          }

          {/* Wellness Score Card */}
          {
            <View style={styles.wellnessCard}>
              <View style={styles.scoreRow}>
                <View style={styles.scoreLeft}>
                  <Text style={styles.scoreText}>
                    You're exploring as a guest
                  </Text>

                  <Text style={styles.scoreSubText}>
                    Some features are locked. Upgrade to access everything!
                  </Text>
                  {/* <TouchableOpacity style={styles.primaryButton}>
                    <Text style={styles.primaryButtonText}>Get Started</Text>
                  </TouchableOpacity> */}
                </View>
                <View style={styles.imageContainer}>
                  <Image
                    source={HomeImages.getStartedImage}
                    style={styles.getStartedImage}
                    resizeMode="contain"
                  />
                </View>
              </View>
            </View>
          }

          {/* Upcoming Sessions Results */}
          {upcomingMeetings.length > 0 && (
            <>
              <Text
                style={[
                  styles.sectionTitle,
                  { marginTop: 20, marginBottom: 10 },
                ]}
              >
                Upcoming Classes
              </Text>
              {upcomingMeetings.map((meeting, idx) => (
                <DynamicClassCard
                  key={`${meeting._id}-${idx}`}
                 
                />
              ))}
            </>
          )}

          {/* Normal View - Today's Sessions */}
          {todayMeetings.length > 0 && (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                  Find Your Flow, Every Day
                </Text>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.sessionsScroll}
                style={styles.sessionsContainer}
              >
                {todayMeetings.map(meeting => (
                  <DynamicSessionCard key={meeting._id} meeting={meeting} />
                ))}
              </ScrollView>
            </>
          )}

          {/* Upcoming Classes Section */}
          {
            <View style={styles.upcomingSection}>
              <Text style={styles.upcomingTitle}>Trending for you</Text>
              {[1, 2, 3].map(item => (
                <DynamicClassCard key={item} />
              ))}
            </View>
          }
        </ScrollView>
      </SafeAreaView>
       {/* Guest Sidebar Menu */}
      <GuestSidebar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
        navigation={navigation}
        activeScreen="Home"
      />
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
    paddingBottom: 24,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ECECEC',
  },
  searchBarIcon: {
    width: 18,
    height: 18,
    tintColor: '#B95E82',
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: '#494949',
    fontFamily: 'Satoshi-Regular',
  },
  comingSoonOverlay: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
},
comingSoonBadge: {
  position: 'absolute',
  top: 16,
  right: 16,
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 6,
  borderWidth: 1.5,
  borderColor: '#B95E82',
},
comingSoonText: {
  fontFamily: 'Satoshi-Medium',
  fontSize: 12,
  color: '#B95E82',
  textTransform: 'uppercase',
  letterSpacing: 0.5,
},
  clearButton: {
    fontSize: 18,
    color: '#B95E82',
    fontWeight: '600',
    paddingLeft: 8,
  },
  searchResultsTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#494949',
    marginBottom: 16,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#494949',
    fontFamily: 'Satoshi-Regular',
  },
  errorContainer: {
    backgroundColor: '#FFE5E5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#D32F2F',
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 14,
    fontFamily: 'Satoshi-Medium',
    marginBottom: 8,
  },
  loginText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
  },
  retryButton: {
    backgroundColor: '#D32F2F',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Satoshi-Bold',
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 28,
    backgroundColor: '#B95E82',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 35,
    marginBottom: 20,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'Satoshi-Medium',
    fontSize: 15,
    color: '#494949',
  },
  arrowContainer: {
    width: 28,
    height: 28,
    backgroundColor: '#FFFFFF',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyMessage: {
    fontSize: 16,
    color: '#999',
    fontWeight: '500',
  },
  hamburgerContainer: {
    width: 36,
    height: 44,
    borderRadius: 6,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hamburgerIcon: {
    width: 18,
    height: 12,
  },
  searchContainer: {
    width: 69,
    height: 44,
    borderRadius: 6,
    backgroundColor: '#B95E82',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchIcon: {
    width: 20,
    height: 20,
    tintColor: '#FFF',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  profileTextContainer: {
    marginLeft: 16,
  },
  greetingText: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 20,
    color: '#494949',
  },
  subGreetingText: {
    marginTop: 4,
    fontFamily: 'Satoshi-Regular',
    fontSize: 14,
    color: '#050505',
  },
  wellnessCard: {
    width: 380,
    height: 250,
    backgroundColor: '#B95E82',
    borderRadius: 12,
    paddingLeft: 22,
    paddingTop: 30,
    paddingRight: 12,
    marginBottom: 24,
  },
  wellnessTitle: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 14,
    marginBottom: 10,
  },
  scoreRow: {
    flexDirection: 'row',
    flex: 1,
  },
  scoreLeft: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  scoreText: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 20,
    lineHeight: 26,
    width: 154,
    color: '#FFFFFF',
    marginTop: 6,
  },
  getStartedImage: {
    width: 215,
    height: 329,
  },
  scoreSubText: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 14,
    lineHeight: 18,
    color: '#FFFFFF',
    width: 187,
    marginTop: 14,
  },
  primaryButton: {
    marginTop: 14,
    width: 99,
    height: 28.78,
    backgroundColor: '#FFFFFF',
    borderRadius: 17.27,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 12,
    lineHeight: 15,
    color: '#B95E82',
    textAlign: 'center',
  },
  imageContainer: {
    width: '45%',
    height: 180,
    marginTop: 0,
    marginRight: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 25,
  },
  sectionTitle: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 20,
    lineHeight: 22,
    color: '#494949',
    maxWidth: 158,
  },
  viewAllText: {
    fontFamily: 'Satoshi-Medium',
    fontSize: 16,
    lineHeight: 16,
    color: '#B95E82',
    textAlign: 'center',
  },
  sessionsContainer: {
    marginHorizontal: -16,
  },
  sessionsScroll: {
    paddingHorizontal: 16,
    gap: 16,
  },
  sessionCard: {
    width: 265,
    borderRadius: 12,
    borderColor: '#ECECEC',
    borderWidth: 1,
    borderStyle: 'solid',
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    minHeight: 320,
    paddingBlock: 26,
    paddingInline: 15,
  },

  sessionImage: {
    width: '100%',
    height: 250,
    borderRadius: 10, // Remove border radius as it's inside a bordered container
    objectFit: 'cover',
  },
  sessionContent: {
    marginBottom: 19,
  },
  sessionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#494949',
  },
  sessionSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#050505',
    marginTop: 3,
  },
  joinButton: {
    flexDirection: 'row',
    backgroundColor: '#B95E82',
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 19,
    marginBottom: 19,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  joinButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  arrow: {
    fontSize: 24,
    marginBottom: 0,
    height: 10,
    width: 20,
    color: '#000000',
    fontWeight: '600',
  },
  upcomingSection: {
    marginTop: 40,
  },
  upcomingTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#494949',
    marginBottom: 16,
  },
  classCard: {
    width: '100%',
    height:88,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
  },
  classImage: {
    width: '100%',
    height:88,

  },
  classOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    bottom: 12,
    width: '93%',
    marginHorizontal: 12,
    height: 82,
    top: 'auto',
    left: 0,
    right: 0,
    borderRadius: 12,
  },
  classContent: {
    flex: 1,
  },
  className: {
    fontSize: 20,
    fontWeight: '700',
    color: '#494949',
  },
  classTime: {
    fontSize: 14,
    fontWeight: '400',
    color: '#050505',
    marginTop: 4,
  },
  classPlayButton: {
    width: 28,
    height: 28,
    borderRadius: 22,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
  },
  weekActivitySection: {
    marginBottom: 28,
    marginTop: 47,
  },
  weekActivityTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#494949',
    marginBottom: 16,
  },
  weekActivityCard: {
    backgroundColor: '#494949',
    borderRadius: 10,
    padding: 16,
  },
  weekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  weekLabel: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  progressBar: {
    width: '100%',
    height: 12,
    backgroundColor: '#FFF7DD',
    borderRadius: 8,
    marginBottom: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#B95E82',
    borderRadius: 8,
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 4,
    display: 'flex',
  },
  dayButton: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFF7DD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayButtonActive: {
    backgroundColor: '#B95E82',
  },
  dayButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#707070',
  },
  dayButtonTextActive: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});

export default GuestScreen;
