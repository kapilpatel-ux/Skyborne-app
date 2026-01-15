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

const ExploreScreen = () => {
  const categories = [
    {
      id: 1,
      title: 'Yoga',
      source: ExploreImages.trending1,
      sessions: '100+ Sessions',
    },
    {
      id: 2,
      title: 'Fitness Classes',
      sessions: '100+ Sessions',
      source: ExploreImages.fitness,
    },
    {
      id: 3,
      title: 'Zumba Dance',
      sessions: '100+ Sessions',
      source: ExploreImages.zumba,
    },
    {
      id: 4,
      title: 'Diet & Nutrition',
      sessions: '100+ Sessions',
      source:ExploreImages.diet
    },
  ];

  const trendingSessions = [
    {
      id: 1,
      title: 'Morning Yoga Flow',
      duration: '12 min - Beginner',
      image: ExploreImages.yoga1,
    },
    {
      id: 2,
      title: 'Zumba Cardio Blast',
      duration: '25 min - Intermediate',
      image: ExploreImages.yoga2,
    },
    {
      id: 3,
      title: 'Gentle Back Stretch',
      duration: '8 min - All Levels',
      image: ExploreImages.yoga3,
    },
    {
      id: 4,
      title: 'Strength Core Builder',
      duration: '18 min - Beginner',
      image: ExploreImages.yoga4,
    },
    {
      id: 5,
      title: 'Restorative Yin Yoga',
      duration: '15 min - Beginner',
      image: ExploreImages.yoga5,
    },
  ];

  // Use home view model to fetch upcoming meetings
  const { upcomingMeetings, isLoading, error } = useHomeViewModel();

  // Get max 5 upcoming classes
  const upcomingClasses = upcomingMeetings.slice(0, 5);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Dynamic upcoming class card
  const DynamicSessionCard = ({ meeting }: any) => (
    <Pressable style={styles.sessionCard}>
      <View style={styles.sessionImageContainer}>
        <ImageBackground
          source={require('../../assets/images/home/session-image.png')}
          style={styles.sessionImage}
          resizeMode="cover"
        />
        <View style={styles.sessionImagePlaceholder} />
      </View>
      <View style={styles.sessionInfo}>
        <Text style={styles.sessionTitle}>{meeting.title}</Text>
        <Text style={styles.sessionDuration}>
          {new Date(meeting.localTime).toLocaleDateString()} •{' '}
          {formatTime(meeting.localTime)} ({meeting.service?.title})
        </Text>
        <Pressable style={styles.sessionPlayButton}>
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
          />
        </View>

        {/* Quick Start Banner */}
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

                <TouchableOpacity style={styles.bannerButton}>
                  <View style={styles.arrowCircle}>
                    <ImageBackground
                      source={ExploreImages.arrow}
                      style={styles.arrowImage}
                      resizeMode="contain"
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </View>
        </View>

        {/* Trending Categories Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Trending for You</Text>
        </View>

        {/* Horizontal Scroll for Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesScroll}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map((category, index) => (
            <Pressable
              key={category.id}
              style={[
                styles.categoryCard,
                index === 0 && styles.categoryCardFirst,
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
                    <Text style={styles.categorySessions}>
                      {category.sessions}
                    </Text>
                  </View>
                </ImageBackground>
              </View>
            </Pressable>
          ))}
        </ScrollView>

        {/* Trending Sessions Section - Dynamic */}
        <View style={styles.sectionHeaderWithAction}>
          <Text style={styles.sectionTitle}>Trending for You</Text>
          <Pressable>
            <Text style={styles.viewAllText}>View all</Text>
          </Pressable>
        </View>

        {/* Loading State */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#B95E82" />
            <Text style={styles.loadingText}>Loading upcoming classes...</Text>
          </View>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Dynamic Upcoming Classes - Max 5 */}
        {!isLoading && upcomingClasses.length > 0 && (
          <View style={styles.sessionsList}>
            {upcomingClasses.map(meeting => (
              <DynamicSessionCard key={meeting._id} meeting={meeting} />
            ))}
          </View>
        )}

        {/* Fallback when no upcoming classes */}
    {!isLoading && upcomingClasses.length === 0 && !error && (
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
    color: '#959595',
    paddingVertical: 0,
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
  bannerButton: {
    position: 'absolute',
    right: 18,
    bottom: 25,
  },
  arrowCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowImage: {
    width: 25,
    height: 25,
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
    paddingRight: 1,
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
  categorySessions: {
    fontFamily: 'Satoshi',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 19,
    color: '#FFFFFF',
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
