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
import LinearGradient from 'react-native-linear-gradient';
import { SubscriptionImages } from '../../assets/images/subscriptions';

interface BillingInfo {
  label: string;
  value: string;
}

interface SettingOption {
  id: number;
  title: string;
  icon: ImageSourcePropType;
}

const ManageSubscriptionsScreen = ({ navigation }: { navigation: any }) => {
  const billingInfo: BillingInfo[] = [
    { label: 'Next billing date', value: 'Aug 15, 2026' },
    { label: 'Payment method', value: '*** **** **** 4319' },
    { label: 'Next billing date', value: 'Aug 15, 2026' },
  ];

  const settingOptions: SettingOption[] = [
    {
      id: 1,
      title: 'Upgrade Plan',
      icon: SubscriptionImages.upgradeIcon,
    },
    {
      id: 2,
      title: 'Update payment method',
      icon: SubscriptionImages.paymentIcon,
    },
    {
      id: 3,
      title: 'View invoices',
      icon: SubscriptionImages.invoicesIcon,
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Image style={styles.backIcon} source={SubscriptionImages.backwardIcon} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Manage Subscriptions</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Current Plan Card */}
        <LinearGradient
          colors={['#B95E82', '#D17D9E']}
          style={styles.planCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          <View style={styles.planHeader}>
            <Text style={styles.planLabel}>Current plan</Text>
            <View style={styles.diamondBadge}>
              <Text style={styles.diamondText}>Diamond</Text>
            </View>
          </View>
          
          <Text style={styles.planPrice}>$200/month</Text>
          
          <View style={styles.planFeatures}>
            <View style={styles.featureItem}>
              <Image
                source={SubscriptionImages.videoIcon}
                style={styles.featureIcon}
              />
              <Text style={styles.featureText}>4 live sessions/month</Text>
            </View>
            <View style={styles.featureItem}>
              <Image
                source={SubscriptionImages.playIcon}
                style={styles.featureIcon}
              />
              <Text style={styles.featureText}>Unlimited replays</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Session Progress Card */}
        <View style={styles.sessionCard}>
          <View style={styles.sessionHeader}>
            <Text style={styles.sessionTitle}>Session this month</Text>
            <Text style={styles.sessionRemaining}>1 of 4 remaining</Text>
          </View>
          <View style={styles.sessionProgressContainer}>
            <LinearGradient
              colors={['#B95E82', '#F39F9F']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.sessionProgressBar, { width: '25%' }]}
            />
          </View>
        </View>

        {/* Billing Information */}
        <View style={styles.billingContainer}>
          <Text style={styles.billingTitle}>Billing Information</Text>
          
          {billingInfo.map((item, index) => (
            <View key={index}>
              <View style={styles.billingRow}>
                <Text style={styles.billingLabel}>{item.label}</Text>
                <Text style={styles.billingValue}>{item.value}</Text>
              </View>
              {index < billingInfo.length && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        {/* Settings Options */}
        <View style={styles.settingsContainer}>
          {settingOptions.map((option, index) => (
            <View key={option.id}>
              <TouchableOpacity style={styles.settingItem}>
                <View style={styles.settingIconContainer}>
                  <Image source={option.icon}/>
                </View>
                <Text style={styles.settingTitle}>{option.title}</Text>
                <Image source={SubscriptionImages.rightIcon}/>
              </TouchableOpacity>
              {index < settingOptions.length && <View style={styles.settingsdivider} />}
            </View>
          ))}
        </View>

        {/* Cancel Subscription Button */}
        <TouchableOpacity style={styles.cancelButton}>
          <Text style={styles.cancelButtonText}>Cancel Subscription</Text>
        </TouchableOpacity>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
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
    paddingBottom: 41
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
    textAlign: 'center',
  },
  headerSpacer: {
    width: 24,
  },
  // Current Plan Card
  planCard: {
    marginHorizontal: 16,
    height: 162,
    borderRadius: 12,
    paddingLeft: 22,
    paddingRight: 12.26,
    paddingVertical: 18,
    marginBottom: 27,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 9,
  },
  planLabel: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 14,
    lineHeight: 19,
    color: '#FFFFFF',
  },
  diamondBadge: {
    height: 26.86,
    // paddingHorizontal: 16,
    paddingRight: 25.74,
    paddingLeft: 23,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 158.478,
    justifyContent: 'center',
    alignItems: 'center',
  },
  diamondText: {
    fontFamily: 'Satoshi-Medium',
    fontWeight: '500',
    fontSize: 10,
    lineHeight: 14,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  planPrice: {
    fontFamily: 'Satoshi-Bold',
    fontWeight: '700',
    fontSize: 30,
    lineHeight: 33,
    color: '#FFFFFF',
    marginBottom: 20,
  },
  planFeatures: {
    gap: 9,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  featureText: {
    fontFamily: 'Satoshi-Medium',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 19, 
    color: '#FFFFFF',
  },
  // Session Progress Card
  sessionCard: {
    marginHorizontal: 16,
    height: 84,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 18,
    marginBottom: 27,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 11,
  },
  sessionTitle: {
    fontFamily: 'Satoshi-Medium',
    fontWeight: '500',
    fontSize: 18,
    lineHeight: 28,
    color: '#000000',
  },
  sessionRemaining: {
    fontFamily: 'Satoshi-Medium',
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 20,
    color: 'rgba(0, 0, 0, 0.6)',
    textAlign: 'right',
  },
  sessionProgressContainer: {
    height: 9,
    backgroundColor: '#C9C9C9',
    borderRadius: 39.12,
    overflow: 'hidden',
  },
  sessionProgressBar: {
    height: '100%',
    borderRadius: 39.12,
  },
  // Billing Information
  billingContainer: {
    marginHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ECECEC',
    borderRadius: 17.52,
    paddingHorizontal: 22,
    paddingTop: 28,
    paddingBottom: 6,
    marginBottom: 27,
  },
  billingTitle: {
    fontFamily: 'Satoshi-Bold',
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: 0.01,
    color: '#494949',
    marginBottom: 22,
  },
  billingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 31,
  },
  billingLabel: {
    fontFamily: 'Satoshi-Medium',
    fontWeight: '500',
    fontSize: 13,
    lineHeight: 20,
    color: 'rgba(0, 0, 0, 0.6)',
  },
  billingValue: {
    fontFamily: 'Satoshi-Medium',
    fontWeight: '500',
    fontSize: 13,
    lineHeight: 20,
    color: 'rgba(0, 0, 0, 0.6)',
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: '#494949',
    opacity: 0.1,
    marginTop: 10,
    marginBottom: 16,
  },
  // Settings Options
  settingsContainer: {
    marginHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ECECEC',
    borderRadius: 17.52,
    paddingHorizontal: 22,
    marginBottom: 40,
    paddingTop: 28,
    paddingBottom: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 66,
  },
  settingIconContainer: {
    width: 38,
    height: 38,
    backgroundColor: '#FFE8E8',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  settingTitle: {
    flex: 1,
    fontFamily: 'Satoshi-Bold',
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: 0.01,
    color: '#494949',
  },
  settingsdivider: {
    height: 1,
    backgroundColor: '#494949',
    opacity: 0.1,
    marginTop: 20,
    marginBottom: 20,
  },
  // Cancel Subscription Button
  cancelButton: {
    marginHorizontal: 22,
    height: 54.3,
    backgroundColor: '#B95E82',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  cancelButtonText: {
    fontFamily: 'Satoshi-Medium',
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 22,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  bottomSpacer: {
    height: 20,
  },
});

export default ManageSubscriptionsScreen;