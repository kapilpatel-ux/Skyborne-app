import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
} from 'react-native';
import {
  Star,
  Dumbbell,
  ArrowLeft,
} from 'lucide-react-native';
import { Images } from '../../assets/images';

interface SessionHistoryItem {
  id: number;
  title: string;
  instructor: string;
  duration: string;
  category: string;
  date: string;
  feeling: string;
  rating: number;
  image: ImageSourcePropType;
}

const SessionHistoryScreen = ({ navigation }: { navigation: any }) => {
  // Toggle this to see different states
  // const hasCompletedSessions = true; // Set to false to see empty state
  const hasCompletedSessions = false; // Set to false to see empty state

  const sessionHistory: SessionHistoryItem[] = [
    {
      id: 1,
      title: 'Morning Yoga Flow',
      instructor: 'Sarah Chen',
      duration: '50 min',
      category: 'Yoga',
      date: 'Fri, Jan 9',
      feeling: 'Strong',
      rating: 4.0,
      image: Images.sessionHistory,
    },
    {
      id: 2,
      title: 'Morning Yoga Flow',
      instructor: 'Sarah Chen',
      duration: '50 min',
      category: 'Yoga',
      date: 'Fri, Jan 9',
      feeling: 'Strong',
      rating: 4.0,
      image: Images.sessionHistory,
    },
    {
      id: 3,
      title: 'Morning Yoga Flow',
      instructor: 'Sarah Chen',
      duration: '50 min',
      category: 'Yoga',
      date: 'Fri, Jan 9',
      feeling: 'Strong',
      rating: 4.0,
      image: Images.sessionHistory,
    },
    {
      id: 4,
      title: 'Morning Yoga Flow',
      instructor: 'Sarah Chen',
      duration: '50 min',
      category: 'Yoga',
      date: 'Fri, Jan 9',
      feeling: 'Strong',
      rating: 4.0,
      image: Images.sessionHistory,
    },
  ];

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <View style={styles.emptyStateIconWrapper}>
        <Dumbbell size={80} color="#B95E82" strokeWidth={1.5} />
      </View>
      <Text style={styles.emptyStateTitle}>No completed sessions yet</Text>
      <Text style={styles.emptyStateDescription}>
        Your completed classes will appear here
      </Text>
      <TouchableOpacity style={styles.exploreButton}>
        <Text style={styles.exploreButtonText}>Explore Classes</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSessionList = () => (
    <View style={styles.sessionListContainer}>
      {sessionHistory.map((session) => (
        <TouchableOpacity key={session.id} style={styles.sessionCard}>
          {/* Session Image */}
          <View style={styles.sessionImageContainer}>
            <Image
              source={session.image}
              style={styles.sessionImage}
              resizeMode="cover"
            />
          </View>

          {/* Session Content */}
          <View style={styles.sessionContent}>
            {/* Title and Instructor */}
            <Text style={styles.sessionTitle}>{session.title}</Text>
            <Text style={styles.sessionInstructor}>{session.instructor}</Text>

            {/* Session Details */}
            <View style={styles.sessionDetails}>
              <View style={styles.detailItem}>
                <Image source={Images.sandWatch} />
                <Text style={styles.detailText}>{session.duration}</Text>
              </View>

              <View style={styles.detailItem}>
                <Image source={Images.flower}/>
                <Text style={styles.detailText}>{session.category}</Text>
              </View>

              <View style={styles.detailItem}>
                <Image source={Images.calendarIcon}/>
                <Text style={styles.detailText}>{session.date}</Text>
              </View>
            </View>

            {/* Divider */}
            <View style={styles.sessionDivider} />

            {/* Footer */}
            <View style={styles.sessionFooter}>
              <Text style={styles.feelingText}>
                You felt: <Text style={styles.feelingValue}>{session.feeling}</Text>
              </Text>
              <View style={styles.ratingContainer}>
                <Star size={17} color="#F59E0B" fill="#F59E0B" strokeWidth={2} />
                <Text style={styles.ratingText}>{session.rating}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft size={24} color="#494949" strokeWidth={2} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Session History</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {hasCompletedSessions ? renderSessionList() : renderEmptyState()}
        </ScrollView>
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
  },
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 35,
    paddingBottom: 37,
  },
  backButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Satoshi-Bold',
    fontWeight: '700',
    fontSize: 20,
    lineHeight: 22,
    color: '#494949',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 24,
  },
  scrollView: {
    flex: 1,
  },
  // Empty State
  emptyStateContainer: {
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingTop: 24,
  },
  emptyStateIconWrapper: {
    width: 150,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  emptyStateTitle: {
    fontFamily: 'Satoshi-Bold',
    fontWeight: '700',
    fontSize: 20,
    lineHeight: 22,
    color: '#494949',
    textAlign: 'center',
    marginBottom: 5,
  },
  emptyStateDescription: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 14,
    lineHeight: 19,
    color: '#050505',
    textAlign: 'center',
    marginBottom: 30,
  },
  exploreButton: {
    width: 346.08,
    height: 54.3,
    backgroundColor: '#B95E82',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exploreButtonText: {
    fontFamily: 'Satoshi-Medium',
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 22,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  // Session List
  sessionListContainer: {
    paddingHorizontal: 16,
  },
  sessionCard: {
    flexDirection: 'row',
    height: 149,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ECECEC',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 12,
  },
  sessionImageContainer: {
    width: 81,
    height: 134,
    backgroundColor: '#FED4D4',
    borderRadius: 8,
    overflow: 'hidden',
    marginLeft: 9,
    marginTop: 8,
    marginBottom: 7,
  },
  sessionImage: {
    width: '100%',
    height: '100%',
  },
  sessionContent: {
    flex: 1,
    paddingLeft: 23,
    paddingRight: 11,
    paddingTop: 16,
    paddingBottom: 6,
  },
  sessionTitle: {
    fontFamily: 'Satoshi-Bold',
    fontWeight: '700',
    fontSize: 20,
    lineHeight: 22,
    color: '#494949',
    marginBottom: 6,
  },
  sessionInstructor: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 14,
    lineHeight: 19,
    color: '#050505',
    marginBottom: 11,
  },
  sessionDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 21,
    marginBottom: 14.5,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 12,
    lineHeight: 16,
    color: 'rgba(73, 73, 73, 0.6)',
  },
  sessionDivider: {
    height: 1,
    backgroundColor: '#CCCCCC',
    marginBottom: 9.5,
  },
  sessionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  feelingText: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 14,
    lineHeight: 19,
    color: 'rgba(5, 5, 5, 0.5)',
  },
  feelingValue: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 14,
    lineHeight: 19,
    color: 'rgba(5, 5, 5, 0.5)',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontFamily: 'Satoshi-Bold',
    fontWeight: '700',
    fontSize: 14,
    lineHeight: 19,
    color: '#494949',
  },
});

export default SessionHistoryScreen;