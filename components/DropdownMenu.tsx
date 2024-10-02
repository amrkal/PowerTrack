import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';

interface DropdownMenuProps {
  title: string;
  subcategories: string[];
  onSelect: (subcategory: string) => void; // Function to handle selection
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ title, subcategories, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false); // State to manage dropdown visibility

  const handleToggle = () => {
    setIsOpen((prev) => !prev); // Toggle the dropdown open state
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleToggle} style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
      </TouchableOpacity>
      {isOpen && (
        <FlatList
          data={subcategories}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => onSelect(item)} style={styles.item}>
              <Text style={styles.itemText}>{item}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item}
          style={styles.dropdownList}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  titleContainer: {
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dropdownList: {
    backgroundColor: '#fff',
    borderRadius: 5,
    elevation: 3, // Shadow for Android
  },
  item: {
    padding: 10,
  },
  itemText: {
    fontSize: 14,
  },
});

export default DropdownMenu;
