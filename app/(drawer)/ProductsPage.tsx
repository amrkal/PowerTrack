import React, { useState, useEffect, useRef } from "react";
import { Text, TextInput, Button, IconButton, } from "react-native-paper";
import { View, FlatList, Image, TouchableOpacity, Animated,StyleSheet  } from 'react-native';
import { GlobalStyles } from "../../constants/GlobalStyles";
import { Color } from '../../constants/Color';
import axios from 'axios'; // Import axios if you prefer using it
import { useCart } from '../context/CartContext';


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
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showCategories, setShowCategories] = useState(true); // Manage visibility of categories
  const [showBackToTop, setShowBackToTop] = useState(false); // Manage visibility of the back-to-top button
  const scrollY = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList<any>>(null); // For accessing the flatlist
  const { addToCart } = useCart();

  useEffect(() => {
    axios.get('/items/items',)
      .then(response => {
        console.log(response.data); // Log the response to check its structure
        const products: Product[] = response.data.items.map((item: any) => ({
          id: item.id,
          item_key: item.item_key,
          item_name: item.item_name,
          description: item.description || 'No description available',
          price: item.price || 0,
          currency: item.currency || 'N/A',
          purch_price: item.purch_price || 0,
          quantity: item.quantity || 1,
          discount_code: item.discount_code || '',
          categoryId: item.categoryId || '1', // Ensure categoryId is mapped from the response
          image: item.image || null // Ensure the image is set or null
        }));
        setItems(products);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching products:", error);
        setLoading(false);
      });
  }, []);
  
  

  const filteredProducts = items.filter(product => {
    // Check if the selected category is 'all' or if the product's categoryId matches the selected category
    const matchesCategory = selectedCategory === 'all' || selectedCategory === 'viewAll' || product.categoryId === selectedCategory;
    
    // Ensure search query is properly compared to product name (case insensitive)
    const itemName = product.item_name || ''; 
    const matchesSearch = searchQuery.trim() === '' || itemName.toLowerCase().includes(searchQuery.toLowerCase()); 
    
    return matchesCategory && matchesSearch;
  });
  const handleIncreaseQuantity = () => {
    qty = qty + 1;
  };

  const handleDecreaseQuantity = () => {
    qty = qty - 1;
  };

  const handleAddToCart = (item: Product) => {
    addToCart({
      ...item,
      name: item.item_name, // Map 'item_name' to 'name'
      quantityInCart: 1,    // Initial quantity for the cart
      image: item.image || '../../assets/images/icon.png'  // Ensure 'image' is always a string
    });
  };

  // Detect scroll direction and update category visibility
  let lastScrollY = 0;
  const handleScroll = (event: any) => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    const direction = currentOffset - lastScrollY > 0 ? 'down' : 'up';

    if (direction === 'down' && currentOffset > 100) {
      setShowCategories(false);
    } else if (direction === 'up') {
      setShowCategories(true);
    }

    // Show back-to-top button if scrolled down
    if (currentOffset > 500) {
      setShowBackToTop(true);
    } else {
      setShowBackToTop(false);
    }

    lastScrollY = currentOffset;
  };

  const handleBackToTop = () => {
    flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
  };


  const ProductItem: React.FC<{ item: Product }> = React.memo(({ item }) => {
    return (
      <View style={GlobalStyles.productContainer}>
        <Text style={GlobalStyles.productName}>{item.item_name}</Text>
        <Text style={GlobalStyles.productPrice}>{`${item.currency} ${item.price}`}</Text>
        <Image
          source={item.image ? { uri: item.image } : require('../../assets/images/icon.png')}
          style={{ width: 100, height: 100 }}
        />
        <Text style={GlobalStyles.productName}>{item.description}</Text>
        <View style={GlobalStyles.quantityContainer}>
          <Button
            mode="contained"
            onPress={() => handleDecreaseQuantity()}
            compact
            style={{ marginRight: 10, minWidth: 40, height: 30 }}
            labelStyle={{ fontSize: 20, lineHeight: 17 }}
          >
            -
          </Button>
          <Text style={{ marginTop: 3 }}>{qty}</Text>
          <Button
            mode="contained"
            onPress={() => handleIncreaseQuantity()}
            compact
            style={{ marginLeft: 10, minWidth: 40, height: 30 }}
            labelStyle={{ fontSize: 20, lineHeight: 17 }}
          >
            +
          </Button>
        </View>
        <Button
          mode="contained"
          style={{ marginTop: 1 }}
          onPress={() => handleAddToCart(item)}>
          Add to Cart
        </Button>
      </View>
    );
  });
  


  if (loading) {
    return <Text>Loading...</Text>; // Or any loading indicator you prefer
  }

  return (
    <View style={GlobalStyles.container}>
      <TextInput
        style={GlobalStyles.searchBar}
        placeholder="Search Products"
        value={searchQuery} // Bind search query to input
        onChangeText={setSearchQuery} // Update state as user types
      />
      {showCategories && ( // Only show categories when `showCategories` is true
        <View>
          <FlatList
            data={categories}
            horizontal
            renderItem={({ item }) => (
              <Button
                mode={item.id === selectedCategory ? "contained" : "outlined"}
                onPress={() => setSelectedCategory(item.id)}
                style={{ marginRight: 3 }}
              >
                {item.name}
              </Button>
            )}
            keyExtractor={item => item.id}
          />
        </View>
      )}
      <Animated.FlatList
        ref={flatListRef} // Reference to the FlatList
        data={filteredProducts}  // Use filteredProducts instead of items
        renderItem={({ item }) => <ProductItem item={item} />}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        onScroll={handleScroll} // Handle scrolling event
        scrollEventThrottle={16}
        getItemLayout={(data, index) => (
          { length: 200, offset: 200 * index, index }
        )}
      />

      {showBackToTop && ( // Show back-to-top button when scrolled down
        <TouchableOpacity
          style={GlobalStyles.backToTopButton}
          onPress={handleBackToTop}
        >
          <IconButton icon="arrow-up" size={24} />
        </TouchableOpacity>
      )}
    </View>
  );
  
};


export default ProductsPage;














































//   return (
//     <View style={GlobalStyles.container}>
//       <TextInput
//         style={GlobalStyles.searchBar}
//         placeholder="Search Products"
//         value={searchQuery} // Bind search query to input
//         onChangeText={setSearchQuery} // Update state as user types
//       />
      
//       <View>
//         <FlatList
//           data={categories}
//           horizontal
//           renderItem={({ item }) => (
//             <Button
//               mode={item.id === selectedCategory ? "contained" : "outlined"}
//               onPress={() => setSelectedCategory(item.id)}
//               style={{ marginRight: 3 }}
//             >
//               {item.name}
//             </Button>
//           )}
//           keyExtractor={item => item.id}
//         />
//       </View>
//       <FlatList
//         data={filteredProducts}
//         renderItem={({ item }) => (
//           <ProductItem item={item} />
//         )}
//         keyExtractor={item => item.id}
//         numColumns={2}
//         columnWrapperStyle={{ justifyContent: "space-between" }}
//       />
//     </View>
//   );
// };

// export default ProductsPage;