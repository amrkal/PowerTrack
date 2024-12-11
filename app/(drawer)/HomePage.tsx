import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import axiosInstance from '../../services/axiosInstance';
import { Product } from '../../components/types'; // Use your existing Product type

const HomePage: React.FC = () => {
  const navigation = useNavigation<any>();
  const [latestItems, setLatestItems] = useState<Product[]>([]); 

  useEffect(() => {
    const fetchLatestItems = async () => {
      try {
        const response = await axiosInstance.get<{ items: Product[] }>('/items/items/latest?limit=10');
        setLatestItems(response.data.items || []);
      } catch (error) {
        console.error('Error fetching latest items:', error);
      }
    };

    fetchLatestItems();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <MaterialIcons
          name="menu"
          size={24}
          color="#1E3A8A"
          onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
        />
      ),
      headerLeft: () => null, 
    });
  }, [navigation]);

  const renderItem = ({ item }: { item: Product }) => (
    <TouchableOpacity style={styles.card}>
      <Image source={{ uri: item.image || 'https://via.placeholder.com/150' }} style={styles.image} />
      <Text style={styles.name}>{item.item_name}</Text>
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  noItemsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#999',
  },
});

export default HomePage;
