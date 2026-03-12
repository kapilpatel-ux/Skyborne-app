import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Image,
  ActivityIndicator,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ScheduleImages } from '../../assets/images/schedule';
import BottomNav from '../../components/BottomNav';
import {
  weeklyScheduleService,
  Meeting,
  MeetingsResponse,
} from '../../services/WeeklyScheduleService';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import {
  fetchLoggedInUserCountryRegion,
  fetchLoggedInUserRegion,
} from '../../utils/timezoneUtils';

type WeeklyScheduleNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Schedule'
>;

interface WeeklyScheduleScreenProps {
  navigation: WeeklyScheduleNavigationProp;
}

interface WeekDay {
  day: string;
  date: number;
  dayIndex: number;
}

const WeeklyScheduleScreen: React.FC<WeeklyScheduleScreenProps> = ({
  navigation,
}) => {
  const [selectedDate, setSelectedDate] = useState<number>(
    new Date().getDate(),
  );
  const [weekDays, setWeekDays] = useState<WeekDay[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [weeklyMeetings, setWeeklyMeetings] = useState<Meeting[]>([]);
  const [userPlan, setUserPlan] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize week data
  useEffect(() => {
    initializeWeek();
  }, []);

  // Fetch weekly meetings
  useEffect(() => {
    fetchWeeklyMeetings();
  }, []);

  const initializeWeek = () => {
    const currentDate = new Date();
    const currentDay = currentDate.getDay();
    const firstDayOfWeek = new Date(currentDate);
    firstDayOfWeek.setDate(currentDate.getDate() - currentDay);

    const days: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const newWeekData: WeekDay[] = days.map((day, index) => {
      const date = new Date(firstDayOfWeek);
      date.setDate(firstDayOfWeek.getDate() + index);

      return {
        day,
        date: date.getDate(),
        dayIndex: index,
      };
    });

    setWeekDays(newWeekData);
    setSelectedDate(currentDate.getDate());
  };

  const getRegionCode = async (): Promise<string | undefined> => {
    try {
      const { regionCode } = await fetchLoggedInUserCountryRegion();
      if (regionCode?.trim()) return regionCode.trim();
    } catch (error) {
      console.warn('Failed to get region code from country mapping:', error);
    }

    try {
      const { code } = await fetchLoggedInUserRegion();
      if (code?.trim()) return code.trim();
    } catch (error) {
      console.warn('Failed to get fallback region code from user profile:', error);
    }

    return undefined;
  };

  const fetchWeeklyMeetings = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const regionCode = await getRegionCode();
      const response: MeetingsResponse =
        await weeklyScheduleService.getWeeklyMeetings(regionCode);

      if (response.success) {
        setWeeklyMeetings(response.meetings || []);
        setUserPlan(response.userPlan || '');
      } else {
        setError('Failed to load meetings');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error fetching meetings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClassPress = useCallback(
    (classId: string) => {
      navigation.navigate('ClassDetails', { classId });
    },
    [navigation],
  );

  const handleRetry = () => {
    fetchWeeklyMeetings();
  };

  // Filter meetings for selected date
  const selectedDayMeetings = weeklyMeetings.filter(meeting => {
    const meetingDate = new Date(meeting.localTime);
    return meetingDate.getDate() === selectedDate;
  });

  // Filter by search query
  const filteredMeetings = selectedDayMeetings.filter(meeting => {
    if (!searchQuery.trim()) return true;
    const searchLower = searchQuery.toLowerCase();

    return (
      meeting.title.toLowerCase().includes(searchLower) ||
      meeting.service?.title.toLowerCase().includes(searchLower) ||
      meeting.trainer?.name.toLowerCase().includes(searchLower)
    );
  });

  const getFormattedTime = (
    meeting: Meeting,
  ): { time: string; period: string } => {
    const regionInfo = meeting?.regions?.[0];
    const formattedTime = regionInfo?.localTime || 'N/A';
    const parts = formattedTime.split(' ');
    return {
      time: parts[0] || 'N/A',
      period: parts[1] || 'AM',
    };
  };

  const getSessionColor = (
    index: number,
  ): { backgroundColor: string; color: string } => {
    return index % 2 === 0
      ? { backgroundColor: '#030416', color: '#D4D4D4' }
      : { backgroundColor: '#B95E82', color: '#FFFFFF' };
  };

  const getDayWithMeetings = (date: number): boolean => {
    return weeklyMeetings.some(m => new Date(m.localTime).getDate() === date);
  };

  const selectedDay = weekDays.find(d => d.date === selectedDate);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Your Schedule</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Image source={ScheduleImages.searchIcon} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by Sessions name"
            placeholderTextColor="#959595"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Today's Plan Banner */}
        {!isLoading && !error && (
          <View style={styles.todaysPlanBanner}>
            <View style={styles.bannerImageContainer}>
              <ImageBackground
                source={ScheduleImages.PlanImage}
                style={styles.bannerImage}
                resizeMode="cover"
              >
                <ImageBackground
                  source={ScheduleImages.BlackGradient}
                  style={styles.bannerGradient}
                  resizeMode="cover"
                >
                  <View style={styles.bannerContent}>
                    <Text style={styles.bannerTitle}>
                      Your {userPlan || 'Plan'} Package
                    </Text>
                    <Text style={styles.bannerDescription}>
                      See your Yoga, Fitness, Zumba, and Nutrition sessions in
                      one timeline.
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.bannerButton}
                    onPress={() => navigation.navigate('Profile')}
                  >
                    <ImageBackground
                      style={styles.arrowCircle}
                      source={ScheduleImages.ArrowImage}
                    />
                  </TouchableOpacity>
                </ImageBackground>
              </ImageBackground>
            </View>
          </View>
        )}

        {/* Calendar Section */}
        <View style={styles.calendarSection}>
          <Text style={styles.calendarTitle}>
            {new Date().toLocaleString('default', {
              month: 'long',
              year: 'numeric',
            })}
          </Text>

          {/* Week Days and Dates */}
          <View style={styles.weekContainer}>
            {weekDays.map(item => (
              <View key={item.dayIndex} style={styles.dayColumn}>
                <Text style={styles.dayLabel}>{item.day}</Text>
                <TouchableOpacity
                  style={[
                    styles.dateContainer,
                    selectedDate === item.date && styles.dateContainerSelected,
                  ]}
                  onPress={() => setSelectedDate(item.date)}
                >
                  <Text
                    style={[
                      styles.dateText,
                      selectedDate === item.date && styles.dateTextSelected,
                    ]}
                  >
                    {item.date}
                  </Text>
                  {getDayWithMeetings(item.date) && (
                    <View
                      style={[
                        styles.dotIndicator,
                        selectedDate === item.date &&
                          styles.dotIndicatorSelected,
                      ]}
                    />
                  )}
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* Loading State */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#B95E82" />
            <Text style={styles.loadingText}>Loading schedule...</Text>
          </View>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Sessions Schedule Card */}
        {!isLoading && !error && (
          <View style={styles.scheduleCard}>
            {/* Card Header */}
            <View style={styles.scheduleHeader}>
              <View style={styles.scheduleHeaderLeft}>
                <Text style={styles.sessionsCount}>
                  {filteredMeetings.length} Sessions
                </Text>
                <Text style={styles.scheduleDate}>
                  {selectedDay?.day}, {selectedDate}
                </Text>
              </View>
              <View style={styles.scheduleHeaderRight}>
                <TouchableOpacity
                  style={styles.navArrowLeft}
                  onPress={() => {
                    const prevDate = selectedDate - 1;
                    const validDate = weekDays.find(d => d.date === prevDate);
                    if (validDate) setSelectedDate(prevDate);
                  }}
                >
                  <Image
                    source={ScheduleImages.ArrowImage2}
                    resizeMode="contain"
                    style={styles.navArrowIcon}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.navArrowRight}
                  onPress={() => {
                    const nextDate = selectedDate + 1;
                    const validDate = weekDays.find(d => d.date === nextDate);
                    if (validDate) setSelectedDate(nextDate);
                  }}
                >
                  <Image
                    source={ScheduleImages.ArrowImage3}
                    resizeMode="contain"
                    style={styles.navArrowIcon}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Sessions List */}
            {filteredMeetings.length > 0 ? (
              <View style={styles.sessionsList}>
                {filteredMeetings.map((meeting, index) => {
                  const { time, period } = getFormattedTime(meeting);
                  const colors = getSessionColor(index);

                  return (
                    <View key={meeting._id}>
                      {/* Time Label */}
                      <View style={styles.timeRow}>
                        <Text style={styles.timeLabel}>
                          {time}
                          {'\n'}
                          {period}
                        </Text>
                        <View style={styles.timeDivider} />
                      </View>

                      {/* Session Card */}
                      <TouchableOpacity
                        style={[
                          styles.sessionCard,
                          { backgroundColor: colors.backgroundColor },
                        ]}
                        onPress={() => handleClassPress(meeting._id)}
                        activeOpacity={0.7}
                      >
                        {/* Left: Image and Trainer */}
                        <View style={styles.sessionLeft}>
                          <View style={styles.sessionImageContainer}>
                            <ImageBackground
                              source={ScheduleImages.SessionImage}
                              style={styles.sessionImage}
                              resizeMode="cover"
                            />
                          </View>
                          <Text
                            style={[
                              styles.sessionTrainer,
                              { color: colors.color },
                            ]}
                          >
                            Trainer: {meeting?.trainer?.name || 'N/A'}
                          </Text>
                        </View>

                        {/* Middle: Title and Duration */}
                        <View style={styles.sessionInfo}>
                          <Text style={styles.sessionTitle}>
                            {meeting.title
                              ?.toLowerCase()
                              .replace(/\b\w/g, char => char.toUpperCase())}
                          </Text>
                          <Text style={styles.sessionDuration}>
                            {meeting.duration} min - {meeting.service?.title}
                          </Text>
                        </View>

                        {/* Right: Play Button */}
                        <TouchableOpacity
                          style={styles.sessionPlayButton}
                          onPress={() => handleClassPress(meeting._id)}
                        >
                          <View
                            style={[
                              styles.playButtonCircle,
                              colors.backgroundColor === '#B95E82' &&
                                styles.playButtonCircleDark,
                            ]}
                          >
                            <View style={styles.arrowBgCircle}>
                              <Image source={ScheduleImages.ArrowImage4}
                                style={styles.navArrowIcon4}
                              />
                            </View>
                          </View>
                        </TouchableOpacity>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyMessage}>
                  No sessions scheduled for this day
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
      <BottomNav active="Schedule" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    marginTop: 35,
    marginBottom: 25,
  },
  headerTitle: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 30,
    lineHeight: 33,
    color: '#494949',
  },
  searchContainer: {
    marginHorizontal: 16,
    marginBottom: 31,
    height: 43,
    backgroundColor: 'rgba(173, 173, 173, 0.21)',
    borderRadius: 7,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
  },
  searchIcon: {
    width: 19,
    height: 19,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Outfit',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 15,
    letterSpacing: -0.1,
    color: '#959595',
    paddingTop: 13,
    paddingBottom: 15,
  },
  todaysPlanBanner: {
    marginHorizontal: 16,
    marginBottom: 42,
    height: 172,
    borderRadius: 8,
    overflow: 'hidden',
  },
  bannerImageContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F7BCBC',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerGradient: {
    flex: 1,
    paddingHorizontal: 19,
    paddingVertical: 19,
    justifyContent: 'flex-end',
  },
  bannerContent: {
    marginBottom: 3,
  },
  bannerTitle: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 20,
    lineHeight: 22,
    color: '#FFFFFF',
    marginBottom: 10,
  },
  bannerDescription: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 12,
    lineHeight: 16,
    color: '#FFFFFF',
    width: 204,
  },
  bannerButton: {
    position: 'absolute',
    right: 18,
    bottom: 25,
  },
  arrowCircle: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarSection: {
    paddingHorizontal: 16,
    marginBottom: 40,
  },
  calendarTitle: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 22,
    lineHeight: 24,
    color: '#494949',
    marginBottom: 24,
  },
  weekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayColumn: {
    alignItems: 'center',
  },
  dayLabel: {
    fontFamily: 'Satoshi-Medium',
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    color: '#494949',
    marginBottom: 5,
  },
  dateContainer: {
    width: 48,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#FEF0C5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateContainerSelected: {
    backgroundColor: '#494949',
  },
  dateText: {
    fontFamily: 'Satoshi-Medium',
    fontSize: 15,
    lineHeight: 22,
    color: '#494949',
  },
  dateTextSelected: {
    color: '#FFFFFF',
  },
  dotIndicator: {
    position: 'absolute',
    bottom: 4,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#B95E82',
  },
  dotIndicatorSelected: {
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    paddingVertical: 40,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginHorizontal: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#D32F2F',
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 14,
    fontFamily: 'Satoshi-Regular',
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
    fontWeight: '600',
  },
  scheduleCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 22,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 39,
  },
  scheduleHeaderLeft: {
    flex: 1,
  },
  sessionsCount: {
    fontFamily: 'Satoshi-Medium',
    fontSize: 14,
    lineHeight: 19,
    color: 'rgba(73, 73, 73, 0.8)',
    marginBottom: 5,
  },
  scheduleDate: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 20,
    lineHeight: 22,
    color: '#000000',
  },
  scheduleHeaderRight: {
    flexDirection: 'row',
    gap: 12,
  },
  navArrowLeft: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F1F3F0',
    justifyContent: 'center',
    alignItems: 'center',
    top: 8,
  },
  navArrowRight: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#676767',
    justifyContent: 'center',
    alignItems: 'center',
    top: 8,
  },
  navArrowIcon: {
    width: 28,
    height: 28,
  },
  arrowBgCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#B95E82',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navArrowIcon4: {
    width: 14,
    height: 14,
    resizeMode: 'contain',
  },
  sessionsList: {
    paddingBottom: 20,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 18,
  },
  timeLabel: {
    fontFamily: 'Satoshi-Medium',
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'right',
    color: '#000000',
    width: 43,
    marginLeft: -6,
  },
  timeDivider: {
    flex: 1,
    height: 1,
    backgroundColor: '#CCCCCC',
    marginLeft: 20,
    marginTop: 11,
  },
  sessionCard: {
    borderRadius: 12,
    padding: 18,
    marginBottom: 43,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  sessionLeft: {
    marginRight: 23,
  },
  sessionImageContainer: {
    width: 81,
    height: 81,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    marginBottom: 16,
  },
  sessionImage: {
    width: '100%',
    height: '100%',
  },
  sessionInfo: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 17,
  },
  sessionTitle: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 20,
    lineHeight: 22,
    color: '#FFFFFF',
    marginBottom: 6,
  },
  sessionDuration: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 14,
    lineHeight: 19,
    color: '#FFFFFF',
  },
  sessionTrainer: {
    fontFamily: 'Satoshi-Medium',
    position: 'absolute',
    top: 95,
    minWidth: 131,
    fontSize: 14,
    lineHeight: 19,
  },
  sessionPlayButton: {
    marginTop: 85,
    marginRight: 4,
  },
  playButtonCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#B95E82',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonCircleDark: {
    backgroundColor: '#000000',
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyMessage: {
    fontSize: 16,
    color: '#999',
    fontFamily: 'Satoshi-Medium',
  },
});

export default WeeklyScheduleScreen;
