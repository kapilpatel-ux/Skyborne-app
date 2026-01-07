
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import GradientBackground from '../../components/GradientBackground';
import Button from '../../components/Button';
import { useDispatch } from 'react-redux';
import { setOnboardingCompleted } from '../../store/authSlice';
import { Images } from '../../assets/images';

const plans = [
  {
    id: 'gold',
    name: 'Gold',
    price: '$100 / 2 Sessions',
    badge: 'Best Value',
    badgeType: 'value',
  },
  {
    id: 'diamond',
    name: 'Diamond',
    price: '$200 / 4 Sessions',
    badge: 'Premium',
    badgeType: 'premium',
  },
  {
    id: 'platinum',
    name: 'Platinum',
    price: '$300 / 5 Sessions',
    badge: 'Best Value',
    badgeType: 'value',
  },
];

const PricingScreen = ({ navigation }:{navigation:any}) => {
  
  const [selectedPlan, setSelectedPlan] = useState('diamond'); // Default selection
  const dispatch = useDispatch();

  const PlanCard = ({ plan, isSelected, onPress }:any) => {
    const Badge = () => (
      <View style={[styles.badge, isSelected ? styles.premiumBadge : styles.valueBadge]}>
        <Text style={[styles.badgeText, isSelected ? styles.premiumBadgeText : styles.valueBadgeText]}>
          {plan.badge}
        </Text>
      </View>
    );

    return (
      <TouchableOpacity
        style={[styles.planCard, isSelected && styles.selectedPlanCard]}
        onPress={onPress}
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
            <TouchableOpacity onPress={() => { /* TODO: Handle close */ }}>
              <Image style={styles.closeIcon} source={Images.crossIcon}
              resizeMode="cover" />
            </TouchableOpacity>
          </View>

          <View style={styles.headerSection}>
            <Text style={styles.title}>Choose Your Plan</Text>
            <Text style={styles.subtitle}>Select the perfect wellness package for you</Text>
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
            {plans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                isSelected={selectedPlan === plan.id}
                onPress={() => setSelectedPlan(plan.id)}
              />
            ))}
          </View>
            <View style={{flex: 1}} />
          <View style={styles.ctaButtonContainer}>
            <Button
              title="Continue"
              onPress={() => {
                dispatch(setOnboardingCompleted(true));
                navigation.navigate('Home');
              }}
            />
          </View>

          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
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
    // height: 100,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ECECEC',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  selectedPlanCard: {
    backgroundColor: '#FFE8E8', // soft blush pink
    borderColor: '#B95E82', // muted pink
    borderWidth: 1.5,
  },
  planLeft: {},
  // planName: {
  //   fontSize: 18,
  //   fontWeight: '700',
  //   color: '#3D4C5E',
  // },
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
    backgroundColor: '#B95E824D', // very light pink
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
    color: '#B95E82', // muted pink
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
    color: '#B95E82', // muted pink
    textAlign: 'center',
    fontFamily: 'Satoshi-Medium',
  },
});

export default PricingScreen;
