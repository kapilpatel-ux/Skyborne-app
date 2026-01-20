// screens/onboarding/PricingScreen.tsx - Updated for nGenius

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Modal,
  Linking,
  ActivityIndicator,
} from 'react-native';
import Toast from 'react-native-toast-message';
import GradientBackground from '../../components/GradientBackground';
import Button from '../../components/Button';
import { useDispatch, useSelector } from 'react-redux';
import { setOnboardingCompleted } from '../../store/authSlice';
import { Images } from '../../assets/images';
import { useOnboardingStore } from '../../store/onboardingSlice';
import { 
  createPaymentOrder,
  clearPaymentCache,
} from '../../services/paymentService';
import SocketService from '../../services/socketService';
import { fetchUserProfile } from '../../store/homeSlice';
import { RootState } from '../../store';
import { SubscriptionImages } from '../../assets/images/subscriptions';

const plans = [
  {
    id: 'gold',
    name: 'Gold',
    price: '$100 / 2 Sessions',
    amount: 100,
    badge: 'Best Value',
    badgeType: 'value',
    hasSubOptions: true,
  },
  {
    id: 'diamond',
    name: 'Diamond',
    price: '$200 / 4 Sessions',
    amount: 200,
    badge: 'Premium',
    badgeType: 'premium',
    hasSubOptions: false,
  },
  {
    id: 'platinum',
    name: 'Platinum',
    price: '$300 / 5 Sessions',
    amount: 300,
    badge: 'Best Value',
    badgeType: 'value',
    hasSubOptions: false,
  },
];

const goldSubOptions = [
  { id: 'gold-yoga', label: '2 Yoga', value: 1 },
  { id: 'gold-mixed', label: '1 Yoga + 1 Zumba', value: 2 },
  { id: 'gold-zumba', label: '2 Zumba', value: 3 },
];

const UpgradePlanScreen = ({ navigation }: { navigation: any }) => {
  const [selectedPlan, setSelectedPlan] = useState('diamond');
  const [showGoldModal, setShowGoldModal] = useState(false);
  const [selectedGoldOption, setSelectedGoldOption] = useState<number | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isListeningForPayment, setIsListeningForPayment] = useState(false);
  const [paymentTimeout, setPaymentTimeout] = useState<NodeJS.Timeout | null>(null);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);
  const [pollingAttempts, setPollingAttempts] = useState(0);

  const { setPricingPlan, pricingPlan } = useOnboardingStore();
  const dispatch = useDispatch<any>();
  const user = useSelector((state: RootState) => state.auth.user);
  const email = useSelector((state: RootState) => state.auth.email);
  const phone = useSelector((state: RootState) => state.auth.phone);

  useEffect(() => {
    if (user?.id) {
      console.log('🔌 Initializing Socket.io for user:', user.id);
       const apiUrl = process.env.REACT_APP_API_URL ||'https://svdevelopment-03-skyborne-backend.onrender.com/api/v1';
      SocketService.connect(apiUrl, user.id);
    }

    return () => {
      if (paymentTimeout) clearTimeout(paymentTimeout);
      if (pollingInterval) clearInterval(pollingInterval);
    };
  }, [user?.id]);

  /**
   * Poll /me API every 60 seconds for 10 minutes (fallback if Socket.io fails)
   */
  const startPollingUserProfile = () => {
    console.log('📱 Starting /me API polling (every 60s for 10 minutes)');
    setPollingAttempts(0);

    const interval = setInterval(async () => {
      setPollingAttempts(prev => {
        const newAttempts = prev + 1;
        console.log(`📲 Polling attempt ${newAttempts}/10...`);
        return newAttempts;
      });

      try {
        const meResult = await dispatch(fetchUserProfile());

        if (meResult.meta.requestStatus === 'fulfilled') {
          const userData = meResult.payload;

          console.log('✅ User data:', {
            onboardingCompleted: userData?.onboardingCompleted,
            plan: userData?.plan,
          });

          if (userData?.onboardingCompleted) {
            console.log('🎉 Subscription confirmed via polling!');

            if (interval) clearInterval(interval);
            setPollingInterval(null);
            if (paymentTimeout) clearTimeout(paymentTimeout);

            dispatch(setOnboardingCompleted(true));

            Toast.show({
              type: 'success',
              text1: 'Subscription Activated! 🎊',
              text2: `Welcome to ${userData?.plan} plan!`,
            });

            setTimeout(() => {
              setIsProcessingPayment(false);
              setIsListeningForPayment(false);
              console.log('🚀 Navigating to Home screen');
              navigation.replace('Home');
            }, 800);

            return;
          }
        }

        // Stop after 10 attempts (10 minutes)
        if (pollingAttempts >= 10) {
          console.warn('⚠️ Polling timeout - 10 minutes elapsed');
          clearInterval(interval);
          setPollingInterval(null);

          Toast.show({
            type: 'info',
            text1: 'Payment Verification Timeout',
            text2: 'Please refresh the app to check your subscription status',
          });

          setIsProcessingPayment(false);
          setIsListeningForPayment(false);
          return;
        }
      } catch (error) {
        console.error(`❌ Polling attempt failed:`, error);
      }
    }, 60000); // Poll every 60 seconds

    setPollingInterval(interval);
  };

  /**
   * Handle payment success via Socket.io
   */
  const handlePaymentSuccess = async (paymentData: any) => {
    console.log('💳 Payment success event received:', {
      gateway: paymentData?.gateway,
      status: paymentData?.status,
    });

    // Clear polling if active
    if (pollingInterval) {
      clearInterval(pollingInterval);
      setPollingInterval(null);
    }

    if (paymentTimeout) {
      clearTimeout(paymentTimeout);
      setPaymentTimeout(null);
    }

    Toast.show({
      type: 'success',
      text1: 'Payment Successful! 🎉',
      text2: 'Verifying your subscription...',
    });

    try {
      console.log('📲 Calling /me API to fetch updated user profile...');
      const meResult = await dispatch(fetchUserProfile());

      if (meResult.meta.requestStatus === 'fulfilled') {
        const userData = meResult.payload;

        console.log('✅ Updated user data:', {
          onboardingCompleted: userData?.onboardingCompleted,
          plan: userData?.plan,
          subscription: userData?.subscription?.status,
        });

        if (userData?.onboardingCompleted) {
          dispatch(setOnboardingCompleted(true));

          Toast.show({
            type: 'success',
            text1: 'Subscription Activated! 🎊',
            text2: `Welcome to ${userData?.plan} plan!`,
          });

          // Clear payment cache
          await clearPaymentCache();

          setTimeout(() => {
            setIsProcessingPayment(false);
            setIsListeningForPayment(false);
            console.log('🚀 Navigating to Home screen');
            navigation.replace('Home');
          }, 800);
        } else {
          throw new Error('Onboarding not marked as completed');
        }
      } else {
        throw new Error('Failed to fetch user profile');
      }
    } catch (error) {
      console.error('❌ Error in payment success handler:', error);

      Toast.show({
        type: 'error',
        text1: 'Verification Error',
        text2: 'Subscription may be active. Please refresh the app.',
      });

      setIsProcessingPayment(false);
      setIsListeningForPayment(false);

      // Cleanup listeners
      SocketService.socket?.off('payment-success', handlePaymentSuccess);
      SocketService.socket?.off('payment-error', handlePaymentError);
    }
  };

  /**
   * Handle payment error
   */
  const handlePaymentError = (errorData: any) => {
    console.error('❌ Payment error:', errorData);

    if (pollingInterval) {
      clearInterval(pollingInterval);
      setPollingInterval(null);
    }

    if (paymentTimeout) {
      clearTimeout(paymentTimeout);
      setPaymentTimeout(null);
    }

    Toast.show({
      type: 'error',
      text1: 'Payment Failed',
      text2: errorData?.message || 'Your payment could not be processed',
    });

    setIsProcessingPayment(false);
    setIsListeningForPayment(false);

    SocketService.socket?.off('payment-success', handlePaymentSuccess);
    SocketService.socket?.off('payment-error', handlePaymentError);
  };

  const handleGoldSelect = () => {
    if (selectedGoldOption !== null) {
      setPricingPlan(goldSubOptions?.[selectedGoldOption as number]?.id);
      setShowGoldModal(false);
      setSelectedPlan('gold');
    }
  };

  const handlePlanSelect = (planId: string) => {
    if (planId === 'gold') {
      setShowGoldModal(true);
    } else {
      setPricingPlan(planId);
      setSelectedPlan(planId);
    }
  };

  /**
   * Initiate payment transaction (works for both nGenius and Stripe)
   */
  const handlePaymentTransaction = async () => {
    try {
      // Validation
      if (!user?.id) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'User information not found. Please log in again.',
        });
        return;
      }

      if (!selectedPlan) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Please select a pricing plan',
        });
        return;
      }

      const planDetails = plans.find(p => p.id === selectedPlan);
      if (!planDetails) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Invalid plan selected',
        });
        return;
      }

      setIsProcessingPayment(true);
      console.log('💳 Creating payment order:', {
        plan: pricingPlan,
        amount: planDetails.amount,
        currency: 'USD',
      });

      // Create payment order (backend will determine gateway)
      const response = await createPaymentOrder({
        amount: planDetails.amount,
        currency: 'USD',
        userId: user.id,
        plan: pricingPlan as string,
        email: email,
        phone: phone,
        source: 'app',
      });

      console.log('✅ Payment order created:', {
        gateway: response.gateway,
        orderRef: response.orderRef,
        hasReference: !!response.reference,
        hasSessionId: !!response.sessionId,
      });

      if (!response.success) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: response.message || 'Failed to create payment order',
        });
        setIsProcessingPayment(false);
        return;
      }

      const { paymentLink } = response;

      if (!paymentLink) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Payment link not received',
        });
        setIsProcessingPayment(false);
        return;
      }

      // ✅ SET UP SOCKET LISTENERS
      setIsListeningForPayment(true);

      SocketService.socket?.on('payment-success', handlePaymentSuccess);
      SocketService.socket?.on('payment-error', handlePaymentError);

      if (!SocketService.isConnected()) {
        console.warn('⚠️ Socket not connected, will rely on polling');
        Toast.show({
          type: 'info',
          text1: 'Connecting to payment service...',
          text2: 'Please wait...',
        });
      }

      Toast.show({
        type: 'info',
        text1: 'Opening Payment Gateway',
        text2: `Gateway: ${response.gateway === 'ngenius' ? 'nGenius' : 'Stripe'}`,
      });

      // Open payment link
      await Linking.openURL(paymentLink);

      // ✅ START POLLING FALLBACK
      startPollingUserProfile();

      // Set timeout to start polling if socket fails
      const timeout = setTimeout(() => {
        if (isListeningForPayment && !pollingInterval) {
          console.warn('⚠️ Socket timeout - Starting polling fallback');
          startPollingUserProfile();
        }
      }, 60000); // 60 second timeout

      setPaymentTimeout(timeout);

    } catch (error: any) {
      console.error('❌ Payment transaction error:', error);
      Toast.show({
        type: 'error',
        text1: 'Payment Error',
        text2: error.message || 'An error occurred',
      });
      setIsProcessingPayment(false);
      setIsListeningForPayment(false);

      SocketService.socket?.off('payment-success', handlePaymentSuccess);
      SocketService.socket?.off('payment-error', handlePaymentError);
    }
  };

  const handleContinue = async () => {
    await handlePaymentTransaction();
  };

  const handleClosePress = () => {
    navigation.goBack();
  };

  const PlanCard = ({ plan, isSelected, onPress }: any) => (
    <TouchableOpacity
      style={[styles.planCard, isSelected && styles.selectedPlanCard]}
      onPress={onPress}
      disabled={isProcessingPayment}
    >
      <View style={styles.planLeft}>
        <Text style={styles.planName}>{plan.name}</Text>
      </View>
      <View style={styles.planRight}>
        <Text style={styles.planPrice}>{plan.price}</Text>
      </View>
      {plan.badge && (
        <View
          style={[
            styles.badge,
            isSelected ? styles.premiumBadge : styles.valueBadge,
          ]}
        >
          <Text
            style={[
              styles.badgeText,
              isSelected ? styles.premiumBadgeText : styles.valueBadgeText,
            ]}
          >
            {plan.badge}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                  <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Image style={styles.backIcon} source={SubscriptionImages.backwardIcon} />
                  </TouchableOpacity>
                  </View>
        <View style={styles.container}>
          <View style={styles.topNav}>
            <TouchableOpacity onPress={handleClosePress} disabled={isProcessingPayment}>
              <Image
                style={styles.closeIcon}
                source={{uri:Images.crossIcon}}
                resizeMode="cover"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.headerSection}>
            <Text style={styles.title}>Choose Your Plan</Text>
            <Text style={styles.subtitle}>
              Select the perfect wellness package for you
            </Text>
          </View>

          <View style={styles.illustrationArea}>
            <Image
              source={{uri:Images.pricingIllustration1}}
              style={[styles.illustrationPlaceholder, { flex: 0.4 }]}
              resizeMode="cover"
            />
            <Image
              source={{uri:Images.pricingIllustration2}}
              style={[styles.illustrationPlaceholder, { flex: 0.6 }]}
              resizeMode="cover"
            />
          </View>

          <View style={styles.planList}>
            {plans.map(plan => (
              <PlanCard
                key={plan.id}
                plan={plan}
                isSelected={selectedPlan === plan.id}
                onPress={() => handlePlanSelect(plan.id)}
              />
            ))}
          </View>
          <View style={{ flex: 1 }} />

          <View style={styles.ctaButtonContainer}>
            <Button
              title={isProcessingPayment ? 'Processing...' : 'Continue to Payment'}
              onPress={handleContinue}
              disabled={isProcessingPayment}
            />
            {isProcessingPayment && (
              <ActivityIndicator
                size="large"
                color="#B95E82"
                style={{ marginTop: 12 }}
              />
            )}
          </View>
        </View>

        {/* Gold Sub-Options Modal */}
        <Modal
          visible={showGoldModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowGoldModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Choose Your Gold Plan</Text>
                <TouchableOpacity onPress={() => setShowGoldModal(false)}>
                  <Text style={styles.closeButton}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.goldOptionsContainer}>
                {goldSubOptions.map(option => (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.goldOptionCard,
                      selectedGoldOption === option.value &&
                        styles.goldOptionSelected,
                    ]}
                    onPress={() => setSelectedGoldOption(option.value)}
                  >
                    <View
                      style={[
                        styles.goldRadio,
                        selectedGoldOption === option.value &&
                          styles.goldRadioSelected,
                      ]}
                    >
                      {selectedGoldOption === option.value && (
                        <View style={styles.goldRadioInner} />
                      )}
                    </View>
                    <Text style={styles.goldOptionLabel}>{option.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.modalButtonContainer}>
                <Button
                  title="Confirm Selection"
                  onPress={handleGoldSelect}
                  disabled={selectedGoldOption === null}
                />
              </View>

              <TouchableOpacity onPress={() => setShowGoldModal(false)}>
                <Text style={styles.modalCancel}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
      <Toast />
    </GradientBackground>
  );
};

// Styles remain the same as original
const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 24,
  },
  topNav: { alignItems: 'flex-end' },
  closeIcon: {
    fontSize: 22,
    color: '#3A3A3A',
    fontWeight: '600',
    marginTop: 70,
    marginBottom: -65,
    marginRight: 10,
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
  headerSection: { alignItems: 'center', marginTop: 50 },
  title: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 30,
    fontWeight: '700',
    color: '#494949',
    textAlign: 'center',
    lineHeight: 33,
    width: 263,
  },
   header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 35,
    paddingBottom: 41
  },
  subtitle: {
    marginTop: 8,
    fontFamily: 'Satoshi-Regular',
    fontSize: 14,
    fontWeight: '400',
    color: '#494949',
    textAlign: 'center',
    lineHeight: 14,
  },
  illustrationArea: { flexDirection: 'row', gap: 14, marginTop: 28 },
  illustrationPlaceholder: {
    flex: 1,
    height: 155,
    borderRadius: 18,
    backgroundColor: 'white',
  },
  planList: { marginTop: 33, gap: 12 },
  planCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ECECEC',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  selectedPlanCard: { backgroundColor: '#FFE8E8', borderColor: '#B95E82', borderWidth: 1.5 },
  planLeft: {},
  planName: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
  },
  planRight: { alignItems: 'flex-end' },
  planPrice: {
    fontSize: 16,
    color: '#000000',
    fontFamily: 'Satoshi-Medium',
    fontWeight: '500',
    marginTop: 28,
    marginBottom: 5,
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 16,
    width: 80,
    height: 24.5,
    borderRadius: 9999,
    backgroundColor: '#B95E824D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  valueBadge: { backgroundColor: '#B95E824D' },
  premiumBadge: {
    position: 'absolute',
    top: 10,
    right: 16,
    backgroundColor: '#B95E82',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 9999,
    width: 79.78,
    height: 24.45,
  },
  badgeText: { fontSize: 13, fontWeight: '400' },
  valueBadgeText: { color: '#B95E82' },
  premiumBadgeText: {
    fontFamily: 'Satoshi-Regular',
    fontWeight: '400',
    fontSize: 12,
    color: '#FFFFFF',
  },
  ctaButtonContainer: { marginTop: 28 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 18,
    paddingTop: 24,
    paddingBottom: 32,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#494949',
    fontFamily: 'Satoshi-Bold',
  },
  closeButton: { fontSize: 24, color: '#494949', fontWeight: '600' },
  goldOptionsContainer: { gap: 12, marginBottom: 24 },
  goldOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ECECEC',
  },
  goldOptionSelected: { backgroundColor: '#FFE8E8', borderColor: '#B95E82' },
  goldRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ECECEC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  goldRadioSelected: { borderColor: '#B95E82' },
  goldRadioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#B95E82',
  },
  goldOptionLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    fontFamily: 'Satoshi-Medium',
  },
  modalButtonContainer: { marginBottom: 12 },
  modalCancel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#B95E82',
    textAlign: 'center',
    fontFamily: 'Satoshi-Medium',
  },
});

export default UpgradePlanScreen;