import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Pressable,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import { ExploreImages } from '../../assets/images/explore';
import BottomNav from '../../components/BottomNav';
import { useHomeViewModel } from '../../viewmodels/useHomeViewModel';
import { getUserRegion, getRegionDateFromISO } from '../../utils/timezoneUtils';
import { ArrowRight, ArrowLeft } from 'lucide-react-native';
import { useRef } from 'react';

interface UserRegion {
  timezone: string;
  region: string;
}

const ExploreScreen = ({ navigation }: any) => {
  const [userRegion, setUserRegion] = useState<UserRegion | null>(null);
  const [isRegionLoading, setIsRegionLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearchLoading, setIsSearchLoading] = useState(false);

  const categories = [
    {
      id: 1,
      title: 'Yoga',
      source: ExploreImages.trending1,
    },
    {
      id: 2,
      title: 'Fitness Classes',
      source: ExploreImages.fitness,
    },
    {
      id: 3,
      title: 'Zumba Dance',
      source: ExploreImages.zumba,
    },
    {
      id: 4,
      title: 'Diet & Nutrition',
      source: ExploreImages.diet,
    },
  ];

  const categoryScrollRef = useRef<ScrollView>(null);
  const SCROLL_OFFSET = 300;
  const scrollX = useRef(0);
  const CARD_WIDTH = 299; 

  const { upcomingMeetings, isLoading, error, fetchSearch } = useHomeViewModel();

  const handleClassPress = (classId: string) => {
    navigation.navigate('ClassDetails', { classId });
  };

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

  // Handle search with debounce
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchInput.trim().length > 0) {
        handleSearch(searchInput);
      } else {
        // Clear search if input is empty
        setHasSearched(false);
        setSearchResults([]);
      }
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(debounceTimer);
  }, [searchInput]);

  // Perform the search
  const handleSearch = async (query: string) => {
    if (query.trim().length === 0) {
      setHasSearched(false);
      setSearchResults([]);
      return;
    }

    setIsSearchLoading(true);
    setHasSearched(true);

    try {
      const result = await fetchSearch(query);
      
      if (result.success && result.data) {
        const meetings = result.data.upcomingMeetings || result.data.upcoming?.meetings || [];
        setSearchResults(meetings);
        console.log('✅ Search successful:', meetings.length, 'results found');
      } else {
        setSearchResults([]);
        console.warn('⚠️ Search returned no results');
      }
    } catch (err) {
      console.error('❌ Search error:', err);
      setSearchResults([]);
    } finally {
      setIsSearchLoading(false);
    }
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchInput('');
    setHasSearched(false);
    setSearchResults([]);
  };

  // Determine which classes to display
  const displayedClasses = hasSearched ? searchResults : upcomingMeetings;
  const upcomingClasses = displayedClasses.slice(0, 5);

  // Dynamic upcoming class card
  const DynamicSessionCard = ({ meeting }: any) => {
    // Find region-specific info from meeting regions array
    const regionInfo = meeting?.regions?.find(
      (r: any) => r.region === userRegion?.region,
    );

    // Fallback to first region if user region not found
    const displayRegionInfo = regionInfo || meeting?.regions?.[0];

    // Extract the pre-formatted localTime from the API response
    const formattedTime = displayRegionInfo?.localTime || 'N/A';
    const timezone = displayRegionInfo?.timezone || userRegion?.timezone;

    // Get the correct date by converting UTC ISO to region timezone
    const formattedDate = getRegionDateFromISO(meeting.localTime, timezone);

    // Debug logging
    console.log('📅 Meeting Display Info:', {
      meetingTitle: meeting.title,
      userRegion: userRegion?.region,
      meetingISOTime: meeting.localTime,
      displayRegionInfo,
      regionTimezone: timezone,
      formattedDate,
      formattedTime,
    });

    return (
      <Pressable 
        style={styles.sessionCard}
        onPress={() => handleClassPress(meeting._id)}
      >
        <View style={styles.sessionImageContainer}>
          <ImageBackground
            source={{uri:'https://skyborne-images.s3.ap-south-1.amazonaws.com/session-image.png'}}
            style={styles.sessionImage}
            resizeMode="cover"
          />
          <View style={styles.sessionImagePlaceholder} />
        </View>
        <View style={styles.sessionInfo}>
          <Text style={styles.sessionTitle}>
            {meeting.title
              ?.toLowerCase()
              .replace(/\b\w/g, (c: string) => c.toUpperCase())}
          </Text>
          <Text style={styles.sessionDuration}>
            {formattedDate} • {formattedTime} ({meeting.service?.title})
          </Text>
          <Pressable
            style={styles.sessionPlayButton}
            onPress={() => handleClassPress(meeting._id)}
          >
            <View style={styles.playButtonCircle}>
              <View style={styles.playIcon}>
                <View style={styles.playLineMiddle} />
                <View style={styles.playLineTop} />
                <View style={styles.playLineBottom} />
              </View>
            </View>
          </Pressable>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Explore Sessions</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchIconWrapper}>
            <View style={styles.searchIcon} />
          </View>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by Classes name"
            placeholderTextColor="#959595"
            value={searchInput}
            onChangeText={setSearchInput}
            returnKeyType="search"
          />
          {searchInput.length > 0 && (
            <Pressable 
              style={styles.clearButton}
              onPress={handleClearSearch}
            >
              <Text style={styles.clearButtonText}>✕</Text>
            </Pressable>
          )}
        </View>

        {/* Quick Start Banner - Hidden when searching */}
        {!hasSearched && (
          <View style={styles.quickStartBanner}>
            <View style={styles.bannerImageContainer}>
              <ImageBackground
                source={ExploreImages.meditation}
                style={styles.bannerImage}
                resizeMode="cover"
              >
                <View style={styles.bannerGradient}>
                  <View style={styles.bannerContent}>
                    <Text style={styles.bannerTitle}>Quick Start</Text>
                    <Text style={styles.bannerDescription}>
                      Start a Skyborne workout instantly just press play and move.
                    </Text>
                  </View>
                </View>
              </ImageBackground>
            </View>
          </View>
        )}

        {/* Trending Categories Section - Hidden when searching */}
        {!hasSearched && (
          <>
            <View style={styles.sectionHeaderWithAction}>
              <Text style={styles.sectionTitle}>Trending for You</Text>

              <View style={{ flexDirection: 'row', gap: 16 }}>
                {/* LEFT ARROW */}
                <Pressable
                  onPress={() => {
                    categoryScrollRef.current?.scrollTo({
                      x: Math.max(0, scrollX.current - CARD_WIDTH),
                      animated: true,
                    });
                  }}
                >
                  <ArrowLeft size={24} color="#494949" strokeWidth={2} />
                </Pressable>

                {/* RIGHT ARROW */}
                <Pressable
                  onPress={() => {
                    categoryScrollRef.current?.scrollTo({
                      x: scrollX.current + CARD_WIDTH,
                      animated: true,
                    });
                  }}
                >
                  <ArrowRight size={24} color="#494949" strokeWidth={2} />
                </Pressable>
              </View>
            </View>

            {/* Horizontal Scroll for Categories */}
            <ScrollView
              ref={categoryScrollRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoriesScroll}
              contentContainerStyle={styles.categoriesContent}
              onScroll={(e) => {
                scrollX.current = e.nativeEvent.contentOffset.x;
              }}
              scrollEventThrottle={16}
            >
              {categories.map((category, index) => (
                <Pressable
                  key={category.id}
                  style={[
                    styles.categoryCard,
                    index === 0 && styles.categoryCardFirst,
                    index === categories.length - 1 && { marginRight: 0 },
                  ]}
                >
                  <View style={styles.categoryImageContainer}>
                    <ImageBackground
                      source={category?.source}
                      style={styles.categoryImage}
                      resizeMode="cover"
                    >
                      <View style={styles.categoryInfo}>
                        <Text style={styles.categoryTitle}>{category.title}</Text>
                      </View>
                    </ImageBackground>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </>
        )}

        {/* Trending/Search Results Header */}
        <View style={styles.sectionHeaderWithAction}>
          <Text style={styles.sectionTitle}>
            {hasSearched ? `Search Results for "${searchInput}"` : 'Trending for You'}
          </Text>
          {!hasSearched && (
            <Pressable>
              <TouchableOpacity onPress={() => navigation.navigate('ViewAll')}>
                <Text style={styles.viewAllText}>View all</Text>
              </TouchableOpacity>
            </Pressable>
          )}
        </View>

        {/* Loading State */}
        {((isLoading && !hasSearched) || (isSearchLoading && hasSearched) || isRegionLoading) && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#B95E82" />
            <Text style={styles.loadingText}>
              {isRegionLoading
                ? 'Detecting your location...'
                : isSearchLoading
                ? 'Searching...'
                : 'Loading upcoming classes...'}
            </Text>
          </View>
        )}

        {/* Error State */}
        {error && !isLoading && !hasSearched && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Dynamic Upcoming Classes - Max 5 */}
        {!isLoading && !isRegionLoading && !isSearchLoading && upcomingClasses.length > 0 && (
          <View style={styles.sessionsList}>
            {upcomingClasses.map(meeting => (
              <DynamicSessionCard key={meeting._id} meeting={meeting} />
            ))}
          </View>
        )}

        {/* No results for search */}
        {hasSearched && !isSearchLoading && upcomingClasses.length === 0 && (
          <View style={styles.noRecordsContainer}>
            <Text style={styles.noRecordsText}>
              No classes found for "{searchInput}"
            </Text>
            <Pressable 
              style={styles.tryAgainButton}
              onPress={handleClearSearch}
            >
              <Text style={styles.tryAgainButtonText}>Clear Search</Text>
            </Pressable>
          </View>
        )}

        {/* Fallback when no upcoming classes and not searching */}
        {!hasSearched && !isLoading && !isRegionLoading && upcomingClasses.length === 0 && !error && (
          <View style={styles.noRecordsContainer}>
            <Text style={styles.noRecordsText}>No records found</Text>
          </View>
        )}
      </ScrollView>
      <BottomNav active="Explore" />
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
    fontFamily: 'Satoshi',
    fontWeight: '700',
    fontSize: 30,
    lineHeight: 33,
    color: '#494949',
  },
  noRecordsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noRecordsText: {
    fontSize: 16,
    fontFamily: 'Satoshi',
    color: '#959595',
    fontWeight: '400',
    marginBottom: 16,
  },
  tryAgainButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: '#B95E82',
    borderRadius: 6,
  },
  tryAgainButtonText: {
    fontSize: 14,
    fontFamily: 'Satoshi',
    color: '#FFFFFF',
    fontWeight: '600',
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
  searchIconWrapper: {
    width: 19,
    height: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  searchIcon: {
    width: 13,
    height: 13,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#959595',
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Outfit',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 15,
    letterSpacing: -0.1,
    color: '#494949',
    paddingVertical: 0,
  },
  clearButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  clearButtonText: {
    fontSize: 18,
    color: '#959595',
    fontWeight: '600',
  },

  quickStartBanner: {
    marginHorizontal: 16,
    marginBottom: 48,
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 19,
    paddingVertical: 19,
    justifyContent: 'flex-end',
  },
  bannerContent: {
    marginBottom: 10,
  },
  bannerTitle: {
    fontFamily: 'Satoshi',
    fontWeight: '700',
    fontSize: 20.1125,
    lineHeight: 22,
    width: 105,
    color: '#FFFFFF',
    marginBottom: 10,
  },
  bannerDescription: {
    fontFamily: 'Satoshi',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 16,
    color: '#FFFFFF',
    width: 200,
    height: 32,
  },

  sectionHeader: {
    paddingHorizontal: 16,
    marginBottom: 25,
  },
  sectionHeaderWithAction: {
    paddingHorizontal: 16,
    marginBottom: 34,
    marginTop: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontFamily: 'Satoshi',
    fontWeight: '700',
    fontSize: 20,
    lineHeight: 22,
    color: '#494949',
  },
  viewAllText: {
    fontFamily: 'Satoshi',
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
    color: '#B95E82',
  },

  categoriesScroll: {
    marginBottom: 0,
  },
  categoriesContent: {
    paddingLeft: 16,
    paddingRight: 32,
  },
  categoryCard: {
    width: 284,
    height: 354,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    marginRight: 15,
    overflow: 'hidden',
  },
  categoryCardFirst: {
    marginLeft: 0,
  },
  categoryImageContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F0F0F0',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  categoryInfo: {
    position: 'absolute',
    bottom: 21,
    left: 21,
  },
  categoryTitle: {
    fontFamily: 'Satoshi',
    fontWeight: '700',
    fontSize: 20,
    lineHeight: 22,
    color: '#FFFFFF',
    marginBottom: 7,
  },

  sessionsList: {
    paddingHorizontal: 16,
  },
  sessionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 31,
  },
  sessionImageContainer: {
    width: 111,
    height: 99,
    borderRadius: 6,
    marginRight: 25,
    overflow: 'hidden',
  },
  sessionImage: {
    width: '100%',
    height: '100%',
  },
  sessionImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F9D2D2',
  },
  sessionInfo: {
    flex: 1,
  },
  sessionTitle: {
    fontFamily: 'Satoshi',
    fontWeight: '700',
    fontSize: 20,
    lineHeight: 22,
    color: '#494949',
    marginBottom: 6,
  },
  sessionDuration: {
    fontFamily: 'Satoshi',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 19,
    color: '#050505',
  },
  sessionPlayButton: {
    marginTop: 18,
  },
  playButtonCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#B95E82',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
  },
  playIcon: {
    width: 12,
    height: 12,
    justifyContent: 'center',
  },
  playLineMiddle: {
    width: 10,
    height: 1.5,
    backgroundColor: '#FFFFFF',
  },
  playLineTop: {
    width: 5,
    height: 1.5,
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '45deg' }],
    position: 'absolute',
    top: 3,
    left: 5.5,
  },
  playLineBottom: {
    width: 5,
    height: 1.5,
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '-45deg' }],
    position: 'absolute',
    bottom: 3,
    left: 5.5,
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
    fontFamily: 'Satoshi',
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
    fontFamily: 'Satoshi',
  },
});

export default ExploreScreen;