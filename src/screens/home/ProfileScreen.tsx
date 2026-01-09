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
import LinearGradient from 'react-native-linear-gradient'; // You'll need to install this
import { ProfileImages } from '../../assets/images/profile';
import BottomNav from '../../components/BottomNav';

interface StatCard {
  id: number;
  value: string;
  label: string;
  backgroundColor: string;
  icon: ImageSourcePropType;
}

interface ProgressItem {
  id: number;
  title: string;
  percentage: number;
  progress: number; // 0-1 value for progress bar
}

interface SettingItem {
  id: number;
  title: string;
  subtitle: string;
  icon: ImageSourcePropType;
  iconBgColor: string;
}

const ProfileScreen = () => {
  const statCards: StatCard[] = [
    {
      id: 1,
      value: '48',
      label: 'Total Sessions',
      backgroundColor: '#FFF7DD',
      icon: ProfileImages.ArrowIcon1,
    },
    {
      id: 2,
      value: '12',
      label: 'Total Hours',
      backgroundColor: '#FFE8E8',
      icon: ProfileImages.ArrowIcon1,
    },
    {
      id: 3,
      value: '07',
      label: 'Total Sessions',
      backgroundColor: '#FFE8E8',
      icon: ProfileImages.ArrowIcon1,
    },
    {
      id: 4,
      value: '127',
      label: 'Achievements',
      backgroundColor: '#FFF7DD',
      icon: ProfileImages.ArrowIcon1,
    },
  ];

  const progressItems: ProgressItem[] = [
    { id: 1, title: 'Yoga', percentage: 80, progress: 0.8 },
    { id: 2, title: 'Fitness', percentage: 50, progress: 0.5 },
    { id: 3, title: 'Zumba', percentage: 40, progress: 0.4 },
  ];

  const settingItems: SettingItem[] = [
    {
      id: 1,
      title: 'Subscription',
      subtitle: 'Diamond Plan',
      icon: ProfileImages.subscriptionIcon,
      iconBgColor: '#FFE8E8',
    },
    {
      id: 2,
      title: 'History',
      subtitle: 'View past Sessions',
      icon: ProfileImages.historyIcon,
      iconBgColor: '#FFE8E8',
    },
    {
      id: 3,
      title: 'Timezone',
      subtitle: 'Asia/Kolkata',
      icon: ProfileImages.timezonIcon,
      iconBgColor: '#FFE8E8',
    },
    {
      id: 4,
      title: 'Support',
      subtitle: 'Get help',
      icon: ProfileImages.supportIcon,
      iconBgColor: '#FFE8E8',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.backButton}>
              <Image style={styles.backIcon} source={ProfileImages.ArrowIcon1}/>
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Profile</Text>
          </View>

          <TouchableOpacity style={styles.settingsButton}>
            <Image style={styles.settingsIcon} source={ProfileImages.SettingsIcon} />
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Image
            source={ProfileImages.ProfileImg}
            style={styles.avatar}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>John Bakes</Text>
            <Text style={styles.profileSince}>since 2019</Text>
          </View>
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumText}>Premium</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Image style={styles.editIcon} source={ProfileImages.pencilIcon} />
          </TouchableOpacity>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {statCards.map((stat, index) => (
            <View
              key={stat.id}
              style={[
                styles.statCard,
                { backgroundColor: stat.backgroundColor },
                index % 2 === 0 ? styles.statCardLeft : styles.statCardRight,
              ]}
            >
              <Image source={ProfileImages.sandWAtch} style={styles.statIcon} />
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Current Progress Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Current Progress</Text>
        </View>

        <View style={styles.progressList}>
          {progressItems.map((item) => (
            <View key={item.id} style={styles.progressCard}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressTitle}>{item.title}</Text>
                <Text style={styles.progressPercentage}>{item.percentage}%</Text>
              </View>
              <View style={styles.progressBarContainer}>
                <LinearGradient
                  colors={['#B95E82', '#F39F9F']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.progressBar, { width: `${item.percentage}%` }]}
                />
              </View>
            </View>
          ))}
        </View>

        {/* Settings Section */}
        <View style={styles.settingsContainer}>
          {settingItems.map((item, index) => (
            <View key={item.id}>
              <TouchableOpacity style={styles.settingItem}>
                <View style={[styles.settingIconContainer, { backgroundColor: item.iconBgColor }]}>
                  <Image source={item.icon} style={styles.settingIcon} />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingTitle}>{item.title}</Text>
                  <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
                </View>
                <Image source={ProfileImages.ArrowIcon2} />
              </TouchableOpacity>
              {index < settingItems.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

      </ScrollView>
      <BottomNav active="Profile" />
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
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 35,
    paddingBottom: 39,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    width: 16,
    height: 16,
  },
  headerTitle: {
    fontFamily: 'Satoshi-Bold',
    fontWeight: '700',
    fontSize: 20,
    lineHeight: 22,
    color: '#494949',
    marginLeft: 15,
  },
  settingsButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsIcon: {
    width: 20,
    height: 20,
  },
  // Profile Card
  profileCard: {
    marginHorizontal: 16,
    marginBottom: 30,
    height: 92,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ECECEC',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    // paddingHorizontal: 21,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginLeft: 21,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 14,
  },
  profileName: {
    fontFamily: 'Satoshi-Bold',
    fontWeight: '700',
    fontSize: 20,
    lineHeight: 22,
    color: '#494949',
    marginBottom: 3,
  },
  profileSince: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 12,
    lineHeight: 16,
    color: '#050505',
  },
  premiumBadge: {
    height: 24.45,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(185, 94, 130, 0.3)',
    borderRadius: 39.12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 50,
    marginBottom: 18,
  },
  premiumText: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 12,
    lineHeight: 16,
    color: '#B95E82',
    textAlign: 'center',
  },
  editButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 35,
  },
  editIcon: {
    width: 18,
    height: 18,
  },
  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginBottom: 40,
  },
  statCard: {
    width: '48%',
    height: 133,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 19,
    marginBottom: 26,
  },
  statCardLeft: {
    marginRight: '4%',
  },
  statCardRight: {
    marginLeft: 0,
  },
  statIcon: {
    width: 28,
    height: 28,
    marginBottom: 15,
  },
  statValue: {
    fontFamily: 'Satoshi-Bold',
    fontWeight: '700',
    fontSize: 25,
    lineHeight: 28,
    color: '#000000',
    textAlign: 'center',
    marginBottom: 5,
  },
  statLabel: {
    fontFamily: 'Satoshi-Medium',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 19,
    color: '#000000',
    textAlign: 'center',
  },
  // Section Headers
  sectionHeader: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: 'Satoshi-Bold',
    fontWeight: '700',
    fontSize: 20,
    lineHeight: 22,
    color: '#494949',
  },
  // Progress List
  progressList: {
    paddingHorizontal: 16,
    marginBottom: 40,
  },
  progressCard: {
    height: 84,
    backgroundColor: '#FFE8E8',
    borderWidth: 1,
    borderColor: '#ECECEC',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 18,
    marginBottom: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 11,
  },
  progressTitle: {
    fontFamily: 'Satoshi-Medium',
    fontWeight: '500',
    fontSize: 18,
    lineHeight: 28,
    color: '#000000',
  },
  progressPercentage: {
    fontFamily: 'Satoshi-Medium',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 20,
    color: '#000000',
    textAlign: 'right',
  },
  progressBarContainer: {
    height: 9,
    backgroundColor: '#C9C9C9',
    borderRadius: 39.12,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 39.12,
  },
  // Session List
  sessionList: {
    paddingHorizontal: 16,
    marginBottom: 46,
  },
  sessionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 88,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ECECEC',
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 8,
    marginBottom: 12,
  },
  sessionImageContainer: {
    width: 81,
    height: 71,
    borderRadius: 8,
    backgroundColor: '#FED4D4',
    overflow: 'hidden',
    marginRight: 13,
  },
  sessionImage: {
    width: '100%',
    height: '100%',
  },
  sessionInfo: {
    flex: 1,
  },
  sessionTitle: {
    fontFamily: 'Satoshi-Bold',
    fontWeight: '700',
    fontSize: 20,
    lineHeight: 22,
    color: '#494949',
    marginBottom: 6,
  },
  sessionDuration: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 14,
    lineHeight: 19,
    color: '#050505',
  },
  // Settings Container
  settingsContainer: {
    marginHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ECECEC',
    borderRadius: 17.52,
    paddingHorizontal: 22,
    paddingVertical: 23,
    marginBottom: 44,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 76,
  },
  settingIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingIcon: {
    width: 24,
    height: 24,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontFamily: 'Satoshi-Bold',
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: 0.01,
    color: '#494949',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontFamily: 'Satoshi-Regular',
    fontWeight: '400',
    fontSize: 13,
    lineHeight: 18,
    color: 'rgba(5, 5, 5, 0.5)',
  },
  settingArrow: {
    width: 17.52,
    height: 17.52,
  },
  divider: {
    height: 1,
    backgroundColor: '#494949',
    opacity: 0.1,
    marginTop: 15,
    marginBottom: 20,
  },
  // Logout Button
  logoutButton: {
    marginHorizontal: 22,
    height: 54.3,
    backgroundColor: '#B95E82',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoutText: {
    fontFamily: 'Satoshi-Medium',
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 22,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

export default ProfileScreen;