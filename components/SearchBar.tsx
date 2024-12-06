import React from 'react';
import { StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';

interface Props {
  searchQuery: string;
  onChange: (query: string) => void;
  onSearch: () => void;
}

const SearchBar: React.FC<Props> = ({ searchQuery, onChange, onSearch }) => {
  return (
    <TextInput
      mode="outlined"
      placeholder="Search"
      placeholderTextColor="#000" 
      value={searchQuery}
      onChangeText={onChange}
      style={styles.input}
      right={
        <TextInput.Icon
          icon="magnify"
          color={'#000'}
          onPress={onSearch}
        />
      }
    />
  );
};

const styles = StyleSheet.create({
  input: {
    color:'#000',
    height: 40,
    marginBottom: 10,
  },
});

export default SearchBar;
