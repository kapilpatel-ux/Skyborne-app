import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import GradientBackground from '../../components/GradientBackground';

export default function HomeScreen() {
  return (
    <GradientBackground>
      <View style={styles.container}>
        <Text style={styles.title}>Home (placeholder)</Text>
        <Text style={{ color: '#666' }}>This is the future main app screen.</Text>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, justifyContent: 'center', flex: 1 },
  title: { fontSize: 22, fontWeight: '700' },
});
