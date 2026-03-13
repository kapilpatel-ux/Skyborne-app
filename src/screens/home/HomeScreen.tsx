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
  TextInput,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import GradientBackground from '../../components/GradientBackground';
import { HomeImages } from '../../assets/images/home';
import { ArrowRight } from 'lucide-react-native';
import BottomNav from '../../components/BottomNav';
import { useHomeViewModel } from '../../viewmodels/useHomeViewModel';
import { getUserRegion, getRegionDateFromISO } from '../../utils/timezoneUtils';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import HomeSidebar from './HomeSidebar';
import { UserProfile } from '../../services/homeService';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

interface UserRegion {
  timezone: string;
  region: string;
}

const capitalizeWords = (text: string = '') =>
  text.replace(/\b\w/g, char => char.toUpperCase());

// ✅ Helper function to format date with timezone awareness
// If region is not 'live' and region time has passed, shows next day date for recording
const formatDateWithTimezone = (
  isoString: string,
  timezone?: string,
  regionTimeStr?: string,
  mode?: string,
) => {
  console.log('🎯 formatDateWithTimezone called:', {
    isoString,
    timezone,
    regionTimeStr,
    mode,
  });

  if (!isoString) return 'N/A';

  try {
    let date = new Date(isoString);

    // Validate date
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }

    // ✅ NEW LOGIC: If region is not live and region time has passed,
    // show next day's date for recording class
    if (mode !== 'live' && regionTimeStr) {
      const classDatetime = new Date(isoString);
      const currentTime = Date.now();

      console.log('📅 Recording Mode Detected:');
      console.log('  ISO Time:', isoString);
      console.log('  Region Time String:', regionTimeStr);
      console.log('  Class DateTime:', classDatetime.toISOString());
      console.log('  Current Time:', new Date(currentTime).toISOString());

      // Parse region time string (e.g., "10:00 AM")
      const [timeStr, period] = regionTimeStr.split(' ');
      const [hours, minutes] = timeStr.split(':');

      let hour = parseInt(hours, 10);
      const minute = parseInt(minutes, 10);

      // Convert to 24-hour format
      if (period === 'PM' && hour !== 12) {
        hour += 12;
      } else if (period === 'AM' && hour === 12) {
        hour = 0;
      }

      // Create a new date with the region's time for comparison
      const regionDateTime = new Date(classDatetime);
      regionDateTime.setHours(hour, minute, 0, 0);

      console.log('  Region DateTime (for comparison):', regionDateTime.toISOString());
      console.log('  Time Difference (ms):', currentTime - regionDateTime.getTime());

      // If region time is in the past and mode is 'replay', add 1 day to the date
      if (currentTime > regionDateTime.getTime()) {
        console.log(
          '📅 Recording class time has passed, showing next day date',
        );
        date = new Date(date.getTime() + 24 * 60 * 60 * 1000); // Add 24 hours
      }
    }

    // Use timezone if available, otherwise user's local timezone
    const options = {
      day: 'numeric' as const,
      month: 'short' as const,
      year: 'numeric' as const,
      timeZone: timezone || undefined,
    };

    const formattedDate = date
      .toLocaleDateString('en-GB', options)
      .replace(',', '');
    console.log('✅ Final Formatted Date:', formattedDate);

    return formattedDate;
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'N/A';
  }
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const MAX_WATER = 2.5;
  const STEP = 0.25;

  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [currentWater, setCurrentWater] = useState(2.0);
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(
    null,
  );
  const [userRegion, setUserRegion] = useState<UserRegion | null>(null);
  const [isRegionLoading, setIsRegionLoading] = useState(true);

  const percentage = Math.round((currentWater / MAX_WATER) * 100);

  const {
    user,
    todayMeetings,
    upcomingMeetings,
    isLoading,
    error,
    fetchAll,
    fetchUser,
    fetchSearch,
    weeklyActivity,
    fetchWeekly,
  } = useHomeViewModel();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);



  // Initialize user region on mount - critical for timezone handling
  useEffect(() => {
    try {
      const region = getUserRegion();
      setUserRegion(region);
    } catch (err) {
      console.error('❌ Failed to get user region:', err);
      // Fallback to UTC if region detection fails
      setUserRegion({ timezone: 'UTC', region: 'APAC' });
    } finally {
      setIsRegionLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial load - no search
    fetchAll();
  }, []);

  useEffect(() => {
    fetchWeekly();
  }, []);

  // Debounced search - send request to backend
  useEffect(() => {
    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    if (!localSearchQuery.trim()) {
      // Empty search - fetch all
      const timeout = setTimeout(() => {
        fetchAll();
      }, 300);
      setSearchTimeout(timeout);
      return;
    }

    // Debounce search requests to backend
    const timeout = setTimeout(() => {
      fetchSearch(localSearchQuery);
    }, 500); // Wait 500ms after user stops typing

    setSearchTimeout(timeout);

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [localSearchQuery]);


  const handleSearchIconPress = () => {
    setShowSearchBar(!showSearchBar);
    if (showSearchBar) {
      // Clear search when closing
      setLocalSearchQuery('');
      fetchAll();
    }
  };


  const handleClassPress = (classId: string) => {
    navigation.navigate('ClassDetails', { classId });
  };

  const totalUsedCredits =
    (user?.classCredits?.yoga ?? 0) +
    (user?.classCredits?.zumba ?? 0) +
    (user?.classCredits?.specialty ?? 0);

  const getInitials = (firstName?: string, lastName?: string) => {
    const first = firstName?.charAt(0).toUpperCase() ?? '';
    const last = lastName?.charAt(0).toUpperCase() ?? '';
    return `${first}${last}`;
  };

  const DynamicSessionCard = ({ meeting }: any) => {
    const regionInfo = meeting?.regions?.find(
      (r: any) => r.region === userRegion?.region,
    );

    const displayRegionInfo = regionInfo || meeting?.regions?.[0];

    // Extract the pre-formatted localTime from the API response
    const formattedTime = displayRegionInfo?.localTime || 'N/A';
    const timezone = displayRegionInfo?.timezone || userRegion?.timezone;
    const mode = displayRegionInfo?.mode || 'live';

    // ✅ Use the formatDateWithTimezone function with recording logic
    const formattedDate = formatDateWithTimezone(
      meeting.localTime,
      timezone,
      regionInfo?.localTime,
      mode,
    );

    return (
      <TouchableOpacity
        style={styles.sessionCard}
        onPress={() => handleClassPress(meeting._id)}
        activeOpacity={0.7}
      >
        <View style={styles.sessionContent}>
        <Text style={styles.sessionTitle}>
          {capitalizeWords(meeting.title)}
        </Text>

        <Text style={styles.sessionSubtitle}>
          {capitalizeWords(meeting.service?.title)}
        </Text>
        </View>
        <Image
          source={{uri:'https://skyborne-images.s3.ap-south-1.amazonaws.com/session-image.png'}}
          style={styles.sessionImage}
          resizeMode="cover"
        />
        <TouchableOpacity
          style={styles.joinButton}
          onPress={() => handleClassPress(meeting._id)}
        >
          <Text style={styles.joinButtonText}>Join now</Text>
          <View style={styles.arrowContainer}>
            <ArrowRight size={16} color="#111111" />
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const DynamicClassCard = ({ meeting }: any) => {
    // Find region-specific info from meeting regions array
    const regionInfo = meeting?.regions?.find(
      (r: any) => r.region === userRegion?.region,
    );

    // Fallback to first region if user region not found
    const displayRegionInfo = regionInfo || meeting?.regions?.[0];

    // Extract the pre-formatted localTime from the API response
    const formattedTime = displayRegionInfo?.localTime || 'N/A';
    const timezone = displayRegionInfo?.timezone || userRegion?.timezone;
    const mode = displayRegionInfo?.mode || 'live';

    // ✅ Use the formatDateWithTimezone function with recording logic
    const formattedDate = formatDateWithTimezone(
      meeting.localTime,
      timezone,
      regionInfo?.localTime,
      mode,
    );

    return (
      <TouchableOpacity
        style={styles.classCard}
        onPress={() => handleClassPress(meeting._id)}
        activeOpacity={0.7}
      >
        <Image
          source={HomeImages?.yogaFlow}
          style={styles.classImage}
          resizeMode="cover"
        />
        <View style={styles.classOverlay}>
          <View style={styles.classContent}>
            <Text style={styles.className}>{capitalizeWords(meeting.title)}</Text>
            <Text style={styles?.classTime}>
              {formattedDate} • {formattedTime} ({meeting.service?.title})
            </Text>
          </View>
          <TouchableOpacity
            style={styles.classPlayButton}
            onPress={() => handleClassPress(meeting._id)}
          >
            <Image
              source={{uri:'https://skyborne-images.s3.ap-south-1.amazonaws.com/arrow-white.png'}}
              style={styles.arrow}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const isSearchActive = showSearchBar && localSearchQuery.trim().length > 0;

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
            <Text style={styles.headerTitle}></Text>
            <TouchableOpacity
              style={styles.searchContainer}
              onPress={handleSearchIconPress}
            >
              <Image source={HomeImages.searchIcon} style={styles.searchIcon} />
            </TouchableOpacity>
          </View>

          {/* Search Bar - Shown only when showSearchBar is true */}
          {showSearchBar && (
            <View style={styles.searchBarContainer}>
              <Image
                source={HomeImages.searchIcon}
                style={styles.searchBarIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Search classes, trainers, services..."
                placeholderTextColor="#999"
                value={localSearchQuery}
                onChangeText={setLocalSearchQuery}
                returnKeyType="search"
                autoFocus
              />
              {localSearchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setLocalSearchQuery('')}>
                  <Text style={styles.clearButton}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* User Profile Section */}
          {!showSearchBar && (
            <View style={styles.profileContainer}>
              {user?.profileImage ? (
                <Image
                  source={{ uri: user.profileImage }}
                  style={styles.profileImage}
                />
              ) : (
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {getInitials(user?.firstName, user?.lastName)}
                  </Text>
                </View>
              )}
              <View style={styles.profileTextContainer}>
                <Text style={styles.greetingText}>
                  Good Morning, {user?.firstName || 'Guest'}
                </Text>
                <Text style={styles.subGreetingText}>
                  Choose yours workout today
                </Text>
              </View>
            </View>
          )}

          {/* Wellness Score Card */}
          {!showSearchBar && (
            <View style={styles.wellnessCard}>
              <Text style={styles.wellnessTitle}>Your Wellness Score</Text>
              <View style={styles.scoreRow}>
                <View style={styles.scoreLeft}>
                  {user?.totalClassCredits && (
                    <Text style={styles.scoreText}>
                      {user?.totalClassCredits - totalUsedCredits}/
                      {user?.totalClassCredits}
                    </Text>
                  )}
                  <Text style={styles.scoreSubText}>
                    You're doing great! Keep up the momentum.
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
          )}

          {/* Error Message */}
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={() => fetchAll()}
              >
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Loading State */}
          {(isLoading || isRegionLoading) && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#B95E82" />
              <Text style={styles.loadingText}>
                {isRegionLoading
                  ? 'Detecting your location...'
                  : isSearchActive
                  ? 'Searching...'
                  : 'Loading sessions...'}
              </Text>
            </View>
          )}

          {/* Search Results - Only show when search is active */}
          {isSearchActive && !isLoading && (
            <>
              <Text style={styles.searchResultsTitle}>Search Results</Text>

              {/* Today's Sessions Results */}
              {todayMeetings.length > 0 && (
                <>
                  <Text style={styles.sectionTitle}>Today's Session</Text>
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
                      meeting={meeting}
                    />
                  ))}
                </>
              )}

              {/* No Results */}
              {todayMeetings.length === 0 && upcomingMeetings.length === 0 && (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyMessage}>
                    No classes found matching "{localSearchQuery}"
                  </Text>
                </View>
              )}
            </>
          )}

          {/* Normal View - Today's Sessions */}
          {!showSearchBar && !isLoading && todayMeetings.length > 0 && (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Today's Sessions</Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('ViewAll')}
                >
                  <Text style={styles.viewAllText}>View all</Text>
                </TouchableOpacity>
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

          {!showSearchBar && !isLoading && todayMeetings.length === 0 && (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                  Discover today's Top Sessions
                </Text>
                {/* <TouchableOpacity
                  onPress={() => navigation.navigate('ViewAll')}
                >
                  <Text style={styles.viewAllText}>View all</Text>
                </TouchableOpacity>{' '} */}
              </View>
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyMessage}>No record found</Text>
              </View>
            </>
          )}

          {/* Upcoming Classes Section */}
          {!showSearchBar && !isLoading && upcomingMeetings.length > 0 && (
            <View style={styles.upcomingSection}>
              <Text style={styles.upcomingTitle}>Upcoming Classes</Text>
              <DynamicClassCard meeting={upcomingMeetings[0]} />
            </View>
          )}

          {!showSearchBar && !isLoading && upcomingMeetings.length === 0 && (
            <View style={styles.upcomingSection}>
              <Text style={styles.upcomingTitle}>Upcoming Classes</Text>
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyMessage}>No record found</Text>
              </View>
            </View>
          )}

          {/* This Week Activity Section */}
          {!showSearchBar && (
            <View style={styles.weekActivitySection}>
              <Text style={styles.weekActivityTitle}>This Week Activity</Text>
              <View style={styles.weekActivityCard}>
                <View style={styles.weekHeader}>
                  <Text style={styles.weekLabel}>This Week</Text>
                </View>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${weeklyActivity?.progressPercent ?? 0}%` },
                    ]}
                  />
                </View>

                <View style={styles.weekDays}>
                  {weeklyActivity?.days.map((d, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.dayButton,
                        d.completed && styles.dayButtonActive,
                      ]}
                    >
                      <Text
                        style={
                          d.completed
                            ? styles.dayButtonTextActive
                            : styles.dayButtonText
                        }
                      >
                        {d.day}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          )}
        </ScrollView>
        <BottomNav active="Home" />
      </SafeAreaView>
       {/* Sidebar Menu */}
      <HomeSidebar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
        navigation={navigation}
        activeScreen="Home"
        user={user as UserProfile}
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
    width: 36,
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
    fontSize: 40,
    lineHeight: 48,
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
    lineHeight: 16,
    color: '#FFFFFF',
    width: 114,
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
    marginTop: -19,
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
  },
  sessionImage: {
    width: '88%',
    marginRight: 15,
    marginHorizontal: 15,
    marginTop: 19,
    height: 150,
    borderRadius: 10,
  },
  sessionContent: {
    paddingHorizontal: 15,
    paddingTop: 26,
  },
  sessionTitle: {
    fontSize: 20,
    fontFamily: 'Satoshi-Bold',
    color: '#494949',
  },
  sessionSubtitle: {
    fontSize: 14,
    fontFamily: 'Satoshi-Regular',
    color: '#050505',
    marginTop: 3,
  },
  joinButton: {
    flexDirection: 'row',
    backgroundColor: '#B95E82',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginHorizontal: 16,
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
    height:12,
    width:16,
    tintColor: '#000000',
    fontWeight: '600',
  },
  upcomingSection: {
    marginTop: 40,
  },
  upcomingTitle: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 20,
    color: '#494949',
    marginBottom: 16,
  },
  classCard: {
    width: '100%',
    height: 335,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
  },
  classImage: {
    width: '100%',
    height: '100%',
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
    fontFamily: 'Satoshi-Bold',
    color: '#494949',
  },
  classTime: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'Satoshi-Regular',
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

export default HomeScreen;
