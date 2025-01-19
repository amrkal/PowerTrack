import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  LayoutAnimation,
} from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { Drawer } from 'expo-router/drawer';
import { CartProvider } from '../context/CartContext';
import { UserProvider } from '../context/UserContext';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import axiosInstance from '../../services/axiosInstance';
import { MaterialIcons } from '@expo/vector-icons';

// Top-level Layout
export default function Layout() {
  return (
    <UserProvider>
      <CartProvider>
        <Drawer
          initialRouteName="LandingPage"
          screenOptions={{
            drawerPosition: 'right', // Drawer on the right
          }}
          drawerContent={(props) => <CustomDrawerContent {...props} />}
        >
          <Drawer.Screen name="HomePage" options={{ title: ' ' }} />
          <Drawer.Screen name="ProductsPage" options={{ title: '' }} />
          <Drawer.Screen name="MyCartPage" options={{ title: '' }} />
          <Drawer.Screen name="ProfilePage" options={{ title: '' }} />
          <Drawer.Screen name="AboutUsPage" options={{ title: '' }} />
          <Drawer.Screen name="ContactUsPage" options={{ title: '' }} />
        </Drawer>
      </CartProvider>
    </UserProvider>
  );
}

// Custom Drawer Content
function CustomDrawerContent(props: DrawerContentComponentProps) {
  // Access Paper theme colors for dynamic dark/light backgrounds
  const { colors } = useTheme();

  const [mainTypes, setMainTypes] = useState<string[]>([]);
  const [isProductsExpanded, setProductsExpanded] = useState(false);

  useEffect(() => {
    const fetchMainTypes = async () => {
      try {
        const response = await axiosInstance.get('/categories/types');
        const types = response.data.types || [];
        setMainTypes(types);
      } catch (error) {
        console.error('Error fetching main types:', error);
      }
    };
    fetchMainTypes();
  }, []);

  const toggleProductsSection = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setProductsExpanded(!isProductsExpanded);
  };

  // Create styles AFTER getting the theme
  const styles = StyleSheet.create({
    safeAreaView: {
      flex: 1,
    },
    drawerContent: {
      flex: 1,
      padding: 20,
      // Use the theme's background color instead of a fixed light color:
      backgroundColor: colors.background,
    },
    logoImage: {
      width: 100,
      height: 100,
      resizeMode: 'contain',
      marginBottom: 20,
      alignSelf: 'center',
    },
    drawerItem: {
      paddingVertical: 15,
      paddingHorizontal: 10,
      borderRadius: 5,
      marginVertical: 5,
      // Use the theme’s "surface" (or a variant) instead of #fff:
      backgroundColor: colors.surface,

      borderColor: '#ffa64d', // Keep your brand accent if desired
      borderWidth: 2,
      borderStyle: 'solid',
    },
    drawerItemText: {
      fontSize: 16,
      // Use a theme text color for better dark-mode contrast:
      color: colors.onSurface,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    arrowIcon: {
      marginLeft: 10,
      // You can also use colors.onSurface for the icon:
      color: colors.onSurface,
    },
    subMenu: {
      paddingLeft: 20,
    },
    subMenuItem: {
      paddingVertical: 10,
      paddingHorizontal: 10,
      marginVertical: 5,
      borderRadius: 5,
      // Use a subtle variant or second-level elevation color:
      backgroundColor: colors.elevation?.level2 || colors.surfaceVariant || colors.surface,
    },
    subMenuItemText: {
      fontSize: 14,
      color: colors.onSurface,
    },
    noCategories: {
      fontSize: 14,
      textAlign: 'center',
      marginVertical: 20,
      color: colors.onSurface,
    },
  });

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.drawerContent}>
        <Image
          source={require('../../assets/images/logo.png')}
          resizeMode="contain"
          style={styles.logoImage}
        />
        <TouchableOpacity
          onPress={() => props.navigation.navigate('HomePage')}
          style={styles.drawerItem}
        >
          <Text style={styles.drawerItemText}>דף הבית</Text>
        </TouchableOpacity>

        {/* Products Section */}
        <TouchableOpacity style={styles.drawerItem} onPress={toggleProductsSection}>
          <View style={styles.row}>
            <Text style={styles.drawerItemText}>המוצרים שלנו</Text>
            <MaterialIcons
              name={isProductsExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
              size={24}
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
                  onPress={() => props.navigation.navigate('ProductsPage', { selectedType: type })}
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
        <TouchableOpacity
          onPress={() => props.navigation.navigate('MyCartPage')}
          style={styles.drawerItem}
        >
          <Text style={styles.drawerItemText}>עגלת קניות</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => props.navigation.navigate('ProfilePage')}
          style={styles.drawerItem}
        >
          <Text style={styles.drawerItemText}>פרופיל</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => props.navigation.navigate('AboutUsPage')}
          style={styles.drawerItem}
        >
          <Text style={styles.drawerItemText}>אודות</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => props.navigation.navigate('ContactUsPage')}
          style={styles.drawerItem}
        >
          <Text style={styles.drawerItemText}>צור קשר</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
