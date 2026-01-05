import React from 'react';
import { TextInput as RNInput, StyleSheet, View, TextInputProps } from 'react-native';

export default function TextInput(props: TextInputProps & { value?: string }) {
  return (
    <View style={styles.wrapper}>
      <RNInput style={styles.input} placeholderTextColor="#999" {...props} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 12 },
  input: { padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#e6e6e6' },
});
