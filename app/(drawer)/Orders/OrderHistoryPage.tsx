import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the Item and Order interfaces
interface Item {
  item_key: string;
  item_name: string;
  quantity: number;
  price_per_unit: number;
}

interface Order {
  order_id: string;
  items: Item[];
  total_amount: number;
  order_status: string;
  order_date: string;
}

const baseURL = 'http://192.168.0.153:5000';
axios.defaults.baseURL = baseURL;

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState<Order[]>([]); // Orders array
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        // Retrieve the JWT token from AsyncStorage
        const accessToken = await AsyncStorage.getItem('accessToken');    
        if (!accessToken) {
          console.error('No JWT token found');
          setLoading(false);
          return;
        }
        const response = await axios.get('/orders/history', {
          headers: {
            Authorization: `Bearer ${accessToken}`,  // Add the token to the header
          },
        });
        setOrders(response.data.orders);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching order history", error);
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <View>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 20 }}>Order History</Text>
      <FlatList
        data={orders}
        keyExtractor={(order) => order.order_id}
        renderItem={({ item: order }) => (
          <View style={{ marginBottom: 20, padding: 10, borderBottomWidth: 1 }}>
            <Text style={{ fontWeight: 'bold' }}>Order ID: {order.order_id}</Text>
            <Text>Total Order Price: ${order.total_amount.toFixed(2)}</Text>
            <Text>Order Status: {order.order_status}</Text>
            <Text>Order Date: {new Date(order.order_date).toLocaleString()}</Text>
            <Text>Items:</Text>
            
            <FlatList
              data={order.items}
              renderItem={({ item }) => {
                const totalPriceForItem = item.price_per_unit * item.quantity;
                return (
                  <View style={{ marginVertical: 10, padding: 5 }}>
                    <Text>Item Key: {item.item_key}</Text>
                    <Text>Item Name: {item.item_name}</Text>
                    <Text>Quantity: {item.quantity}</Text>
                    <Text>Price per Unit: ${item.price_per_unit.toFixed(2)}</Text>
                    <Text>Total Price for Item: ${totalPriceForItem.toFixed(2)}</Text>
                  </View>
                );
              }}
            />
          </View>
        )}
      />
    </View>
  );
};

export default OrderHistoryPage;
