import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, ScrollView } from 'react-native';
import GradientBackground from '../../components/GradientBackground';
import { HomeImages } from '../../assets/images/home';
import BottomNav from '../../components/BottomNav';

const HomeScreen = () => {

  const MAX_WATER = 2.5; // liters
  const STEP = 0.25; // 250ml

  const [currentWater, setCurrentWater] = useState(2.0);
  const percentage = Math.round((currentWater / MAX_WATER) * 100);

  const increaseWater = () => {
    setCurrentWater(prev =>
      prev + STEP <= MAX_WATER ? +(prev + STEP).toFixed(2) : prev
    );
  };

  const decreaseWater = () => {
    setCurrentWater(prev =>
      prev - STEP >= 0 ? +(prev - STEP).toFixed(2) : prev
    );
  };

  const SessionImages = [{
    title:'Yoga Morning Flow',
    image: require('../../assets/images/home/session-image.png'),
    subtitle: 'Gentle energy boost for your day'
  },
  {
    title:'Strength Training',
    image: require('../../assets/images/home/session-image.png'),
    subtitle: 'Build muscle and strength'
  }
  ]
  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={styles.scrollContainer}
        >
          {/* Top Header with Menu and Search */}
        <View style={styles.header}>
            <View style={styles.hamburgerContainer}>
              <Image source={HomeImages.hamburgerMenu} style={styles.hamburgerIcon} />
            </View>

            <Text style={styles.headerTitle}>Skyborne Drop</Text>

            <View style={styles.searchContainer}>
              <Image source={HomeImages.searchIcon} style={styles.searchIcon} />
            </View>
          </View>
          {/* User Profile Section */}
          <View style={styles.profileContainer}>
            <Image source={HomeImages.profileImage} style={styles.profileImage} />

            <View style={styles.profileTextContainer}>
              <Text style={styles.greetingText}>Good Morning, John</Text>
              <Text style={styles.subGreetingText}>
                Choose yours workout today
              </Text>
            </View>
          </View>

          {/* Wellness Score Card */}
       <View style={styles.wellnessCard}>
            <Text style={styles.wellnessTitle}>Your Wellness Score</Text>

            <View style={styles.scoreRow}>
              {/* LEFT CONTENT */}
              <View style={styles.scoreLeft}>
                <Text style={styles.scoreText}>85/100</Text>

                <Text style={styles.scoreSubText}>
                  You're doing great! Keep up the momentum.
                </Text>

                <TouchableOpacity style={styles.primaryButton}>
                  <Text style={styles.primaryButtonText}>Get Started</Text>
                </TouchableOpacity>
              </View>

              {/* RIGHT IMAGE */}
              <View style={styles.imageContainer}>
                <Image
                  source={HomeImages.getStartedImage}
                  style={styles.getStartedImage}
                  resizeMode="contain"
                />
              </View>
            </View>
          </View>

          {/* Top Sessions Header */}
         <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Discover today’s Top Sessions</Text>
            <Text style={styles.viewAllText}>View all</Text>
          </View>

          {/* Top Sessions Cards */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.sessionsScroll}
            style={styles.sessionsContainer}
          >
            {/* Session Card 1 */}
            {
              SessionImages.map((session, index) => (
                <View key={index} style={styles.sessionCard}>
                    <View style={styles.sessionContent}>
                    <Text style={styles.sessionTitle}>{session.title}</Text>
                    <Text style={styles.sessionSubtitle}>{session.subtitle}</Text>
                  </View>
                  <Image
                    source={session.image}
                    style={styles.sessionImage}
                    resizeMode="cover"
                  />
                  <TouchableOpacity style={styles.joinButton}>
                    <Text style={styles.joinButtonText}>Join now</Text>


<View style={styles.arrowContainer}>
  <Image 
    source={require('../../assets/images/arrow-black.png')} 
    style={styles.arrow} 
  />
</View>
                  </TouchableOpacity>
                </View>
              ))
            }

            {/* Session Card 2 */}
         
          </ScrollView>

          {/* Upcoming Classes Section */}
          <View style={styles.upcomingSection}>
            <Text style={styles.upcomingTitle}>Upcoming Classes</Text>
            
            <View style={styles.classCard}>
              <Image
                source={require('../../assets/images/home/yoga-flow.png')}
                style={styles.classImage}
                resizeMode="cover"
              />
              <View style={styles.classOverlay}>
                <View style={styles.classContent}>
                  <Text style={styles.className}>Yoga Flow</Text>
                  <Text style={styles.classTime}>Today • 9:00 AM (Los Angeles)</Text>
                </View>
                <TouchableOpacity style={styles.classPlayButton}>
                  <Image 
    source={require('../../assets/images/arrow-white.png')} 
    style={styles.arrow} 
  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Health Section */}
          <View style={styles.healthSection}>
            <Text style={styles.healthTitle}>Health</Text>
            
            {/* Hydration Card */}
            <View style={styles.hydrationCard}>
              <View style={styles.hydrationContent}>
                <Text style={styles.hydrationLabel}>Hydration</Text>
                {/* <Text style={styles.hydrationValue}>2.0L / 2.5L</Text> */}
                <Text style={styles.hydrationValue}>
                  {currentWater}L / {MAX_WATER}L
                </Text>
                <View style={styles.hydrationButtons}>
                  <TouchableOpacity style={styles.minusButton} onPress={decreaseWater}>
                    <Text style={styles.minusIcon}>−</Text>
                  </TouchableOpacity>
                  <Text style={styles.waterAmount}>250ml</Text>
                  <TouchableOpacity style={styles.plusButton} onPress={increaseWater}>
                    <Text style={styles.plusIcon}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.percentageBox}>
                <Text style={styles.percentageValue}>{percentage}%</Text>
              </View>
            </View>
          </View>

          {/* This Week Activity Section */}
          <View style={styles.weekActivitySection}>
            <Text style={styles.weekActivityTitle}>This Week Activity</Text>
            
            <View style={styles.weekActivityCard}>
              <View style={styles.weekHeader}>
                <Text style={styles.weekLabel}>This Week</Text>
                <Text style={styles.weekCompleted}>3/4 completed</Text>
              </View>
              
              <View style={styles.progressBar}>
                <View style={styles.progressFill} />
              </View>
              
              <View style={styles.weekDays}>
                <TouchableOpacity style={[styles.dayButton, styles.dayButtonActive]}>
                  <Text style={styles.dayButtonTextActive}>M</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.dayButton, styles.dayButtonActive]}>
                  <Text style={styles.dayButtonTextActive}>T</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.dayButton, styles.dayButtonActive]}>
                  <Text style={styles.dayButtonTextActive}>W</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.dayButton}>
                  <Text style={styles.dayButtonText}>T</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.dayButton}>
                  <Text style={styles.dayButtonText}>F</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.dayButton}>
                  <Text style={styles.dayButtonText}>S</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.dayButton}>
                  <Text style={styles.dayButtonText}>S</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
        <BottomNav active="Home" />
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
   safeArea: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 32,
  },

  /* HEADER */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 35,
    marginBottom: 40,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'Satoshi-Medium',
    fontSize: 15,
    color: '#494949',
  },
  arrowContainer:{
    width: 28,
    height: 28,
    backgroundColor:"#FFFFFF",
    borderRadius:100,
    justifyContent: 'center',
    alignItems: 'center',
    display:'flex'
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

  /* GREETING */
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

  /* SECTIONS */
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 25,
  },
  sectionTitle: {
    fontFamily: 'Satoshi-Bold',
    fontWeight: 'bold',
    fontSize: 20,
    lineHeight: 22, // 110%
    color: '#494949',
    maxWidth: 158,
  },
  viewAllText: {
    fontFamily: 'Satoshi-Medium',
    fontSize: 16,
    lineHeight: 16, // 100%
    color: '#B95E82',
    textAlign: 'center',
  },
  /* WELLNESS */
  wellnessCard: {
    width: 380,
    height: 250,
    backgroundColor: '#B95E82',
    borderRadius: 12,
    paddingLeft: 22,
    paddingTop: 30,
    paddingRight: 12,
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
    fontSize: 44,
    lineHeight: 48,
    color: '#FFFFFF',
    marginTop: 6,
    fontWeight: 'bold',
  },
  getStartedImage: {
    width: 215,
    height: 329,
  },
  scoreSubText: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 14,
    lineHeight: 14,
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
    fontWeight: 'bold',
  },
  imageContainer: {
    width: '45%',
    height: 180,
    marginTop: -19,
    marginRight: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  // Top Header
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  menuIcon: {
    width: 24,
    height: 24,
  },
  appName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3A3A3A',
  },
  searchButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#B95E82',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Profile Section
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  profileAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 12,
  },
  profileText: {
    flex: 1,
  },
  greeting: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3A3A3A',
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '400',
    color: '#999999',
    marginTop: 4,
  },
  wellnessImage: {
    width: '100%',
    height: '100%',
  },
  wellnessOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(185, 94, 130, 0.85)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  wellnessContent: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 20,
  },
  wellnessLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#FFFFFF',
    opacity: 0.9,
  },
  wellnessScore: {
    fontSize: 56,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 8,
  },
  wellnessMessage: {
    fontSize: 14,
    fontWeight: '400',
    color: '#FFFFFF',
    marginTop: 12,
    lineHeight: 20,
  },
  getStartedButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 24,
    alignSelf: 'flex-start',
    marginTop: 16,
  },
  getStartedText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#B95E82',
  },
  // Section Header
  sectionHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  sectionTitleBold: {
    fontSize: 20,
    fontWeight: '700',
    color: '#3A3A3A',
    marginTop: 2,
  },
  // Sessions Container
  sessionsContainer: {
    marginHorizontal: -16,
  },
  sessionsScroll: {
    paddingHorizontal: 16,
    gap: 16,
  },
  // Session Card
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
    marginRight:15,
    marginHorizontal:15,
    marginTop:19,
    height: 150,
    borderRadius: 10,
  },
  sessionContent: {
    paddingHorizontal: 15,
    paddingTop: 26,
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
  arrowIcon: {
    marginLeft: 8,
  },
  arrow: {
    fontSize: 24,
    marginBottom: 0,
    color: '#000000',
    fontWeight: '600',
  },
  // Upcoming Classes
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
    height: 335,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  classImage: {
    width: '100%',
    height: '100%',
  },
  classOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#fff',
    // justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    bottom:12,
    width:'93%',
    marginHorizontal:12,
    height:82,
    top:'auto',
    left:0,
    right:0,
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
  playIcon: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  // Health Section
  healthSection: {
    paddingTop: 40,
    marginBottom: 28,
  },
  healthTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#494949',
    marginBottom: 25,
  },
  hydrationCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#ECECEC',
  },
  hydrationContent: {
    flex: 1,
  },
  hydrationLabel: {
    fontSize: 20,
    fontWeight: '700',
    color: '#494949',
  },
  hydrationValue: {
    fontSize: 14,
    fontWeight: '400',
    color: '#B95E82',
    marginTop: 4,
  },
  hydrationButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 60,
    gap: 14,
    display: 'flex',
  },
  minusButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF7DD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  minusIcon: {
    fontSize: 20,
    color: '#B95E82',
    fontWeight: '600',
  },
  waterAmount: {
    fontSize: 13,
    fontWeight: '700',
    color: '#707070',
  },
  plusButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#B95E82',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusIcon: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  percentageBox: {
    width: 150,
    height: 160,
    borderRadius: 20,
    backgroundColor: 'rgba(185, 94, 130, 0.2)',
    borderWidth: 3,
    borderColor: '#B95E82',
    borderStyle: 'solid',
    justifyContent: 'center',
    alignItems: 'center',
    // background: 'linear-gradient(0deg,rgba(185, 94, 130, 1) 0%, rgba(185, 94, 130, 1) 80%, rgba(255, 255, 255, 1) 100%)',
  },
  percentageValue: {
    fontSize: 30,
    fontWeight: '700',
    color: '#707070',
  },
  // This Week Activity Section
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
  weekCompleted: {
    fontSize: 14,
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
    width: '65%',
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
  // Bottom Navigation Bar
  bottomNavBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E1E1E1',
    borderStyle:'solid',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  navIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  navLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#B95E82',
  },
  navLabelInactive: {
    fontSize: 14,
    fontWeight: '500',
    color: '#707070',
    opacity:0.4,
  },

  
});

export default HomeScreen;