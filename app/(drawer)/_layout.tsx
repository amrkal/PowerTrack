import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { CartProvider } from '../context/CartContext'; 
import { UserProvider } from '../context/UserContext';

export default function Layout() {
  return (
    <CartProvider>
      <UserProvider>
      <Drawer initialRouteName="ProductsPage">
        <Drawer.Screen name="ProductsPage" options={{ title: 'Products' }} />
        <Drawer.Screen name="MyCartPage" options={{ title: 'Cart' }} />
        <Drawer.Screen name="ProfilePage" options={{ title: 'Profile' }} />
        <Drawer.Screen name="AboutUsPage" options={{ title: 'About Us' }} />
        <Drawer.Screen name="ContactUsPage" options={{ title: 'Contact Us' }} />
        <Drawer.Screen name="CheckOutPage" options={{ title: 'Checkout', drawerItemStyle: { display: 'none' } }} />
        <Drawer.Screen name="OrderHistoryPage" options={{ title: 'OrderHistoryPage', drawerItemStyle: { display: 'none' }, drawerLabel: () => null, drawerIcon: () => null,}}/>
      </Drawer>
      </UserProvider>
    </CartProvider>
  );
}
