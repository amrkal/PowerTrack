import React from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';

// Sample Data for New Items and Discounts
const newItems = [
  { id: '1', name: 'New Item 1', image: 'https://via.placeholder.com/100', price: '$20' },
  { id: '2', name: 'New Item 2', image: 'https://via.placeholder.com/100', price: '$30' },
];

const discountItems = [
  { id: '1', name: 'Discount Item 1', image: 'https://via.placeholder.com/100', price: '$10', oldPrice: '$20' },
  { id: '2', name: 'Discount Item 2', image: 'https://via.placeholder.com/100', price: '$15', oldPrice: '$30' },
];

const HomePage: React.FC = () => {
  const renderNewItem = ({ item }: { item: typeof newItems[0] }) => (
    <TouchableOpacity style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.price}>{item.price}</Text>
    </TouchableOpacity>
  );

  const renderDiscountItem = ({ item }: { item: typeof discountItems[0] }) => (
    <TouchableOpacity style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
      <View style={styles.priceContainer}>
        <Text style={styles.discountedPrice}>{item.price}</Text>
        <Text style={styles.oldPrice}>{item.oldPrice}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>New Items</Text>
      <FlatList
        data={newItems}
        renderItem={renderNewItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
      />

      <Text style={styles.sectionTitle}>Discount Items</Text>
      <FlatList
        data={discountItems}
        renderItem={renderDiscountItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#333',
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
    height: 100,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    margin: 5,
    color: '#333',
  },
  price: {
    fontSize: 14,
    color: '#1E90FF',
    marginHorizontal: 5,
    marginBottom: 5,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 5,
    marginBottom: 5,
  },
  discountedPrice: {
    fontSize: 14,
    color: '#1E90FF',
    fontWeight: 'bold',
    marginRight: 5,
  },
  oldPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
  },
});

export default HomePage;
