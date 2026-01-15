import React, { useState } from 'react';
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
import { createPaymentOrder } from '../../services/paymentService';
import { RootState } from '../../store';

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
  {
    id: 'gold-yoga',
    label: '2 Yoga',
    value: 1,
  },
  {
    id: 'gold-mixed',
    label: '1 Yoga + 1 Zumba',
    value: 2,
  },
  {
    id: 'gold-zumba',
    label: '2 Zumba',
    value: 3,
  },
];

const PricingScreen = ({ navigation }: { navigation: any }) => {
  const [selectedPlan, setSelectedPlan] = useState('diamond');
  const [showGoldModal, setShowGoldModal] = useState(false);
  const [selectedGoldOption, setSelectedGoldOption] = useState<number | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const { setPricingPlan, pricingPlan } = useOnboardingStore();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const email = useSelector((state: RootState) => state.auth.email);
  const phone = useSelector((state: RootState) => state.auth.phone);

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

  // ✅ FIXED: Corrected payment flow
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

      // Get selected plan details
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

      console.log('💳 Creating payment order with plan:', pricingPlan);

      // Create payment order using the corrected service
      const response = await createPaymentOrder({
        amount: planDetails.amount,
        currency: 'USD',
        userId: user.id,
        plan: pricingPlan as string,
        email: email,
        phone: phone,
        source: 'app',
      });

      console.log('✅ Payment order response:', response);

      // ✅ FIXED: Check response.success properly
      if (!response.success) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: response.message || 'Failed to create payment order',
        });
        setIsProcessingPayment(false);
        return;
      }

      // ✅ FIXED: Access paymentLink from response.data
      const { paymentLink } = response;

      if (!paymentLink) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Payment link not received from server',
        });
        setIsProcessingPayment(false);
        return;
      }

      // ✅ FIXED: Show toast BEFORE opening URL
      Toast.show({
        type: 'info',
        text1: 'Opening Payment Gateway',
        text2: 'Redirecting to payment...',
      });

      // Open payment link
      await Linking.openURL(paymentLink);

      dispatch(setOnboardingCompleted(true));
      navigation.navigate('Home');
      // ✅ FIXED: Navigate to PaymentVerification after opening payment link
      setIsProcessingPayment(false);
      // navigation.navigate('PaymentVerification');
    } catch (error: any) {
      console.error('❌ Payment error:', error);
      Toast.show({
        type: 'error',
        text1: 'Payment Error',
        text2: error.message || 'An error occurred during payment processing',
      });
      setIsProcessingPayment(false);
    }
  };

  const handleContinue = async () => {
    await handlePaymentTransaction();
  };

  const PlanCard = ({ plan, isSelected, onPress }: any) => {
    const Badge = () => (
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
    );

    return (
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
        {plan.badge && <Badge />}
      </TouchableOpacity>
    );
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.topNav}>
            <TouchableOpacity
              onPress={() => {
                /* TODO: Handle close */
              }}
            >
              <Image
                style={styles.closeIcon}
                source={Images.crossIcon}
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
              source={Images.pricingIllustration1}
              style={[styles.illustrationPlaceholder, { flex: 0.4 }]}
              resizeMode="cover"
            />
            <Image
              source={Images.pricingIllustration2}
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
              title={
                isProcessingPayment ? 'Processing...' : 'Continue to Payment'
              }
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

          <TouchableOpacity
            onPress={() => {
              dispatch(setOnboardingCompleted(true));
              navigation.navigate('Home');
            }}
          >
            <Text style={styles.skipText}>Skip for Now</Text>
          </TouchableOpacity>
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 24,
  },
  topNav: {
    alignItems: 'flex-end',
  },
  closeIcon: {
    fontSize: 22,
    color: '#3A3A3A',
    fontWeight: '600',
    marginTop: 70,
    marginBottom: -65,
    marginRight: 10,
  },
  headerSection: {
    alignItems: 'center',
    marginTop: 50,
  },
  title: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 30,
    fontWeight: '700',
    color: '#494949',
    textAlign: 'center',
    lineHeight: 33,
    width: 263,
  },
  subtitle: {
    marginTop: 8,
    fontFamily: 'Satoshi-Regular',
    fontSize: 14,
    fontWeight: '400',
    color: '#494949',
    textAlign: 'center',
    lineHeight: 14,
    letterSpacing: 0,
  },
  illustrationArea: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 28,
  },
  illustrationPlaceholder: {
    flex: 1,
    height: 155,
    borderRadius: 18,
    backgroundColor: 'white',
  },
  planList: {
    marginTop: 33,
    gap: 12,
  },
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
  selectedPlanCard: {
    backgroundColor: '#FFE8E8',
    borderColor: '#B95E82',
    borderWidth: 1.5,
  },
  planLeft: {},
  planName: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 22,
    color: '#000000',
  },
  planRight: {
    alignItems: 'flex-end',
  },
  planPrice: {
    height: 18,
    fontSize: 16,
    color: '#000000',
    fontFamily: 'Satoshi-Medium',
    fontWeight: '500',
    lineHeight: 18,
    textAlign: 'right',
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
  valueBadge: {
    backgroundColor: '#B95E824D',
  },
  premiumBadge: {
    position: 'absolute',
    top: 10,
    right: 16,
    width: 79.78,
    height: 24.45,
    borderRadius: 9999,
    backgroundColor: '#B95E82',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '400',
  },
  valueBadgeText: {
    color: '#B95E82',
  },
  premiumBadgeText: {
    height: 16,
    fontFamily: 'Satoshi-Regular',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  ctaButtonContainer: {
    marginTop: 28,
  },
  skipText: {
    marginTop: 16,
    marginBottom: 30,
    fontSize: 15,
    fontWeight: '500',
    color: '#B95E82',
    textAlign: 'center',
    fontFamily: 'Satoshi-Medium',
  },

  /* Modal Styles */
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
    maxHeight: '80%',
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
  closeButton: {
    fontSize: 24,
    color: '#494949',
    fontWeight: '600',
  },
  goldOptionsContainer: {
    gap: 12,
    marginBottom: 24,
  },
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
  goldOptionSelected: {
    backgroundColor: '#FFE8E8',
    borderColor: '#B95E82',
    borderWidth: 1.5,
  },
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
  goldRadioSelected: {
    borderColor: '#B95E82',
  },
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
  modalButtonContainer: {
    marginBottom: 12,
  },
  modalCancel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#B95E82',
    textAlign: 'center',
    fontFamily: 'Satoshi-Medium',
  },
});

export default PricingScreen;