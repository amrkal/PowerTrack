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
import { Badge } from "react-native-paper";

type ProductsPageRouteParams = {
  ProductsPage: { selectedType: string | null; items?: Product[]; searchQuery?: string };
};

const ProductsPage: React.FC = () => {
  const { user } = useUser();
  const { addToCart } = useCart();
  const { cart } = useCart(); // Access cart from context

  const route = useRoute<RouteProp<ProductsPageRouteParams, "ProductsPage">>();
  const navigation = useNavigation<any>();
  const selectedTypeFromRoute = route.params?.selectedType || null;
  const searchQueryFromRoute = route.params?.searchQuery || "";
  const searchItemsFromRoute = route.params?.items || null;

  const [groupedCategories, setGroupedCategories] = useState<{ [key: string]: Category[] }>({});
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(selectedTypeFromRoute);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Product[]>([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const [types, setTypes] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");


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

  useEffect(() => {
    const fetchTypesAndNavigate = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/categories/types");
        const fetchedTypes: string[] = response.data.types || [];
        setTypes(fetchedTypes);
  
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

  // Set dynamic header with back, menu, profile, and cart icons
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
      headerRight: () => (
        <View style={{ flexDirection: "row", alignItems: "center", marginRight: 15 }}>
          <MaterialIcons
            name="account-circle"
            size={24}
            color="black"
            style={{ marginRight: 15 }}
            onPress={() => navigation.navigate("ProfilePage" as never)}
          />
          <View>
            <MaterialIcons
              name="shopping-cart"
              size={24}
              color="black"
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

  // Fetch items when `searchQuery` changes
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchQuery.trim().length < 3) {
        setIsSearchActive(false);
        setItems([]);
        return;
      }

      setLoading(true);
      try {
        const response = await axiosInstance.get("/items/search", { params: { query: searchQuery.trim() } });
        setItems(response.data.items || []);
        setIsSearchActive(true);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchQuery]);



  useEffect(() => {
    console.log("Route params:", route.params);
    if (searchItemsFromRoute) {
      console.log("Search items received:", searchItemsFromRoute);
      setItems(searchItemsFromRoute);
      setIsSearchActive(true);
    }
  }, [searchItemsFromRoute]);

  const handleSearch = async () => {
    if (searchQuery.trim().length < 3) {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }
  
    setIsSearching(true);
    setLoading(true);
  
    try {
      const response = await axiosInstance.get("/items/search", {
        params: { query: searchQuery.trim() },
      });
      setSearchResults(response.data.items || []);
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setLoading(false);
    }
  };
  

  const handleAddToCart = async (item: Product, quantity: number) => {
    try {
      // Fetch the latest details for the item
      const response = await axiosInstance.get(`/items/items/priceof/${item.item_key}`, {
        params: { prices_tag: user.prices_tag }, // Pass the user's price tag as a parameter
      });
  
      const fetchedItem = response.data;
  
      if (!fetchedItem || !fetchedItem.price || !fetchedItem.item_name) {
        alert("Unable to fetch item details. Please try again.");
        return;
      }
  
      // Add the item to the cart with the fetched details
      addToCart({
        ...item,
        quantityInCart: quantity,
        price: fetchedItem.price,
        item_name: fetchedItem.item_name,
        image: fetchedItem.image || item.image || "../../assets/images/icon.png",
        name: undefined
      });
    } catch (error) {
      console.error("Error fetching item details:", error);
      alert("Failed to fetch item details. Please try again.");
    }
  };
  
  const handleScrollToTop = () => flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });

  const handleClearSearch = () => {
    setSearchQuery("");
    setIsSearchActive(false);
    setItems([]);
  };

  if (loading) return <Loader />;

  if (!user.prices_tag) {
    return <Loader />; // Show a loader until prices_tag is available
  }
  return (
    <View style={{ flex: 1 }}>
      <SearchBar searchQuery={searchQuery} onChange={setSearchQuery} onSearch={handleSearch} />
      {isSearching  ? (
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
