import React, { useState } from 'react';
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
} from 'react-native';
import { ScheduleImages } from '../../assets/images/schedule';
import BottomNav from '../../components/BottomNav';

const ScheduleScreen = () => {
  const [selectedDate, setSelectedDate] = useState(10);

  const weekDays = [
    { day: 'Sun', date: 9 },
    { day: 'Mon', date: 10 },
    { day: 'Tue', date: 11 },
    { day: 'Wed', date: 12 },
    { day: 'Thur', date: 13 },
    { day: 'Fri', date: 14 },
    { day: 'Sat', date: 15 },
  ];

  const sessions = [
    {
      id: 1,
      time: '10:00 AM',
      title: 'Morning Yoga Flow',
      duration: '12 min - Beginner',
      trainer: 'Trainer: James Chen',
      backgroundColor: '#030416',
      color: '#D4D4D4',
    },
    {
      id: 2,
      time: '12:00 AM',
      title: 'Morning Yoga Flow',
      duration: '12 min - Beginner',
      trainer: 'Trainer: James Chen',
      backgroundColor: '#B95E82',
      color: '#FFFFFF',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Your Schedule</Text>
        </View>

        {/* Search Bar - top: 145px */}
        <View style={styles.searchContainer}>
          <View>
            <Image
              source={ScheduleImages.searchIcon}
              style={styles.searchIcon}
            />
          </View>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by Sessions name"
            placeholderTextColor="#959595"
          />
        </View>

        {/* Today's Plan Banner - top: 219px */}
        <View style={styles.todaysPlanBanner}>
          <View style={styles.bannerImageContainer}>
            <ImageBackground 
              source={ScheduleImages.PlanImage}
              style={styles.bannerImage}
              resizeMode="cover"
            >
              {/* GRADIENT IMAGE ON TOP */}
              <ImageBackground
                source={ScheduleImages.BlackGradient}
                style={styles.bannerGradient}
                resizeMode="cover"
              >
                <View style={styles.bannerContent}>
                  <Text style={styles.bannerTitle}>Today's Skyborne Plan</Text>
                  <Text style={styles.bannerDescription}>
                    See your Yoga, Fitness, Zumba, and Nutrition sessions in one timeline.
                  </Text>
                </View>

                <TouchableOpacity style={styles.bannerButton}>
                  <View>
                    <ImageBackground style={styles.arrowCircle} source={ScheduleImages.ArrowImage}/>
                  </View>
                </TouchableOpacity>
              </ImageBackground>
            </ImageBackground>
          </View>
        </View>

        {/* Calendar Section - top: 433px */}
        <View style={styles.calendarSection}>
          <Text style={styles.calendarTitle}>December 2025,</Text>
          
          {/* Week Days and Dates - top: 481px */}
          <View style={styles.weekContainer}>
            {weekDays.map((item, index) => (
              <View key={index} style={styles.dayColumn}>
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
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* Sessions Schedule Card - top: 592px */}
        <View style={styles.scheduleCard}>
          {/* Card Header */}
          <View style={styles.scheduleHeader}>
            <View style={styles.scheduleHeaderLeft}>
              <Text style={styles.sessionsCount}>4 Sessions</Text>
              <Text style={styles.scheduleDate}>Monday, 10</Text>
            </View>
            <View style={styles.scheduleHeaderRight}>
              <TouchableOpacity style={styles.navArrowLeft}>
                <Image
                  source={ScheduleImages.ArrowImage2}
                  resizeMode="contain"
                />
              </TouchableOpacity>

              <TouchableOpacity style={styles.navArrowRight}>
                <Image
                  source={ScheduleImages.ArrowImage3}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Sessions List */}
          <View style={styles.sessionsList}>
            {sessions.map((session) => {
              const [time, period] = session.time.split(' ');
              return (
                <View key={session.id}>
                  {/* Time Label */}
                  <View style={styles.timeRow}>
                    <Text style={styles.timeLabel}>
                      {time}{'\n'}{period}
                    </Text>
                    <View style={styles.timeDivider} />
                  </View>

                  {/* Session Card */}
                  <View style={[styles.sessionCard, { backgroundColor: session.backgroundColor }]}>
                    {/* Left: Image and Trainer */}
                    <View style={styles.sessionLeft}>
                      <View style={styles.sessionImageContainer}>
                        <ImageBackground
                          source={ScheduleImages.SessionImage}
                          style={styles.sessionImage}
                          resizeMode="cover"
                        />
                      </View>
                      <Text style={[styles.sessionTrainer, {color: session.color}]}>{session.trainer}</Text>
                    </View>
                    
                    {/* Middle: Title and Duration */}
                    <View style={styles.sessionInfo}>
                      <Text style={styles.sessionTitle}>{session.title}</Text>
                      <Text style={styles.sessionDuration}>{session.duration}</Text>
                    </View>
                  
                    {/* Right: Play Button */}
                    <TouchableOpacity style={styles.sessionPlayButton}>
                      <View
                        style={[
                          styles.playButtonCircle,
                          session.backgroundColor === '#B95E82' && styles.playButtonCircleDark,
                        ]}
                      >
                        <Image source={ScheduleImages.ArrowImage4}/>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
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
    marginTop: 50,
    marginBottom: 25,
  },
  headerTitle: {
    fontFamily: 'Satoshi',
    fontWeight: '700',
    fontSize: 30,
    lineHeight: 33,
    color: '#494949',
  },

  // Search Bar - top: 145px
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
    justifyContent: 'center',
    alignItems: 'center',
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

  // Today's Plan Banner - top: 219px
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
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 19,
    paddingVertical: 19,
    justifyContent: 'flex-end',
  },
  bannerContent: {
    marginBottom: 3,
  },
  bannerTitle: {
    fontFamily: 'Satoshi',
    fontWeight: '700',
    fontSize: 20.1125,
    lineHeight: 22,
    color: '#FFFFFF',
    marginBottom: 10,
  },
  bannerDescription: {
    fontFamily: 'Satoshi',
    fontWeight: '400',
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
    // borderRadius: 14,
    // backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Calendar Section - top: 433px
  calendarSection: {
    paddingHorizontal: 16,
    marginBottom: 40.36,
  },
  calendarTitle: {
    fontFamily: 'Satoshi',
    fontWeight: '700',
    fontSize: 22,
    lineHeight: 24,
    color: '#494949',
    marginBottom: 24,
  },

  // Week Container - top: 481px
  weekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayColumn: {
    alignItems: 'center',
  },
  dayLabel: {
    fontFamily: 'Satoshi',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    color: '#494949',
    marginBottom: 5,
  },
  dateContainer: {
    width: 48.34,
    height: 43.64,
    borderRadius: 8,
    backgroundColor: '#FEF0C5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateContainerSelected: {
    backgroundColor: '#494949',
  },
  dateText: {
    fontFamily: 'Satoshi',
    fontWeight: '500',
    fontSize: 15.278,
    lineHeight: 22,
    color: '#494949',
  },
  dateTextSelected: {
    color: '#FFFFFF',
  },

  // Schedule Card - top: 592px
  scheduleCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 22,
    paddingHorizontal: 16,
    marginTop: 0,
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
    fontFamily: 'Satoshi',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 19,
    color: 'rgba(73, 73, 73, 0.8)',
    marginBottom: 5,
  },
  scheduleDate: {
    fontFamily: 'Satoshi',
    fontWeight: '700',
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
  // arrowLeft: {
  //   width: 12,
  //   height: 1.2,
  //   backgroundColor: '#000000',
  //   transform: [{ rotate: '180deg' }],
  // },
  // arrowRight: {
  //   width: 12,
  //   height: 1.2,
  //   backgroundColor: '#FFFFFF',
  // },

  // Sessions List
  sessionsList: {
    paddingBottom: 20,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 17.64,
  },
  timeLabel: {
    fontFamily: 'Satoshi',
    fontWeight: '500',
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
    marginBottom: 43.36,
    flexDirection: 'row',
    alignItems: 'flex-start', // Changed from 'center' to 'flex-start'
    
  },
  sessionLeft: {
    // New style for left section
    marginRight: 23,
  },
  sessionImageContainer: {
    width: 81,
    height: 81,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    marginBottom: 16, // Space between image and trainer text
  },
  sessionImage: {
    width: '100%',
    height: '100%',
  },
  sessionInfo: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 17, // Aligns with image top + some offset
  },
  sessionTitle: {
    fontFamily: 'Satoshi',
    fontWeight: '700',
    fontSize: 20,
    lineHeight: 22,
    color: '#FFFFFF',
    marginBottom: 6,
  },
  sessionDuration: {
    fontFamily: 'Satoshi',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 19,
    color: '#FFFFFF',
  },
  sessionTrainer: {
    fontFamily: 'Satoshi',
    position:'absolute',
    top:95,
    minWidth:131,
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 19,
    // color: '#D4D4D4',
  },
  sessionPlayButton: {
    marginTop: 85,
    marginRight:4,
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
});

export default ScheduleScreen;