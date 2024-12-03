import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, SafeAreaView, LayoutAnimation } from 'react-native';
import { Text } from 'react-native-paper';
import { Drawer } from 'expo-router/drawer';
import { CartProvider } from '../context/CartContext'; 
import { UserProvider } from '../context/UserContext';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import axiosInstance from '../../services/axiosInstance';
import SearchBar from '../../components/SearchBar';
import { MaterialIcons } from '@expo/vector-icons';

export default function Layout() {
  return (
    <UserProvider>
      <CartProvider>
        <Drawer
          initialRouteName="LandingPage"
          drawerContent={(props) => <CustomDrawerContent {...props} />}
        >
          <Drawer.Screen name="HomePage" options={{ title: 'HomePage' }} />
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
  const [isProductsExpanded, setProductsExpanded] = useState(false); // Toggle state for products section

  useEffect(() => {
    const fetchMainTypes = async () => {
      try {
        const response = await axiosInstance.get('/categories/types');
        const types = response.data.types || [];
        setMainTypes(types); // Fetch and set all types without slicing
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
  const toggleProductsSection = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setProductsExpanded(!isProductsExpanded);
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
        <TouchableOpacity onPress={() => props.navigation.navigate('HomePage')} style={styles.drawerItem}>
          <Text style={styles.drawerItemText}>דף הבית</Text>
        </TouchableOpacity>

        {/* Products Section */}
        <TouchableOpacity
          style={styles.drawerItem}
          onPress={toggleProductsSection}
        >
          <View style={styles.row}>
            <Text style={styles.drawerItemText}>המוצרים שלנו</Text>
            <MaterialIcons
              name={isProductsExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
              size={24}
              color="#555"
              style={styles.arrowIcon}
            />
          </View>
        </TouchableOpacity>


        {isProductsExpanded && (
          <View style={styles.subMenu}>
            {mainTypes.length > 0 ? (
              mainTypes.map((type, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() =>
                    props.navigation.navigate('ProductsPage', { selectedType: type })
                  }
                  style={styles.subMenuItem}
                >
                  <Text style={styles.subMenuItemText}>{type}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.noCategories}>אין קטגוריות זמינות</Text>
            )}
          </View>
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
  arrowIcon: {
    marginLeft: 10, // Add spacing between text and icon
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  subMenu: {
    paddingLeft: 20, // Indent submenu items
  },
  subMenuItem: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginVertical: 5,
    backgroundColor: '#e8e8e8',
    borderRadius: 5,
  },
  subMenuItemText: {
    fontSize: 14,
    color: '#555',
  },
});
