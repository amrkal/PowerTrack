import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Drawer } from 'expo-router/drawer';
import { CartProvider } from '../context/CartContext'; 
import { UserProvider } from '../context/UserContext';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import axiosInstance from '../../services/axiosInstance';

export default function Layout() {
  return (
    <UserProvider>
      <CartProvider>
        <Drawer initialRouteName="LandingPage" drawerContent={(props) => <CustomDrawerContent {...props} />}>
          <Drawer.Screen name="LandingPage" options={{ title: 'Welcome', drawerItemStyle: { display: 'none' } }} />
          <Drawer.Screen name="ProductsPage" options={{ title: 'Products' }} />
          <Drawer.Screen name="MyCartPage" options={{ title: 'Cart' }} />
          <Drawer.Screen name="ProfilePage" options={{ title: 'Profile' }} />
          <Drawer.Screen name="AboutUsPage" options={{ title: 'About Us' }} />
          <Drawer.Screen name="ContactUsPage" options={{ title: 'Contact Us' }} />
        </Drawer>
      </CartProvider>
    </UserProvider>
  );
}

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const [mainTypes, setMainTypes] = useState<string[]>([]);

  useEffect(() => {
    const fetchMainTypes = async () => {
      try {
        const response = await axiosInstance.get('/categories/types');
        const types = response.data.types || [];
        console.log("Fetched Types for Drawer:", types); // Log fetched types
        setMainTypes(types.slice(0, 3)); // Get the top 3 types
      } catch (error) {
        console.error("Error fetching main types:", error);
      }
    };
    fetchMainTypes();
  }, []);

  return (
    <View style={styles.drawerContent}>
      <Text style={styles.logo}>B.Tech Tools</Text>

      {mainTypes.length > 0 ? (
        mainTypes.map((type, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              console.log("Navigating to ProductsPage with type:", type); // Log navigation action
              props.navigation.navigate('ProductsPage', { selectedType: type });
            }}
            style={styles.drawerItem}
          >
            <Text style={styles.drawerItemText}>{type}</Text>
          </TouchableOpacity>
        ))
      ) : (
        <Text style={styles.noCategories}>No types available</Text>
      )}

      {/* Other Drawer Items */}
      <TouchableOpacity onPress={() => props.navigation.navigate('MyCartPage')} style={styles.drawerItem}>
        <Text style={styles.drawerItemText}>Cart</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => props.navigation.navigate('ProfilePage')} style={styles.drawerItem}>
        <Text style={styles.drawerItemText}>Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => props.navigation.navigate('AboutUsPage')} style={styles.drawerItem}>
        <Text style={styles.drawerItemText}>About Us</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => props.navigation.navigate('ContactUsPage')} style={styles.drawerItem}>
        <Text style={styles.drawerItemText}>Contact Us</Text>
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  drawerItem: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginVertical: 5,
    backgroundColor: '#fff',
  },
  drawerItemText: {
    fontSize: 16,
  },
  noCategories: {
    fontSize: 14,
    color: 'grey',
    textAlign: 'center',
    marginVertical: 20,
  },
});
