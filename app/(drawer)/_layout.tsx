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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Drawer } from 'expo-router/drawer';
import { CartProvider } from '../context/CartContext';
import { UserProvider } from '../context/UserContext';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import axiosInstance from '../../services/axiosInstance';
import { MaterialIcons,AntDesign } from '@expo/vector-icons';
import { Color ,Colors } from '@/constants/Colors';


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
          <Drawer.Screen name="CheckOutPage" options={{ title: '' }} />
        </Drawer>
      </CartProvider>
    </UserProvider>
  );
}


// Custom Drawer Content
function CustomDrawerContent(props: DrawerContentComponentProps) {

  const insets = useSafeAreaInsets();

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
  

 
  return (
    <SafeAreaView style={[styles.safeAreaView,]}>
    <View style={[styles.drawerContent,]} > 
        <Image
          source={require('../../assets/images/logo.png')}
          resizeMode="contain"
          style={styles.logoImage}
        />

        {/* Drawer Items */}
        <TouchableOpacity
          onPress={() => props.navigation.navigate('HomePage')}
          style={[styles.drawerItem,]}
        >
          <AntDesign name="home" size={24} style={[styles.drawerIcon, { color: Color.light.primary }]} />
          <Text style={[styles.drawerItemText,]}>דף הבית</Text>
        </TouchableOpacity>

        {/* Products Section */}
        <TouchableOpacity
          style={[styles.drawerItem,]}
          onPress={toggleProductsSection}
        >
          <AntDesign name="tags" size={24} style={[styles.drawerIcon, { color: Color.light.primary }]} />
          <Text style={[styles.drawerItemText, { color: Color.light.primary }]}>המוצרים שלנו</Text>
          <AntDesign
            name={isProductsExpanded ? 'up' : 'down'}
            size={24}
            style={[styles.arrowIcon, { color: Color.light.primary }]}
          />
        </TouchableOpacity>

        {isProductsExpanded && (
          <View style={styles.subMenu}>
            {mainTypes.length > 0 ? (
              mainTypes.map((type, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => props.navigation.navigate('ProductsPage', { selectedType: type })}
                  style={[styles.subMenuItem,]}
                >
                  <Text style={[styles.subMenuItemText,]}>{type}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={[styles.noCategories,]}>אין קטגוריות זמינות</Text>
            )}
          </View>
        )}

        {/* Other Drawer Items */}
        {[
          { label: 'עגלת קניות', icon: 'shoppingcart', route: 'MyCartPage' },
          { label: 'פרופיל', icon: 'user', route: 'ProfilePage' },
          { label: 'אודות', icon: 'info', route: 'AboutUsPage' },
          { label: 'צור קשר', icon: 'phone', route: 'ContactUsPage' },
        ].map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => props.navigation.navigate(item.route)}
            style={[styles.drawerItem, ]}
          >
            <AntDesign name={item.icon as any} size={24} style={[styles.drawerIcon, { color: Color.light.primary }]} />
            <Text style={[styles.drawerItemText,]}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
  drawerContent: {
    flex: 1,
    padding: 16,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
  },
  logoImage: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
  },
  drawerItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  drawerIcon: {
    marginLeft: 10,
  },
  drawerItemText: {
    fontSize: 16,
    textAlign: 'right',
    flex: 1,
    marginRight: 10,
  },
  arrowIcon: {
    marginLeft: 10,
  },
  subMenu: {
    paddingLeft: 20,
    marginTop: 8,
  },
  subMenuItem: {
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  subMenuItemText: {
    fontSize: 14,
    textAlign: 'right',
  },
  noCategories: {
    fontSize: 14,
    textAlign: 'center',
  },
});
