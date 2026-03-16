/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { Linking, StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import Toast from 'react-native-toast-message';
import AppNavigator from './src/navigation/AppNavigator';
import { RootStackParamList } from './src/navigation/AppNavigator';
import { store, persistor } from './src/store';

const APP_CHECKOUT_CALLBACK_PREFIXES = [
  'skybornedrop://shop-checkout-result',
  'skybornedrop://payment-processing',
];
const navigationRef = createNavigationContainerRef<RootStackParamList>();

export default function App() {
  const pendingCallbackUrlRef = React.useRef<string | null>(null);
  const lastHandledUrlRef = React.useRef<string | null>(null);

  const getQueryParam = React.useCallback((url: string, key: string): string | null => {
    const [, queryString = ''] = url.split('?');
    if (!queryString) {
      return null;
    }
    const params = queryString.split('&');
    const match = params.find(part => part.split('=')[0] === key);
    if (!match) {
      return null;
    }
    const value = match.split('=').slice(1).join('=');
    return decodeURIComponent(value || '');
  }, []);

  const handleCheckoutCallback = React.useCallback((url?: string | null) => {
    const isCheckoutCallback =
      !!url && APP_CHECKOUT_CALLBACK_PREFIXES.some(prefix => url.startsWith(prefix));

    if (!url || !isCheckoutCallback || url === lastHandledUrlRef.current) {
      return false;
    }

    if (!navigationRef.isReady()) {
      pendingCallbackUrlRef.current = url;
      return true;
    }

    lastHandledUrlRef.current = url;
    pendingCallbackUrlRef.current = null;

    const status = (getQueryParam(url, 'status') || '').toLowerCase();
    if (status === 'success') {
      navigationRef.navigate('MyOrders');
      Toast.show({ type: 'success', text1: 'Payment successful', text2: 'Your order has been placed.' });
      return true;
    }

    if (status === 'cancelled' || status === 'failed') {
      navigationRef.navigate('Checkout');
      Toast.show({ type: 'error', text1: 'Payment not completed' });
      return true;
    }

    navigationRef.navigate('MyOrders');
    return true;
  }, [getQueryParam]);

  if (__DEV__) {
    require("./ReactotronConfig");
  }

  React.useEffect(() => {
    const subscription = Linking.addEventListener('url', ({ url }) => {
      handleCheckoutCallback(url);
    });

    Linking.getInitialURL()
      .then(url => {
        handleCheckoutCallback(url);
      })
      .catch(() => {
        // no-op
      });

    return () => subscription.remove();
  }, [handleCheckoutCallback]);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <StatusBar barStyle={'dark-content'} />
          <NavigationContainer
            ref={navigationRef}
            onReady={() => {
              if (pendingCallbackUrlRef.current) {
                handleCheckoutCallback(pendingCallbackUrlRef.current);
              }
            }}
          >
            <View style={styles.container}>
              <AppNavigator />
            </View>
          </NavigationContainer>
          <Toast />
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
