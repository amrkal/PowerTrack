import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { Text } from 'react-native-paper';
import { Drawer } from 'expo-router/drawer';
import { CartProvider } from '../context/CartContext'; 
import { UserProvider } from '../context/UserContext';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import axiosInstance from '../../services/axiosInstance';
import SearchBar from '../../components/SearchBar';

export default function Layout() {
  return (
    <UserProvider>
      <CartProvider>
        <Drawer
          initialRouteName="LandingPage"
          drawerContent={(props) => <CustomDrawerContent {...props} />}
        >
          <Drawer.Screen
            name="LandingPage"
            options={{ title: 'Welcome', drawerItemStyle: { display: 'none' } }}
          />
          <Drawer.Screen name="ProductsPage" options={{ title: 'Products' }} />
          <Drawer.Screen name="MyCartPage" options={{ title: 'My Cart' }} />
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
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchMainTypes = async () => {
      try {
        const response = await axiosInstance.get('/categories/types');
        const types = response.data.types || [];
        setMainTypes(types.slice(0, 3)); // Get the top 3 types
      } catch (error) {
        console.error('Error fetching main types:', error);
      }
    };
    fetchMainTypes();
  }, []);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleSearchSubmit = async () => {
    try {
      const response = await axiosInstance.get('/items/search', {
        params: { query: searchQuery },
      });

      if (response.data.items) {
        setSearchResults(response.data.items); // Set the search results
        props.navigation.navigate('ProductsPage', { items: response.data.items });
      } else {
        console.error('No items found');
      }
    } catch (error) {
      console.error('Error during search:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.drawerContent}>
        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.logoImage}
        />

        {/* Search Bar */}
        <SearchBar
          searchQuery={searchQuery}
          onChange={handleSearchChange}
          onSearch={handleSearchSubmit}
        />

        {mainTypes.length > 0 ? (
          mainTypes.map((type, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => props.navigation.navigate('ProductsPage', { selectedType: type })}
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
          <Text style={styles.drawerItemText}>עגלת קניות</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => props.navigation.navigate('ProfilePage')} style={styles.drawerItem}>
          <Text style={styles.drawerItemText}>פרופיל</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => props.navigation.navigate('AboutUsPage')} style={styles.drawerItem}>
          <Text style={styles.drawerItemText}>אודות</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => props.navigation.navigate('ContactUsPage')} style={styles.drawerItem}>
          <Text style={styles.drawerItemText}>צור קשר</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
  logoImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 20,
    alignSelf: 'center',
  },
  drawerContent: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  drawerItem: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginVertical: 5,
    backgroundColor: '#fff',
    
    borderColor: '#ffa64d',
    borderWidth: 2, // Border thickness
    borderStyle: 'solid', // Solid border (default)
    color: '#1E90FF',
  },
  drawerItemText: {
    fontSize: 16,
  },
  noCategories: {
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 20,
  },
});
