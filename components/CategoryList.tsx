import React from 'react';
import { View, FlatList, Image, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
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
    <View style={GlobalStyles.containerss}>
      {/* Global Category Card */}
      <View style={GlobalStyles.globalCategoryCard}>
        <Text style={GlobalStyles.globalCategoryTitle}>{globalCategory}</Text>
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
        columnWrapperStyle={GlobalStyles.columnWrapper}
      />
    </View>
  );
};

export default CategoryList;
