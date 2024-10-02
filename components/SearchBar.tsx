import React from 'react';
import { TextInput } from 'react-native-paper';
import { GlobalStyles } from '../constants/GlobalStyles';

interface Props {
  searchQuery: string;
  onChange: (query: string) => void;
}

const SearchBar: React.FC<Props> = ({ searchQuery, onChange }) => {
  return (
    <TextInput
      style={GlobalStyles.searchBar}
      placeholder="Search Products"
      value={searchQuery}
      onChangeText={onChange}
    />
  );
};

export default SearchBar;
