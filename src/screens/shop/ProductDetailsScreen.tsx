import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { Minus, ShoppingCart, Plus, ChevronLeft } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { ShopProduct, shopService } from '../../services/shopService';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductDetails'>;

const ProductDetailsScreen: React.FC<Props> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const [product, setProduct] = useState<ShopProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const { productId } = route.params;

  const loadCart = useCallback(async () => {
    try {
      const cart = await shopService.getMyCart();
      setCartCount(cart?.items?.length ?? 0);
    } catch {
      setCartCount(0);
    }
  }, []);

  const loadProduct = useCallback(async () => {
    try {
      setLoading(true);
      const data = await shopService.getProductById(productId);
      setProduct(data);
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Failed to load product',
        text2: error?.response?.data?.message ?? error?.message,
      });
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  }, [productId, navigation]);

  useEffect(() => {
    loadProduct();
    loadCart();
  }, [loadProduct, loadCart]);

  const handleAddToCart = async () => {
    if (!product) {
      return;
    }
    try {
      setAdding(true);
      await shopService.addToCart({ productId: product._id, quantity });
      await loadCart();
      Toast.show({ type: 'success', text1: 'Product added to cart' });
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Add to cart failed',
        text2: error?.response?.data?.message ?? error?.message,
      });
    } finally {
      setAdding(false);
    }
  };

  const categoryLabel =
    product && typeof product.category === 'object'
      ? product.category?.title || product.category?.name || ''
      : '';

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="large" color="#B95E82" />
        </View>
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loaderWrap}>
          <Text style={styles.emptyText}>Product not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
          <ChevronLeft color="#494949" size={20} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Details</Text>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => navigation.navigate('Cart')}
        >
          <ShoppingCart color="#494949" size={20} />
          {cartCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cartCount > 9 ? '9+' : cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: 300 + insets.bottom },
        ]}
      >
        <Image source={{ uri: product.image }} style={styles.image} resizeMode="cover" />

        {!!categoryLabel && (
          <View style={styles.categoryPill}>
            <Text style={styles.categoryPillText}>{categoryLabel}</Text>
          </View>
        )}

        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>${product.price}</Text>
        <Text style={styles.desc}>
          {product.description || 'No additional description available.'}
        </Text>

        <View style={styles.qtyWrap}>
          <Text style={styles.qtyLabel}>Quantity</Text>
          <View style={styles.qtyControls}>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => setQuantity(prev => Math.max(1, prev - 1))}
            >
              <Minus color="#494949" size={18} />
            </TouchableOpacity>
            <Text style={styles.qtyValue}>{quantity}</Text>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => setQuantity(prev => prev + 1)}
            >
              <Plus color="#494949" size={18} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.bottomCta, { paddingBottom: 40 + insets.bottom }]}>
        <TouchableOpacity
          style={styles.addBtn}
          disabled={adding}
          onPress={handleAddToCart}
        >
          {adding ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.addBtnText}>Add to Cart</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  loaderWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: {
    fontSize: 16,
    color: '#707070',
    fontFamily: 'Satoshi-Medium',
  },
  header: {
    marginTop: Platform.OS === 'android' ? 40 : 36,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    color: '#494949',
    fontFamily: 'Satoshi-Bold',
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ECECEC',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#B95E82',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Satoshi-Bold',
  },
  content: {
    padding: 16,
    paddingBottom: 120,
  },
  image: {
    width: '100%',
    height: 320,
    borderRadius: 20,
    backgroundColor: '#F2F2F2',
  },
  categoryPill: {
    marginTop: 14,
    alignSelf: 'flex-start',
    borderRadius: 999,
    backgroundColor: '#FFE8E8',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  categoryPillText: {
    color: '#B95E82',
    fontSize: 12,
    fontFamily: 'Satoshi-Medium',
  },
  name: {
    marginTop: 10,
    fontSize: 28,
    color: '#494949',
    fontFamily: 'Satoshi-Bold',
  },
  price: {
    marginTop: 6,
    fontSize: 26,
    color: '#B95E82',
    fontFamily: 'Satoshi-Bold',
  },
  desc: {
    marginTop: 12,
    fontSize: 15,
    lineHeight: 24,
    color: '#707070',
    fontFamily: 'Satoshi-Regular',
  },
  qtyWrap: {
    marginTop: 22,
    gap: 10,
  },
  qtyLabel: {
    fontSize: 14,
    color: '#494949',
    fontFamily: 'Satoshi-Medium',
  },
  qtyControls: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#ECECEC',
    padding: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  qtyBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F8F8',
  },
  qtyValue: {
    width: 56,
    textAlign: 'center',
    color: '#494949',
    fontSize: 16,
    fontFamily: 'Satoshi-Bold',
  },
  bottomCta: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 1,
    borderTopColor: '#ECECEC',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  addBtn: {
    height: 48,
    borderRadius: 24,
    backgroundColor: '#B95E82',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Satoshi-Bold',
  },
});

export default ProductDetailsScreen;
