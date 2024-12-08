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
      <View style={GlobalStyles.globalCategoryCard}>
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
            style={GlobalStyles.categoryCard}
          >
            <Image
              source={{ uri: item.image || '../../assets/images/logo.png' }}
              style={GlobalStyles.categoryImage}
            />
            <Text style={GlobalStyles.categoryName}>{item.name}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.sortGroup.toString()}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
      />
    </View>
  );
};


export default CategoryList;
