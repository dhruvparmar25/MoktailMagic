import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";
import { getCategories, getProductsByCategory } from "../api/auth";
import {
  AppHeader,
  CategoryPill,
  ProductCard,
  FloatingCartBar,
  PaymentToggle,
  ProductGridSkeleton,
} from "../components";
import { colors, spacing, borderRadius, typography } from "../theme";

const STAFF_NAME_KEY = "staffName";

export default function Home({ navigation }) {
  const [cart, setCart] = useState([]);
  const [paymentMode, setPaymentMode] = useState("Cash");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [staffName, setStaffName] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await getCategories();
      setCategories(res.data || []);
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Could not load categories",
      });
    }
  }, []);

  useEffect(() => {
    fetchCategories();
    AsyncStorage.getItem(STAFF_NAME_KEY).then((name) => setStaffName(name || ""));
  }, [fetchCategories]);

  useEffect(() => {
    if (!searchText.trim()) {
      setFilteredProducts(products);
    } else {
      const q = searchText.toLowerCase();
      setFilteredProducts(
        products.filter(
          (p) =>
            (p.title || "").toLowerCase().includes(q) ||
            (p.name || "").toLowerCase().includes(q)
        )
      );
    }
  }, [searchText, products]);

  const handleCategorySelect = useCallback(
    async (category) => {
      const id = category._id;
      if (selectedCategory === id) return;
      setSelectedCategory(id);
      setLoading(true);
      try {
        const res = await getProductsByCategory(id);
        setProducts(res.data || []);
      } catch (err) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Could not load products",
        });
      } finally {
        setLoading(false);
      }
    },
    [selectedCategory]
  );

  const addToCart = useCallback((product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i._id === product._id);
      if (existing) {
        return prev.map((i) =>
          i._id === product._id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  }, []);

  const decreaseQty = useCallback((product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i._id === product._id);
      if (!existing) return prev;
      if (existing.qty === 1) {
        return prev.filter((i) => i._id !== product._id);
      }
      return prev.map((i) =>
        i._id === product._id ? { ...i, qty: i.qty - 1 } : i
      );
    });
  }, []);

  const totalAmount = cart.reduce(
    (sum, item) => sum + (item.assign_price ?? item.price ?? 0) * item.qty,
    0
  );
  const itemCount = cart.reduce((s, i) => s + i.qty, 0);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchCategories();
    if (selectedCategory) {
      try {
        const res = await getProductsByCategory(selectedCategory);
        setProducts(res.data || []);
      } catch (_) {}
    }
    setRefreshing(false);
  }, [fetchCategories, selectedCategory]);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      Toast.show({ type: "success", text1: "Logged out" });
      navigation.replace("Login");
    } catch (e) {
      Toast.show({ type: "error", text1: "Error", text2: e.message });
    }
  };

  const handleProceedToPay = () => {
    if (itemCount === 0) return;
    navigation.navigate("Orders", {
      cart,
      total: totalAmount,
      paymentMode,
    });
  };

  const renderProduct = useCallback(
    ({ item, index }) => {
      const cartItem = cart.find((c) => c._id === item._id);
      return (
        <ProductCard
          item={item}
          quantity={cartItem?.qty ?? 0}
          onAdd={addToCart}
          onDecrease={decreaseQty}
          index={index}
        />
      );
    },
    [cart, addToCart, decreaseQty]
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <AppHeader
          title={staffName ? `Hello, ${staffName}` : "Hello"}
          subtitle="What would you like to order?"
          rightAction="Logout"
          onRightPress={handleLogout}
        />

        <View style={styles.searchWrap}>
          <Ionicons
            name="search-outline"
            size={20}
            color={colors.textTertiary}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            placeholderTextColor={colors.textTertiary}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        <View style={styles.categoriesWrap}>
          <FlatList
            data={categories}
            keyExtractor={(item) => item._id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContent}
            renderItem={({ item }) => (
              <CategoryPill
                label={item.name}
                selected={selectedCategory === item._id}
                onPress={() => handleCategorySelect(item)}
              />
            )}
          />
        </View>

        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item._id}
          numColumns={2}
          columnWrapperStyle={styles.productRow}
          contentContainerStyle={styles.productList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
          ListEmptyComponent={
            loading ? (
              <ProductGridSkeleton />
            ) : (
              <View style={styles.empty}>
                <Text style={styles.emptyText}>
                  {selectedCategory
                    ? searchText
                      ? "No products match your search"
                      : "No products in this category"
                    : "Select a category"}
                </Text>
              </View>
            )
          }
          renderItem={renderProduct}
        />

        {itemCount > 0 && (
          <View style={styles.paymentSection}>
            <PaymentToggle value={paymentMode} onChange={setPaymentMode} />
          </View>
        )}

        <FloatingCartBar
          itemCount={itemCount}
          totalAmount={totalAmount}
          onProceedToPay={handleProceedToPay}
          disabled={itemCount === 0}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safe: {
    flex: 1,
  },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    marginHorizontal: spacing.sm,
    marginBottom: spacing.sm,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  searchIcon: {
    marginRight: spacing.xs,
  },
  searchInput: {
    flex: 1,
    height: 44,
    ...typography.body,
    color: colors.textPrimary,
    paddingVertical: 0,
  },
  categoriesWrap: {
    marginBottom: spacing.sm,
  },
  categoriesContent: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
  },
  productRow: {
    justifyContent: "space-between",
    paddingHorizontal: spacing.sm,
  },
  productList: {
    paddingBottom: spacing.xxl + 100,
  },
  empty: {
    paddingVertical: spacing.xxxl,
    alignItems: "center",
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  paymentSection: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    paddingBottom: spacing.sm,
  },
});
