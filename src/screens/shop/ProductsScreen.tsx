import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import BottomNav from '../../components/BottomNav';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {
  ProductSort,
  ShopCategory,
  ShopProduct,
  shopService,
} from '../../services/shopService';
import { Search, ShoppingCart, SlidersHorizontal } from 'lucide-react-native';

type ProductsNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Products'
>;
type ProductListItem = ShopProduct | string;

// ─── Palette ───────────────────────────────────────────────────────────────
const C = {
  bg: '#FAF8F6',
  surface: '#FFFFFF',
  border: '#F0EDE9',
  accent: '#B95E82',
  accentLight: '#FDF0F5',
  accentMid: '#F5D6E4',
  text: '#2C2C2C',
  sub: '#5F5F5F',
  muted: '#818181',
  price: '#B95E82',
};

const ProductsScreen = () => {
  const navigation = useNavigation<ProductsNavigationProp>();
  const { width } = useWindowDimensions();

  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [categories, setCategories] = useState<ShopCategory[]>([]);
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState<ProductSort>('newest');
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [addingProductId, setAddingProductId] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [searchFocused, setSearchFocused] = useState(false);

  const numColumns = width >= 900 ? 3 : width < 390 ? 1 : 2;
  const skeletonItems = useMemo(
    () => Array.from({ length: numColumns * 4 }, (_, index) => `skeleton-${index}`),
    [numColumns],
  );
  const listData: ProductListItem[] = loading ? skeletonItems : products;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const loadCartCount = useCallback(async () => {
    try {
      const cart = await shopService.getMyCart();
      setCartCount(cart?.items?.length ?? 0);
    } catch {
      setCartCount(0);
    }
  }, []);

  const loadCategories = useCallback(async () => {
    try {
      const data = await shopService.getActiveServices();
      setCategories(data);
    } catch {
      setCategories([]);
    }
  }, []);

  const loadProducts = useCallback(async () => {
    try {
      const data = await shopService.getPublishedProducts({
        search: debouncedSearch || undefined,
        categoryId: category || undefined,
        sortBy,
      });
      setProducts(data);
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Failed to load products',
        text2: error?.response?.data?.message ?? error?.message,
      });
      setProducts([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [debouncedSearch, category, sortBy]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    setLoading(true);
    loadProducts();
  }, [loadProducts]);

  useFocusEffect(
    useCallback(() => {
      loadCartCount();
    }, [loadCartCount]),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadProducts(), loadCartCount()]);
  };

  const handleAddToCart = async (productId: string) => {
    try {
      setAddingProductId(productId);
      await shopService.addToCart({ productId, quantity: 1 });
      await loadCartCount();
      Toast.show({ type: 'success', text1: '✓ Added to cart' });
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Oops! Try again',
        text2: error?.response?.data?.message ?? error?.message,
      });
    } finally {
      setAddingProductId(null);
    }
  };

  const sortOptions: Array<{ label: string; value: ProductSort }> = useMemo(
    () => [
      { label: 'Newest', value: 'newest' },
      { label: 'Price ↑', value: 'price-low' },
      { label: 'Price ↓', value: 'price-high' },
    ],
    [],
  );

  // ─── Product Card ─────────────────────────────────────────────────────────
  const renderProduct = ({ item, index }: { item: ShopProduct; index: number }) => {
    const isAdding = addingProductId === item._id;
    const isOdd = index % 2 !== 0;
    const cardWidthStyle =
      numColumns === 1
        ? styles.cardSingle
        : numColumns === 3
          ? styles.cardTriple
          : styles.cardDouble;

    return (
      <TouchableOpacity
        activeOpacity={0.88}
        onPress={() =>
          navigation.navigate('ProductDetails', { productId: item._id })
        }
        style={[
          styles.card,
          cardWidthStyle,
          numColumns > 1 && isOdd && styles.cardOffset,
        ]}
      >
        <View style={styles.cardImageWrap}>
          <Image
            source={{ uri: item.image }}
            style={styles.cardImage}
            resizeMode="cover"
          />
        </View>

        <View style={styles.cardBody}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.cardDesc} numberOfLines={2}>
            {item.description || 'Wellness essential'}
          </Text>

          <View style={styles.cardFooter}>
            <Text style={styles.cardPrice}>${item.price}</Text>
            <TouchableOpacity
              style={[styles.addBtn, isAdding && styles.addBtnLoading]}
              disabled={isAdding}
              onPress={() => handleAddToCart(item._id)}
            >
              {isAdding ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.addBtnText}>+ Cart</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSkeletonCard = ({ index }: { index: number }) => {
    const isOdd = index % 2 !== 0;
    const cardWidthStyle =
      numColumns === 1
        ? styles.cardSingle
        : numColumns === 3
          ? styles.cardTriple
          : styles.cardDouble;
    return (
      <View
        style={[
          styles.card,
          cardWidthStyle,
          numColumns > 1 && isOdd && styles.cardOffset,
        ]}
      >
        <View style={[styles.cardImageWrap, styles.skeletonImage]} />
        <View style={styles.cardBody}>
          <View style={[styles.skeletonLine, styles.skeletonTitle]} />
          <View style={[styles.skeletonLine, styles.skeletonDesc]} />
          <View style={[styles.skeletonLine, styles.skeletonDescShort]} />

          <View style={styles.cardFooter}>
            <View style={[styles.skeletonLine, styles.skeletonPrice]} />
            <View style={styles.skeletonAddBtn} />
          </View>
        </View>
      </View>
    );
  };

  // ─── List Header ──────────────────────────────────────────────────────────
  const ListHeader = () => (
    <>
      {/* Hero */}
      <View style={styles.heroSection}>
        <View style={styles.heroTextWrap}>
          {/* <Text style={styles.heroEyebrow}>✦  Skyborne Shop</Text> */}
          <Text style={styles.heroTitle}>Curated Wellness</Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('Cart')}
          style={styles.cartButton}
        >
          <ShoppingCart color={C.text} size={20} strokeWidth={1.8} />
          {cartCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>
                {cartCount > 9 ? '9+' : cartCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={[styles.searchWrap, searchFocused && styles.searchWrapFocused]}>
        <Search color={searchFocused ? C.accent : C.muted} size={16} strokeWidth={2} />
        <TextInput
          placeholder="Search products..."
          placeholderTextColor={C.muted}
          value={searchInput}
          onChangeText={setSearchInput}
          style={styles.searchInput}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
        {searchInput.length > 0 && (
          <TouchableOpacity onPress={() => setSearchInput('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={styles.searchClear}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsWrap}
      >
        <TouchableOpacity
          style={[styles.chip, !category && styles.chipActive]}
          onPress={() => setCategory('')}
        >
          <Text style={[styles.chipText, !category && styles.chipTextActive]}>
            All
          </Text>
        </TouchableOpacity>
        {categories.map(item => {
          const label = item.title || item.name || 'Category';
          const isActive = category === item._id;
          return (
            <TouchableOpacity
              key={item._id}
              style={[styles.chip, isActive && styles.chipActive]}
              onPress={() => setCategory(item._id)}
            >
              <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Sort */}
      <View style={styles.sortRow}>
        <SlidersHorizontal color={C.sub} size={13} strokeWidth={2} />
        <Text style={styles.sortLabel}>Sort:</Text>
        {sortOptions.map(opt => {
          const isActive = sortBy === opt.value;
          return (
            <TouchableOpacity
              key={opt.value}
              style={[styles.sortChip, isActive && styles.sortChipActive]}
              onPress={() => setSortBy(opt.value)}
            >
              <Text style={[styles.sortChipText, isActive && styles.sortChipTextActive]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Count */}
      {!loading && (
        <Text style={styles.countText}>
          {products.length} {products.length === 1 ? 'product' : 'products'}
        </Text>
      )}
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      <FlatList
        data={listData}
        key={`cols-${numColumns}`}
        numColumns={numColumns}
        keyExtractor={(item, index) =>
          typeof item === 'string' ? item : `${item._id}-${index}`
        }
        renderItem={({ item, index }) =>
          typeof item === 'string'
            ? renderSkeletonCard({ index })
            : renderProduct({ item, index })
        }
        ListHeaderComponent={<ListHeader />}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={numColumns > 1 ? styles.row : undefined}
        refreshing={refreshing}
        onRefresh={onRefresh}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyIcon}>🌿</Text>
              <Text style={styles.emptyTitle}>Nothing here yet</Text>
              <Text style={styles.emptyText}>
                Try a different filter or search term
              </Text>
            </View>
          ) : null
        }
      />

      <BottomNav active="Products" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
  },

  // ── Hero ──────────────────────────────────────────────────────────────────
  heroSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 36,
    paddingBottom: 16,
  },
  heroTextWrap: {
    flex: 1,
  },
  heroEyebrow: {
    fontSize: 11,
    color: C.accent,
    fontFamily: 'Satoshi-Medium',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  heroTitle: {
    fontSize: 30,
    color: C.text,
    fontFamily: 'Satoshi-Bold',
    lineHeight: 38,
    letterSpacing: -0.5,
  },
  cartButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cartBadge: {
    position: 'absolute',
    top: -3,
    right: -3,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: C.accent,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: C.bg,
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontFamily: 'Satoshi-Bold',
  },

  // ── Search ────────────────────────────────────────────────────────────────
  searchWrap: {
    marginHorizontal: 20,
    borderWidth: 1.5,
    borderColor: C.border,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 11,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: C.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  searchWrapFocused: {
    borderColor: C.accent,
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  searchInput: {
    flex: 1,
    color: C.text,
    fontFamily: 'Satoshi-Regular',
    fontSize: 15,
    lineHeight: 21,
    padding: 0,
  },
  searchClear: {
    color: C.muted,
    fontSize: 13,
    paddingHorizontal: 4,
  },

  // ── Chips ─────────────────────────────────────────────────────────────────
  chipsWrap: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 4,
    gap: 8,
  },
  chip: {
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: C.surface,
    borderWidth: 1.5,
    borderColor: C.border,
  },
  chipActive: {
    backgroundColor: C.accent,
    borderColor: C.accent,
  },
  chipText: {
    color: C.sub,
    fontSize: 14,
    fontFamily: 'Satoshi-Medium',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },

  // ── Sort ─────────────────────────────────────────────────────────────────
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
    gap: 8,
  },
  sortLabel: {
    color: C.sub,
    fontSize: 13,
    fontFamily: 'Satoshi-Medium',
  },
  sortChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: C.border,
  },
  sortChipActive: {
    backgroundColor: C.accentLight,
    borderColor: C.accentMid,
  },
  sortChipText: {
    color: C.sub,
    fontSize: 13,
    fontFamily: 'Satoshi-Regular',
  },
  sortChipTextActive: {
    color: C.accent,
    fontFamily: 'Satoshi-Medium',
  },

  // ── Count ────────────────────────────────────────────────────────────────
  countText: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 6,
    color: C.muted,
    fontSize: 13,
    fontFamily: 'Satoshi-Regular',
  },

  // ── FlatList ──────────────────────────────────────────────────────────────
  listContent: {
    paddingHorizontal: 14,
    paddingBottom: 110,
    flexGrow: 1,
  },
  row: {
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  // ── Card ─────────────────────────────────────────────────────────────────
  card: {
    backgroundColor: C.surface,
    borderRadius: 20,
    marginBottom: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: C.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },
  cardSingle: {
    width: '100%',
  },
  cardDouble: {
    width: '48.4%',
  },
  cardTriple: {
    width: '31.8%',
  },
  // Staggered grid offset for odd cards
  cardOffset: {
    marginTop: 18,
  },
  cardImageWrap: {
    width: '100%',
    height: 150,
    backgroundColor: '#F5F1EE',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardBody: {
    padding: 14,
  },
  cardTitle: {
    color: C.text,
    fontSize: 16,
    lineHeight: 21,
    fontFamily: 'Satoshi-Bold',
    letterSpacing: -0.1,
  },
  cardDesc: {
    marginTop: 5,
    color: C.sub,
    fontSize: 13,
    fontFamily: 'Satoshi-Regular',
    lineHeight: 19,
    minHeight: 38,
  },
  cardFooter: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardPrice: {
    color: C.price,
    fontSize: 20,
    fontFamily: 'Satoshi-Bold',
    letterSpacing: -0.3,
  },
  addBtn: {
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 13,
    backgroundColor: C.accent,
    minWidth: 72,
    minHeight: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnLoading: {
    opacity: 0.75,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontFamily: 'Satoshi-Bold',
    letterSpacing: 0.2,
  },

  // ── Skeleton ──────────────────────────────────────────────────────────────
  skeletonImage: {
    backgroundColor: '#EFEAE6',
  },
  skeletonLine: {
    backgroundColor: '#EFEAE6',
    borderRadius: 8,
  },
  skeletonTitle: {
    width: '78%',
    height: 13,
  },
  skeletonDesc: {
    marginTop: 8,
    width: '92%',
    height: 10,
  },
  skeletonDescShort: {
    marginTop: 6,
    width: '65%',
    height: 10,
  },
  skeletonPrice: {
    width: 52,
    height: 16,
  },
  skeletonAddBtn: {
    width: 64,
    height: 30,
    borderRadius: 999,
    backgroundColor: '#E7DDD8',
  },

  // ── Empty ─────────────────────────────────────────────────────────────────
  emptyWrap: {
    flex: 1,
    minHeight: 260,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 6,
  },
  emptyTitle: {
    color: C.text,
    fontSize: 18,
    fontFamily: 'Satoshi-Bold',
  },
  emptyText: {
    color: C.muted,
    fontSize: 13,
    fontFamily: 'Satoshi-Regular',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});

export default ProductsScreen;
