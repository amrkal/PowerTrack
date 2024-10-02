import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Drawer } from 'expo-router/drawer';
import { CartProvider } from '../context/CartContext'; 
import { UserProvider } from '../context/UserContext';
import { DrawerContentComponentProps } from '@react-navigation/drawer';

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
          <Drawer.Screen name="CheckOutPage" options={{ title: 'Checkout', drawerItemStyle: { display: 'none' } }} />
          <Drawer.Screen name="OrderHistoryPage" options={{ title: 'Order History', drawerItemStyle: { display: 'none' }, drawerLabel: () => null, drawerIcon: () => null }} />
        </Drawer>
      </CartProvider>
    </UserProvider>
  );
}

// Custom Drawer Content Component


const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  return (
    <View style={styles.drawerContent}>
      <Text style={styles.logo}>B.Tech Tools</Text>
      {/* Create your custom drawer items */}
      <TouchableOpacity onPress={() => props.navigation.navigate('ProductsPage')} style={styles.drawerItem}>
        <Text style={styles.drawerItemText}>Products</Text>
      </TouchableOpacity>
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

// Styles for the custom drawer content
const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8', // Background color for the drawer
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
    backgroundColor: '#fff', // Background for drawer items
  },
  drawerItemText: {
    fontSize: 16,
  },
});
