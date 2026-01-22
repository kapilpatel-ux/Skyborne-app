import React from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/AppNavigator';
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
import { MessageCircleMore } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { AllItems, ProfileImages } from '../../assets/images/profile';
import BottomNav from '../../components/BottomNav';
import { useProfileViewModel } from '../../viewmodels/useProfileViewModel';
import { useEffect } from 'react';
import { Alert } from 'react-native';
import { removeAuthToken } from '../../services/authService';

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
  progress: number;
  current: number;
  total: number;
}

interface SettingItem {
  id: number;
  title: string;
  subtitle: string;
  icon?: ImageSourcePropType;
  iconBgColor: string;
  screen?: keyof RootStackParamList;
}

const ProfileScreen = () => {
  type ProfileScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'Profile'
  >;
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const COMMON_URL = 'https://skyborne-images.s3.ap-south-1.amazonaws.com';

  const { user, dashboardStats, loadProfile }: any = useProfileViewModel();

  useEffect(() => {
    loadProfile();
  }, []);

  // Calculate progress items dynamically from classCredits
  // Calculate progress items dynamically from classCredits based on plan
  // Calculate progress items dynamically from classCredits based on plan
  const getProgressItems = (): ProgressItem[] => {
    if (!user?.classCredits || !user?.plan) return [];

    const plan = user.plan.toLowerCase();
    const classNames = Object.keys(user.classCredits).filter(
      key => key !== '_id',
    );
    const items: ProgressItem[] = [];

    // Define which credit types to show based on plan
    let allowedCredits: string[] = [];

    if (plan === 'gold-yoga') {
      allowedCredits = ['yoga'];
    } else if (plan === 'gold-zumba') {
      allowedCredits = ['zumba'];
    } else if (plan === 'gold-mixed') {
      allowedCredits = ['yoga', 'zumba'];
    } else if (plan === 'diamond') {
      allowedCredits = ['yoga', 'zumba']; // Diamond doesn't get specialty according to planConfig
    } else if (plan === 'platinum') {
      allowedCredits = ['yoga', 'zumba', 'specialty'];
    }

    // Filter and create progress items only for allowed credits
    classNames.forEach((className, index) => {
      // Only show if this credit type is allowed for the user's plan
      if (!allowedCredits.includes(className)) {
        return;
      }

      const remainingCredits = user.classCredits[className] ?? 0;
      const totalCredits = user.overAllclassCredits?.[className] ?? 0;

      // Calculate used credits (total - remaining)
      const usedCredits = totalCredits - remainingCredits;

      // Calculate percentage: (used / total) * 100
      const percentage =
        totalCredits > 0 ? Math.round((usedCredits / totalCredits) * 100) : 0;

      // Display name mapping
      let displayTitle = className.charAt(0).toUpperCase() + className.slice(1);
      // if (className === 'specialty') {
      //   displayTitle = 'Speciality'; // Map specialty to proper display name
      // }

      items.push({
        id: index + 1,
        title: displayTitle,
        percentage,
        progress: totalCredits > 0 ? usedCredits / totalCredits : 0,
        current: usedCredits,
        total: totalCredits,
      });
    });

    return items;
  };

  const progressItems = getProgressItems();

  const statCards: StatCard[] = [
    {
      id: 1,
      value: String(dashboardStats?.data?.upcomingSessions ?? 0),
      label: 'Upcoming Session',
      backgroundColor: '#FFF7DD',
      icon: { uri: `${COMMON_URL}/laptop.png` },
    },

    {
      id: 2,
      value: String(dashboardStats?.data?.totalCredits ?? 0),
      label: 'Credits',
      backgroundColor: '#FFE8E8',
      icon: { uri: `${COMMON_URL}/sand.png` },
    },
    {
      id: 3,
      value: String(dashboardStats?.data?.classesAttended ?? 0),
      label: 'Class Attended',
      backgroundColor: '#FFE8E8',
      icon: { uri: `${COMMON_URL}/fire.png` },
    },
    {
      id: 4,
      value: dashboardStats?.data?.currentPlan?.displayName ?? '--',
      label: 'Current Plan',
      backgroundColor: '#FFF7DD',
      icon: { uri: `${COMMON_URL}/badge.png` },
    },
  ];

  const settingItems: SettingItem[] = [
    {
      id: 1,
      title: 'Subscription',
      subtitle: dashboardStats?.data?.currentPlan?.displayName ?? '--',
      icon: ProfileImages.subscriptionIcon,
      iconBgColor: '#FFE8E8',
      screen: 'ManageSubscription',
    },
    {
      id: 2,
      title: 'History',
      subtitle: 'View past Sessions',
      icon: ProfileImages.historyIcon,
      iconBgColor: '#FFE8E8',
      screen: 'SessionHistory',
    },
    {
      id: 3,
      title: 'Feedback',
      subtitle: 'Give us your feedback',
      iconBgColor: '#FFE8E8',
      screen: 'Feedback',
    },
    {
      id: 4,
      title: 'Support',
      subtitle: 'Get help',
      icon: ProfileImages.supportIcon,
      iconBgColor: '#FFE8E8',
      screen: 'Support',
    },
  ];

  const getInitials = (firstName?: string, lastName?: string) => {
    const first = firstName?.charAt(0).toUpperCase() ?? '';
    const last = lastName?.charAt(0).toUpperCase() ?? '';
    return `${first}${last}`;
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            await removeAuthToken();
            navigation.replace('Login');
          },
        },
      ],
      { cancelable: true },
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
          <View style={styles.headerLeft}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Image
                style={styles.backIcon}
                source={ProfileImages.ArrowIcon1}
              />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Profile</Text>
          </View>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
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
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              {`${user?.firstName} ${user?.lastName}`}{' '}
            </Text>
            <Text style={styles.profileSince}>
              since{' '}
              {user?.createdAt ? new Date(user.createdAt).getFullYear() : '--'}
            </Text>
          </View>
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumText}>{user?.plan}</Text>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate('EditProfile')}
          >
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
              <Image source={stat?.icon} style={styles.statIcon} />
              <Text
                style={[
                  styles.statValue,
                  stat.label === 'Current Plan' && styles.planStatValue,
                ]}
              >
                {stat.value}
              </Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Current Progress Section */}
       {/* Current Progress Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Current Progress</Text>
        </View>

        {progressItems.length > 0 ? (
          <View style={styles.progressList}>
            {progressItems.map(item => (
              <View key={item.id} style={styles.progressCard}>
                <View style={styles.progressHeader}>
                  <Text style={styles.progressTitle}>{item.title}</Text>
                  <View style={styles.progressInfo}>
                    <Text style={styles.progressCredits}>
                      {item.current}/{item.total}
                    </Text>
                    <Text style={styles.progressPercentage}>
                      {item.percentage}%
                    </Text>
                  </View>
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
        ) : (
          <View style={styles.emptyProgressContainer}>
            <Text style={styles.emptyProgressText}>
              No progress data available for your current plan
            </Text>
          </View>
        )}

        {/* Settings Section */}
        <View style={styles.settingsContainer}>
          {settingItems.map((item, index) => (
            <View key={item.id}>
              <TouchableOpacity
                style={styles.settingItem}
                onPress={() => {
                  if (item.screen) {
                    navigation.navigate(item.screen as any);
                  }
                }}
              >
                <View
                  style={[
                    styles.settingIconContainer,
                    { backgroundColor: item.iconBgColor },
                  ]}
                >
                  {item.id === 3 ? (
                    <MessageCircleMore size={22} color="#B95E82" />
                  ) : (
                    <Image source={item.icon} style={styles.settingIcon} />
                  )}
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingTitle}>{item.title}</Text>
                  <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
                </View>
                <Image source={ProfileImages.ArrowIcon2} style={styles.rightArrow} />
              </TouchableOpacity>
              {index < settingItems.length - 1 && (
                <View style={styles.divider} />
              )}
            </View>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 35,
    paddingBottom: 39,
  },
  avatar: {
    marginLeft: 10,
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
    fontSize: 20,
    lineHeight: 22,
    color: '#494949',
    marginLeft: 15,
  },
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
  },
  profileInfo: {
    flex: 1,
    marginLeft: 14,
  },
  profileName: {
    fontFamily: 'Satoshi-Bold',
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
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
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
    fontSize: 25,
    lineHeight: 28,
    color: '#000000',
    textAlign: 'center',
    marginBottom: 5,
  },
  planStatValue: {
    fontSize: 16,
    lineHeight: 20,
  },
  statLabel: {
    fontFamily: 'Satoshi-Medium',
    fontSize: 14,
    lineHeight: 19,
    color: '#000000',
    textAlign: 'center',
  },
  sectionHeader: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 20,
    lineHeight: 22,
    color: '#494949',
  },
  progressList: {
    paddingHorizontal: 16,
    marginBottom: 40,
  },
  progressCard: {
    height: 92,
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
    fontSize: 18,
    lineHeight: 28,
    color: '#000000',
  },
  progressInfo: {
    alignItems: 'flex-end',
  },
  progressCredits: {
    fontFamily: 'Satoshi-Medium',
    fontSize: 13,
    lineHeight: 18,
    color: '#000000',
  },
  progressPercentage: {
    fontFamily: 'Satoshi-Medium',
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
  emptyProgressContainer: {
    paddingHorizontal: 16,
    paddingVertical: 30,
    marginBottom: 40,
    alignItems: 'center',
  },
  emptyProgressText: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 14,
    lineHeight: 19,
    color: 'rgba(5, 5, 5, 0.5)',
    textAlign: 'center',
  },
  sessionList: {
    paddingHorizontal: 16,
    marginBottom: 46,
  },
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
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: 0.01,
    color: '#494949',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 13,
    lineHeight: 18,
    color: 'rgba(5, 5, 5, 0.5)',
  },
  rightArrow: {
    width: 14,
    height: 14,
    resizeMode: 'contain',
    opacity: 0.6,
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
    fontSize: 16,
    lineHeight: 22,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

export default ProfileScreen;
