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
import { GlobalStyles } from "../../constants/GlobalStyles";

type ProductsPageRouteParams = {
  ProductsPage: { selectedType: string | null; items?: Product[] };
};

const ProductsPage: React.FC = () => {
  const { user } = useUser();
  const { addToCart } = useCart();

  const route = useRoute<RouteProp<ProductsPageRouteParams, "ProductsPage">>();
  const navigation = useNavigation();
  const selectedTypeFromRoute = route.params?.selectedType || null;

  const [groupedCategories, setGroupedCategories] = useState<{ [key: string]: Category[] }>({});
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(selectedTypeFromRoute);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const [numColumns, setNumColumns] = useState(2);

  // Adjust columns dynamically based on screen width
  useEffect(() => {
    const calculateColumns = () => {
      const screenWidth = Dimensions.get("window").width;
      const itemWidth = 160;
      setNumColumns(Math.max(1, Math.floor(screenWidth / itemWidth)));
    };

    calculateColumns();
    const subscription = Dimensions.addEventListener("change", calculateColumns);
    return () => subscription?.remove();
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

  // Set dynamic header with back and menu icons
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {selectedCategory !== null && (
            <MaterialIcons
              name="arrow-back"
              size={24}
              color="black"
              style={{ marginRight: 10 }}
              onPress={() => setSelectedCategory(null)}
            />
          )}
          <MaterialIcons
            name="menu"
            size={24}
            color="black"
            onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
          />
        </View>
      ),
    });
  }, [navigation, selectedCategory]);

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

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      handleClearSearch();
      return;
    }

    setLoading(true);
    setIsSearchActive(true);
    try {
      const response = await axiosInstance.get("/items/search", { params: { query: searchQuery.trim() } });
      setItems(response.data.items || []);
    } catch (error) {
      console.error("Error searching items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (item: Product, quantity: number) => {
    addToCart({ ...item, quantityInCart: quantity, image: item.image || "../../assets/images/icon.png" });
  };

  const handleScrollToTop = () => flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });

  const handleClearSearch = () => {
    setIsSearchActive(false);
    setSearchQuery("");
    setSelectedCategory(null);
  };

  if (loading) return <Loader />;

  if (!user.prices_tag) {
    return <Loader />; // Show a loader until prices_tag is available
  }
  return (
    <View style={{ flex: 1 }}>
      <SearchBar searchQuery={searchQuery} onChange={setSearchQuery} onSearch={handleSearch} />
      {isSearchActive ? (
        user.prices_tag ? ( // Check if prices_tag is available
          <ProductList
            products={items}
            onAddToCart={handleAddToCart}
            isMobile={false}
            flatListRef={flatListRef}
            onScrollToTop={handleScrollToTop}
            numColumns={numColumns}
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
            numColumns={numColumns}
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
