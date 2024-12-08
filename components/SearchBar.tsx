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


export default SearchBar;
