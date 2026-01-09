import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

const BottomNav = ({ active }: { active: 'Home' | 'Explore' | 'Schedule' | 'Profile' }) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.bottomNavBar}>
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
        <Image source={require('../assets/images/home.png')} />
        <Text style={active === 'Home' ? styles.active : styles.inactive}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Explore')}>
        <Image source={require('../assets/images/search.png')} />
        <Text style={active === 'Explore' ? styles.active : styles.inactive}>Explore</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Schedule')}>
        <Image source={require('../assets/images/calender.png')} />
        <Text style={active === 'Schedule' ? styles.active : styles.inactive}>Schedule</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Profile')}>
        <Image source={require('../assets/images/user.png')} />
        <Text style={active === 'Profile' ? styles.active : styles.inactive}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNavBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E1E1E1',
    marginBottom: 40,
  },
  navItem: {
    alignItems: 'center',
  },
  active: {
    color: '#B95E82',
    fontWeight: '500',
  },
  inactive: {
    color: '#707070',
    opacity: 0.4,
  },
});

export default BottomNav;
