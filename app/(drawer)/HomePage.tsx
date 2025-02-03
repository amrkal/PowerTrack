import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';  // Import useRouter
import axiosInstance from '../../services/axiosInstance';
import { Product } from '../../components/types';

const HomePage: React.FC = () => {
  const navigation = useNavigation<any>();
  const router = useRouter();  // Use expo-router for navigation

  const [latestItems, setLatestItems] = useState<Product[]>([]);
  const [discountedItems, setDiscountedItems] = useState<Product[]>([]);

  useEffect(() => {
    const fetchLatestItems = async () => {
      try {
        const response = await axiosInstance.get<{ items: Product[] }>('/items/items/latest?limit=10');
        setLatestItems(response.data.items || []);
      } catch (error) {
        console.error('Error fetching latest items:', error);
      }
    };

    const fetchDiscountedItems = async () => {
      try {
        const response = await axiosInstance.get<{ items: Product[] }>('/items/items/discounted?limit=10');
        setDiscountedItems(response.data.items || []);
      } catch (error) {
        console.error('Error fetching discounted items:', error);
      }
    };

    fetchLatestItems();
    fetchDiscountedItems();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <AntDesign
          name="bars"
          size={30}
          color="#1E3A8A"
          onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
        />
      ),
      headerLeft: () => null,
    });
  }, [navigation]);

  // Function to navigate to the category page and show the selected item
  const handleItemPress = (item: Product) => {
    router.push({
      pathname: "/ProductsPage",
      params: {
        selectedType: "תעשייה", // Dynamically pass the item's type
        selectedCategory: "10", // Dynamically pass the item's category (converted to string)
      },
    });
  };
  
  
  
  
  

  const renderItem = ({ item }: { item: Product }) => (
    <TouchableOpacity style={styles.card} onPress={() => handleItemPress(item)}>
      <Image source={{ uri: item.image || 'https://via.placeholder.com/150' }} style={styles.image} />
      <Text style={styles.name}>{item.item_name}</Text>
      {typeof item.discount === 'number' && item.discount > 0 ? (
        <View style={styles.discountContainer}>
          <Text style={styles.oldPrice}>₪{item.price.toFixed(2)}</Text>
          <Text style={styles.discountedPrice}>
            ₪{(item.price - (item.price * item.discount) / 100).toFixed(2)}
          </Text>
        </View>
      ) : (
        <Text style={styles.price}>₪{item.price.toFixed(2)}</Text>
      )}
    </TouchableOpacity>
  );
  

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Latest Items</Text>
      {latestItems.length > 0 ? (
        <FlatList
          data={latestItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.list}
        />
      ) : (
        <Text style={styles.noItemsText}>No latest items found.</Text>
      )}

      <Text style={styles.sectionTitle}>Discounted Items</Text>
      {discountedItems.length > 0 ? (
        <FlatList
          data={discountedItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.list}
        />
      ) : (
        <Text style={styles.noItemsText}>No discounted items available.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 15,
    color: '#333',
    textAlign: 'center',
  },
  list: {
    paddingHorizontal: 5,
  },
  card: {
    width: 150,
    marginRight: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
    paddingBottom: 10,
  },
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 8,
    textAlign: 'center',
    color: '#333',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1E3A8A',
  },
  discountContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  oldPrice: {
    fontSize: 14,
    textDecorationLine: 'line-through',
    color: '#999',
    marginRight: 5,
  },
  discountedPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF4500',
  },
  noItemsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#999',
  },
});

export default HomePage;
