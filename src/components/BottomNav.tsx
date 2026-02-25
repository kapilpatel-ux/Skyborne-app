import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { ShoppingBag } from 'lucide-react-native';

const BottomNav = ({
  active,
}: {
  active: 'Home' | 'Explore' | 'Products' | 'Schedule' | 'Profile';
}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.bottomNavBar}>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate('Home')}
      >
        <Image
          source={{
            uri: 'https://skyborne-images.s3.ap-south-1.amazonaws.com/home.png',
          }}
          style={styles.icon}
        />
        <Text style={active === 'Home' ? styles.active : styles.inactive}>
          Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate('Explore')}
      >
        <Image
          source={{
            uri: 'https://skyborne-images.s3.ap-south-1.amazonaws.com/search.png',
          }}
          style={styles.icon}
        />
        <Text style={active === 'Explore' ? styles.active : styles.inactive}>
          Explore
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate('Schedule')}
      >
        <Image
          source={{
            uri: 'https://skyborne-images.s3.ap-south-1.amazonaws.com/calender.png',
          }}
          style={styles.icon}
        />
        <Text style={active === 'Schedule' ? styles.active : styles.inactive}>
          Schedule
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate('Products')}
      >
        <ShoppingBag
          size={22}
          color={active === 'Products' ? '#B95E82' : '#707070'}
          style={active === 'Products' ? undefined : styles.iconFaded}
        />
        <Text style={active === 'Products' ? styles.active : styles.inactive}>
          Shop
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate('Profile')}
      >
        <Image
          source={{
            uri: 'https://skyborne-images.s3.ap-south-1.amazonaws.com/user.png',
          }}
          style={styles.icon}
        />
        <Text style={active === 'Profile' ? styles.active : styles.inactive}>
          Profile
        </Text>
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
    // marginBottom: 40,
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
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
  iconFaded: {
    opacity: 0.8,
  },
});

export default BottomNav;
