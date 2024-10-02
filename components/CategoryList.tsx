import React, { useState } from 'react';
import { View, FlatList, Text } from 'react-native';
import { Button, List } from 'react-native-paper'; // Use List from React Native Paper for the dropdown effect
import { GlobalStyles } from '../constants/GlobalStyles';
import { Category } from './types'; // Import shared Category type

interface CategoryListProps {
  categories: Category[]; // Array of categories belonging to a global category
  onSelectCategory: (categoryId: number) => void;
  isMobile: boolean;
  globalCategory: string; // Pass the global category name
}

const CategoryList: React.FC<CategoryListProps> = ({ categories, onSelectCategory, isMobile, globalCategory }) => {
  const [expanded, setExpanded] = useState(false); // Manage dropdown state

  const handlePress = () => setExpanded(!expanded);

  return (
    <View style={GlobalStyles.globalCategoryContainer}>
      <List.Accordion
        title={globalCategory}
        expanded={expanded}
        onPress={handlePress}
        style={GlobalStyles.globalCategoryAccordion}
      >
        <FlatList
          data={categories}
          renderItem={({ item }) => (
            <Button
              mode="contained"
              onPress={() => onSelectCategory(item.sortGroup)}
              style={GlobalStyles.categoryButton}
            >
              {item.name}
            </Button>
          )}
          keyExtractor={(item) => item.sortGroup.toString()} // Convert number to string for key
          horizontal={!isMobile}
          contentContainerStyle={GlobalStyles.categoryList}
        />
      </List.Accordion>
    </View>
  );
};

export default CategoryList;
