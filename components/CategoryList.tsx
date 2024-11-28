import React from 'react';
import { View, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { GlobalStyles } from '../constants/GlobalStyles';
import { Category } from './types';

interface CategoryListProps {
  categories: Category[];
  onSelectCategory: (categoryId: number) => void;
  isMobile: boolean;
  globalCategory: string;
}

const CategoryList: React.FC<CategoryListProps> = ({ categories, onSelectCategory, globalCategory }) => {
  return (
    <View style={{ flex: 1, padding: 10 }}>
      {/* Global Category Card */}
      <View style={styles.globalCategoryCard}>
        <Button mode = "contained" style={GlobalStyles.globalCategoryTitle}>
          {globalCategory}
        </Button>
      </View>

      {/* Subcategories displayed as cards */}
      <FlatList
        data={categories}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => onSelectCategory(item.sortGroup)}
            style={styles.categoryCard}
          >
            <Image
              source={{ uri: item.image || '../../assets/images/logo.png' }}
              style={styles.categoryImage}
            />
            <Text style={styles.categoryName}>{item.name}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.sortGroup.toString()}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  globalCategoryCard: {
    width: '100%',
    marginBottom: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  globalCategoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  categoryCard: {
    width: '45%',
    height: 150,
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  categoryImage: {
    width: '100%',
    height: '70%',
    resizeMode: 'contain',
    marginBottom: 10,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default CategoryList;
