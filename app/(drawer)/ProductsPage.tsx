import React, { useState, useEffect, useRef, createContext, useContext } from "react";
import { Text, TextInput, Button, IconButton, } from "react-native-paper";
import { View, FlatList, Image, TouchableOpacity, Animated,StyleSheet  } from 'react-native';
import { GlobalStyles } from "../../constants/GlobalStyles";
import { Color } from '../../constants/Color';
import axios from 'axios'; // Import axios if you prefer using it
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext'; // Import useUser

const categories = [
  { id: 'all', name: 'All' }, 
  { id: '1', name: 'Electronics' },
  { id: '2', name: 'Clothing' },
  { id: '3', name: 'Home Appliances' },
  { id: '4', name: 'Books' },
  { id: 'viewAll', name: 'View All' },
];



interface Product {
  id: string;
  item_key: string;
  item_name: string;
  description: string;
  price: number;
  currency: string;
  purch_price: number;
  quantity: number;
  discount_code: string;
  categoryId?: string;
  image?: string;
}
interface CartItem extends Product {
  quantityInCart: number;
}


const baseURL = 'http://192.168.0.153:5000';
axios.defaults.baseURL = baseURL;
axios.defaults.timeout = 10000;

let qty = 1;


const ProductsPage: React.FC = () => {
  const { user } = useUser(); // Access the user context which includes prices_tag
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showCategories, setShowCategories] = useState(true);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const scrollY = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList<any>>(null);
  const { addToCart } = useCart();

  // Fetch items with pagination
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(`/items/items`, {
          params: {
            page: page,
            prices_tag: user.prices_tag, // Send user's prices_tag to backend
          },
          timeout: 30000
        });

        const fetchedItems = response.data.items.map((item: any) => ({
          ...item,
          price: item.price,  // Use the price returned by the backend
        }));
        setItems((prevItems) => [...prevItems, ...fetchedItems]);
        setHasMore(response.data.hasMore);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchItems();
  }, [page, user.prices_tag]); // Fetch data again if prices_tag changes



  const handleAddToCart = (item: Product, quantity: number) => {
    addToCart({
      ...item,
      name: item.item_name,
      quantityInCart: quantity,
      price: item.price,
      image: item.image || '../../assets/images/icon.png',
    });
  };

  const handleScroll = (event: any) => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    const direction = currentOffset - (event.nativeEvent.contentOffset.y || 0) > 0 ? 'down' : 'up';

    if (direction === 'down' && currentOffset > 100) {
      setShowCategories(false);
    } else if (direction === 'up') {
      setShowCategories(true);
    }

    if (currentOffset > 500) {
      setShowBackToTop(true);
    } else {
      setShowBackToTop(false);
    }
  };

  const handleBackToTop = () => {
    flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
  };

  const loadMoreItems = () => {
    if (hasMore && !loading) {
      setPage((prevPage) => prevPage + 1); // Load the next page
    }
  };

  const filteredProducts = items.filter(product => {
    const matchesCategory = selectedCategory === 'all' || selectedCategory === 'viewAll' || product.categoryId === selectedCategory;
    const itemName = product.item_name || '';
    const matchesSearch = searchQuery.trim() === '' || itemName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const ProductItem = React.memo(({ item, onAddToCart }: { item: Product, onAddToCart: (item: Product, quantity: number) => void }) => {
    const [quantityInCart, setQuantityInCart] = useState(1);

    const handleIncreaseQuantity = () => {
      setQuantityInCart(prevQty => prevQty + 1);
    };

    const handleDecreaseQuantity = () => {
      setQuantityInCart(prevQty => (prevQty > 1 ? prevQty - 1 : 1));
    };

    return (
      <View style={GlobalStyles.productContainer}>
        <Text style={GlobalStyles.productName}>{item.item_name}</Text>
        <Text style={GlobalStyles.productPrice}>{`₪ ${item.price}`}</Text>
        <Image
          source={item.image ? { uri: item.image } : require('../../assets/images/icon.png')}
          style={{ width: 100, height: 100 }}
          resizeMode="cover"
        />
        <Text>{item.description}</Text>
        <View style={GlobalStyles.quantityContainer}>
          <Button mode="contained" onPress={handleDecreaseQuantity} compact style={{ marginRight: 10, minWidth: 40, height: 30 }} labelStyle={{ fontSize: 20, lineHeight: 17 }}>-</Button>
          <Text style={{ marginTop: 3 }}>{quantityInCart}</Text>
          <Button mode="contained" onPress={handleIncreaseQuantity} compact style={{ marginLeft: 10, minWidth: 40, height: 30 }} labelStyle={{ fontSize: 20, lineHeight: 17 }}>+</Button>
        </View>
        <Button mode="contained" style={{ marginTop: 10 }} onPress={() => onAddToCart(item, quantityInCart)}>
          Add to Cart
        </Button>
      </View>
    );
  });

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={GlobalStyles.container}>
      <TextInput
        style={GlobalStyles.searchBar}
        placeholder="Search Products"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      {showCategories && (
        <View>
          <FlatList
            data={categories}
            horizontal
            renderItem={({ item }) => (
              <Button mode={item.id === selectedCategory ? "contained" : "outlined"} onPress={() => setSelectedCategory(item.id)} style={{ marginRight: 3 }}>
                {item.name}
              </Button>
            )}
            keyExtractor={item => item.id}
          />
        </View>
      )}
      <FlatList
        data={filteredProducts}
        renderItem={({ item }) => <ProductItem item={item} onAddToCart={handleAddToCart} />}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        keyExtractor={(item) => item.id} // Ensure each product has a unique id
        onEndReached={loadMoreItems}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() => (hasMore ? <Text>Loading more items...</Text> : <Text>No more items</Text>)}
      />
      {showBackToTop && (
        <TouchableOpacity style={GlobalStyles.backToTopButton} onPress={handleBackToTop}>
          <IconButton icon="arrow-up" size={24} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ProductsPage;
