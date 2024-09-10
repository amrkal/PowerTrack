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
        const response = await axios.get(`/items/items?page=${page}`, { timeout: 30000 });
        const fetchedItems = response.data.items.map((item: any) => ({
          id: item.id,
          item_key: item.item_key,
          item_name: item.item_name,
          description: item.description || item.item_name,
          price: item.price || 0,
          currency: item.currency || 'N/A',
          quantity: 1,
          discount_code: item.discount_code || '',
          categoryId: item.categoryId || '1',
          image: item.image || null,
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
  }, [page]);

  const handleAddToCart = (item: Product, quantity: number) => {
    addToCart({
      ...item,
      name: item.item_name,
      quantityInCart: quantity,
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
        <Text style={GlobalStyles.productPrice}>{`${item.currency} ${item.price}`}</Text>
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
        onEndReached={loadMoreItems} // Trigger load more when the end of the list is reached
        onEndReachedThreshold={0.5} // Load more when the list is halfway scrolled
        ListFooterComponent={() => (hasMore ? <Text>Loading more items...</Text> : <Text>No more items</Text>)} // Show a loading indicator at the end
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















































































// const ProductsPage: React.FC = () => {
//   const [selectedCategory, setSelectedCategory] = useState<string>('all');
//   const [loading, setLoading] = useState(true);
//   const [items, setItems] = useState<Product[]>([]);
//   const [cart, setCart] = useState<CartItem[]>([]);
//   const [searchQuery, setSearchQuery] = useState<string>('');
//   const [showCategories, setShowCategories] = useState(true); // Manage visibility of categories
//   const [showBackToTop, setShowBackToTop] = useState(false); // Manage visibility of the back-to-top button
//   const [quantityInCart, setQuantityInCart] = useState<number>(1);
//   const scrollY = useRef(new Animated.Value(0)).current;
//   const flatListRef = useRef<FlatList<any>>(null); // For accessing the flatlist
//   const [page, setPage] = useState<number>(1);
//   const [hasMore, setHasMore] = useState<boolean>(true);
//   const { addToCart } = useCart();

//   useEffect(() => {
//     const fetchItems = async () => {
//       try {
//         const response = await axios.get(`/items/items?page=${page}`,{ timeout: 20000 });
//         const fetchedItems = response.data.items.map((item: any) => ({
//           id: item.id,
//           item_key: item.item_key,
//           item_name: item.item_name,
//           description: item.description || item.item_name,
//           price: item.price || 0,
//           currency: item.currency || 'N/A',
//           purch_price: item.purch_price || 0,
//           quantity: item.quantity || 1,
//           discount_code: item.discount_code || '',
//           categoryId: item.categoryId || '1',
//           image: item.image || null,
//         }));
//         setItems((prevItems) => [...prevItems, ...fetchedItems]);
//         setHasMore(response.data.hasMore);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching products:", error);
//         setLoading(false);
//       }
//     };
  
//     fetchItems();
//   }, [page]); // Fetch new page when 'page' changes
  
//   const handleLoadMore = () => {
//     if (hasMore) {
//       setPage(page + 1); // Increment page to fetch the next set of items
//     }
//   };
  
  

//   const filteredProducts = items.filter(product => {
//     // Check if the selected category is 'all' or if the product's categoryId matches the selected category
//     const matchesCategory = selectedCategory === 'all' || selectedCategory === 'viewAll' || product.categoryId === selectedCategory;
    
//     // Ensure search query is properly compared to product name (case insensitive)
//     const itemName = product.item_name || ''; 
//     const matchesSearch = searchQuery.trim() === '' || itemName.toLowerCase().includes(searchQuery.toLowerCase()); 
    
//     return matchesCategory && matchesSearch;
//   });
//   const handleIncreaseQuantity = () => {
//     setQuantityInCart(quantityInCart + 1);
//   };

//   const handleDecreaseQuantity = () => {
//     setQuantityInCart(Math.max(1, quantityInCart - 1)); // Ensure minimum quantity is 1
//   };

//   const handleAddToCart = (item: Product) => {
//     addToCart({
//       ...item,
//       name: item.item_name, // Map 'item_name' to 'name'
//       quantityInCart: quantityInCart,    // Initial quantity for the cart
//       image: item.image || '../../assets/images/icon.png'  // Ensure 'image' is always a string
//     });
//   };

//   // Detect scroll direction and update category visibility
//   let lastScrollY = 0;
//   const handleScroll = (event: any) => {
//     const currentOffset = event.nativeEvent.contentOffset.y;
//     const direction = currentOffset - lastScrollY > 0 ? 'down' : 'up';

//     if (direction === 'down' && currentOffset > 100) {
//       setShowCategories(false);
//     } else if (direction === 'up') {
//       setShowCategories(true);
//     }

//     // Show back-to-top button if scrolled down
//     if (currentOffset > 500) {
//       setShowBackToTop(true);
//     } else {
//       setShowBackToTop(false);
//     }

//     lastScrollY = currentOffset;
//   };

//   const handleBackToTop = () => {
//     flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
//   };


//   const ProductItem = React.memo(({ item, onAddToCart }: { item: Product, onAddToCart: (item: Product, quantity: number) => void }) => {
//     const [quantityInCart, setQuantityInCart] = useState(1); // Define quantity state
  
//     // Increase quantity handler
//     const handleIncreaseQuantity = () => {
//       setQuantityInCart(prevQty => prevQty + 1);
//     };
  
//     // Decrease quantity handler
//     const handleDecreaseQuantity = () => {
//       setQuantityInCart(prevQty => (prevQty > 1 ? prevQty - 1 : 1));
//     };
  
//     return (
//       <View style={GlobalStyles.productContainer}>
//         <Text style={GlobalStyles.productName}>{item.item_name}</Text>
//         <Text style={GlobalStyles.productPrice}>{`${item.currency} ${item.price}`}</Text>
//         <Image
//           source={item.image ? { uri: item.image } : require('../../assets/images/icon.png')}
//           style={{ width: 100, height: 100 }}
//         />
//         <Text>{item.description}</Text>
//         <View style={GlobalStyles.quantityContainer}>
//           <Button
//             mode="contained"
//             onPress={handleDecreaseQuantity}
//             compact
//             style={{ marginRight: 10, minWidth: 40, height: 30 }}
//             labelStyle={{ fontSize: 20, lineHeight: 17 }}
//           >
//             -
//           </Button>
//           <Text style={{ marginTop: 3 }}>{quantityInCart}</Text>
//           <Button
//             mode="contained"
//             onPress={handleIncreaseQuantity}
//             compact
//             style={{ marginLeft: 10, minWidth: 40, height: 30 }}
//             labelStyle={{ fontSize: 20, lineHeight: 17 }}
//           >
//             +
//           </Button>
//         </View>
//         <Button
//           mode="contained"
//           style={{ marginTop: 10 }}
//           onPress={() => onAddToCart(item, quantityInCart)} // Call the passed onAddToCart handler with item and quantity
//         >
//           Add to Cart
//         </Button>
//       </View>
//     );
//   });


//   if (loading) {
//     return <Text>Loading...</Text>; // Or any loading indicator you prefer
//   }

//   return (
//     <View style={GlobalStyles.container}>
//       <TextInput
//         style={GlobalStyles.searchBar}
//         placeholder="Search Products"
//         value={searchQuery} // Bind search query to input
//         onChangeText={setSearchQuery} // Update state as user types
//       />
//       {showCategories && ( // Only show categories when `showCategories` is true
//         <View>
//           <FlatList
//             data={categories}
//             horizontal
//             renderItem={({ item }) => (
//               <Button
//                 mode={item.id === selectedCategory ? "contained" : "outlined"}
//                 onPress={() => setSelectedCategory(item.id)}
//                 style={{ marginRight: 3 }}
//               >
//                 {item.name}
//               </Button>
//             )}
//             keyExtractor={item => item.id}
//           />
//         </View>
//       )}
//         <FlatList
//           data={filteredProducts}
//           renderItem={({ item }) => <ProductItem item={item} />}
//           keyExtractor={(item) => item.id}
//           numColumns={2}
//           columnWrapperStyle={{ justifyContent: "space-between" }}
//           onScroll={handleScroll}
//           scrollEventThrottle={16} // Throttle the scroll events to 16ms for smooth performance
//           getItemLayout={(data, index) => ({
//             length: 200, // Adjust based on the height of your items
//             offset: 200 * index, // This should be the item height * index
//             index,
//           })}
//         />

//       {showBackToTop && ( // Show back-to-top button when scrolled down
//         <TouchableOpacity
//           style={GlobalStyles.backToTopButton}
//           onPress={handleBackToTop}
//         >
//           <IconButton icon="arrow-up" size={24} />
//         </TouchableOpacity>
//       )}
//     </View>
//   );
  
// };


// export default ProductsPage;














































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