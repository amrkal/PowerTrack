import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, FlatList, Text, Dimensions } from "react-native";
import { useRoute, RouteProp, useNavigation, DrawerActions, useFocusEffect } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import axiosInstance from "../../services/axiosInstance";
import CategoryList from "../../components/CategoryList";
import ProductList from "../../components/ProductList";
import SearchBar from "../../components/SearchBar";
import Loader from "../../components/Loader";
import { useCart } from "../context/CartContext";
import { useUser } from "../context/UserContext";
import { Product, Category } from "../../components/types";
import { Colors } from "../../constants/Colors";
import { Badge } from "react-native-paper";

type ProductsPageRouteParams = {
  ProductsPage: { selectedType: string | null; items?: Product[]; searchQuery?: string };
};

const ProductsPage: React.FC = () => {
  const { user } = useUser();
  const { cart, addToCartAsync } = useCart();

  const route = useRoute<RouteProp<ProductsPageRouteParams, "ProductsPage">>();
  const navigation = useNavigation<any>();
  const selectedTypeFromRoute = route.params?.selectedType || null;
  const searchItemsFromRoute = route.params?.items || null;

  const [groupedCategories, setGroupedCategories] = useState<{ [key: string]: Category[] }>({});
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(selectedTypeFromRoute);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Product[]>([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const [isSearching, setIsSearching] = useState(false);


  // Set dynamic header with back, menu, profile, and cart icons
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <MaterialIcons
            name="menu"
            size={30}
            color={Colors.light.primary}
            onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
          />
        </View>
      ),
      headerLeft: () => (
        <View style={{ flexDirection: "row", alignItems: "center", marginLeft: 15 }}>
            {selectedCategory !== null && (
            <MaterialIcons
              name="arrow-back"
              size={30}
              color="#1E3A8A"
              style={{ marginRight: 10 }}
              onPress={() => setSelectedCategory(null)}
            />
          )}
          <MaterialIcons
            name="account-circle"
            size={30}
            color={Colors.light.primary}
            style={{ marginRight: 15 }}
            onPress={() => navigation.navigate("ProfilePage" as never)}
          />
          <View>
            <MaterialIcons
              name="shopping-cart"
              size={30}
              color={Colors.light.primary}
              onPress={() => navigation.navigate("MyCartPage" as never)}
            />
            {cart.length > 0 && ( // Display badge only if there are items in the cart
              <Badge
                style={{
                  position: "absolute",
                  top: -4,
                  right: -10,
                  backgroundColor: "red",
                  color: "white",
                }}
              >
                {cart.reduce((total, item) => total + item.quantityInCart, 0)}
              </Badge>
            )}
          </View>
        </View>
      ),
    });
  }, [navigation, selectedCategory, cart]);






  useEffect(() => {
    const fetchTypesAndNavigate = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/categories/types");
        const fetchedTypes: string[] = response.data.types || [];

  
        if (fetchedTypes.length > 0) {
          const firstType = fetchedTypes[0];
          setSelectedType(firstType);
  
          // Correctly pass the selectedType to ProductsPage
          navigation.navigate("ProductsPage" as never, { selectedType: firstType } as never);
        }
      } catch (error) {
        console.error("Error fetching types:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchTypesAndNavigate();
  }, []);
  


  // Handle focus and reset states
  useFocusEffect(
    useCallback(() => {
      if (selectedType !== selectedTypeFromRoute) {
        setSelectedType(selectedTypeFromRoute);
        resetStates();
      }
    }, [selectedTypeFromRoute])
  );

  // Reset states for categories and items
  const resetStates = () => {
    setSelectedCategory(null);
    setGroupedCategories({});
    setIsSearchActive(false);
    setItems([]);
  };


  // Fetch categories
  useEffect(() => {
    if (!selectedType) return;

    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/categories/categories");
        const data = typeof response.data === "string" ? JSON.parse(response.data.replace(/NaN/g, '"Unknown"')) : response.data;

        const fetchedCategories: Category[] = data.categories || [];
        if (fetchedCategories.length) {
          const grouped = fetchedCategories.reduce<{ [key: string]: Category[] }>((acc, category) => {
            const globalCategory = category.globalCategory || "Other";
            if (!acc[globalCategory]) acc[globalCategory] = [];
            acc[globalCategory].push(category);
            return acc;
          }, {});
          setGroupedCategories(grouped);
        } else {
          console.warn("No categories found in the response");
          setGroupedCategories({});
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [selectedType]);

  // Fetch items based on the selected category
  useEffect(() => {
    if (!isSearchActive && selectedCategory !== null) {
      const fetchItems = async () => {
        setLoading(true);
        try {
          const response = await axiosInstance.get(`/items/items/price/${selectedCategory}?priceListNumber=${user.prices_tag}`);
          setItems(response.data.items || []);
        } catch (error) {
          console.error("Error fetching products:", error);
        } finally {
          setLoading(false);
        }
      };  
      fetchItems();
    }
  }, [selectedCategory, user.prices_tag, isSearchActive]);

  useEffect(() => {
    console.log("Route params:", route.params);
    if (searchItemsFromRoute) {
      console.log("Search items received:", searchItemsFromRoute);
      setItems(searchItemsFromRoute);
      setIsSearchActive(true);
    }
  }, [searchItemsFromRoute]);












  
  const handleScrollToTop = () => flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });


  if (loading) return <Loader />;

  const handleAddToCart = async (item: Product, quantity: number) => {
    await addToCartAsync(item, quantity, user.prices_tag ?? '');
  };

  if (!user.prices_tag) {
    return <Loader />; // Show a loader until prices_tag is available
  }
  return (
    <View style={{ flex: 1 }}>
      <SearchBar
        onResults={(results) => {
          setItems(results);   // Update product list
          setIsSearching(results.length > 0);  // Set search state
        }}
      />

      {isSearching  ? (
        user.prices_tag ? ( // Check if prices_tag is available
          <ProductList
            products={items}
            onAddToCart={handleAddToCart}
            isMobile={false}
            flatListRef={flatListRef}
            onScrollToTop={handleScrollToTop}
            numColumns={2}
            pricesTag={user.prices_tag} // Pass only if prices_tag is available
          />
        ) : (
          <Text style={{ textAlign: 'center', marginTop: 20 }}>
            Loading price tag information...
          </Text>
        )
      ) : selectedType && !selectedCategory ? (
        <FlatList
          ref={flatListRef}
          data={Object.keys(groupedCategories).filter(
            (globalCategory) =>
              groupedCategories[globalCategory]?.some(
                (category) =>
                  category.type.trim().toLowerCase() ===
                  selectedType?.trim().toLowerCase()
              )
          )}
          renderItem={({ item }) => {
            const globalCategory = item;
            const filteredCategories =
              groupedCategories[globalCategory]?.filter(
                (category) =>
                  category.type.trim().toLowerCase() ===
                  selectedType?.trim().toLowerCase()
              ) || [];
  
            return (
              <CategoryList
                categories={filteredCategories}
                onSelectCategory={setSelectedCategory}
                isMobile={true}
                globalCategory={globalCategory}
              />
            );
          }}
          keyExtractor={(item) => item}
        />
      ) : selectedCategory ? (
        user.prices_tag ? ( // Check if prices_tag is available
          <ProductList
            products={items}
            onAddToCart={handleAddToCart}
            isMobile={false}
            flatListRef={flatListRef}
            onScrollToTop={handleScrollToTop}
            numColumns={2}
            pricesTag={user.prices_tag} // Pass only if prices_tag is available
          />
        ) : (
          <Text style={{ textAlign: 'center', marginTop: 20 }}>
            Loading price tag information...
          </Text>
        )
      ) : null}
    </View>
  );
};

export default ProductsPage;
