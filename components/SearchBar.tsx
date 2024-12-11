import React, { useState, useCallback } from 'react';
import { TextInput, ActivityIndicator } from 'react-native-paper';
import axiosInstance from '../services/axiosInstance';
import debounce from 'lodash.debounce';

interface Props {
  onResults: (results: any[]) => void;
}

const SearchBar: React.FC<Props> = ({ onResults }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const fetchSearchResults = async (query: string) => {
    if (query.trim().length < 3) {
      onResults([]); // Clear results if query is too short
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.get('/items/search', {
        params: { query: query.trim() },
      });
      onResults(response.data.items || []);
    } catch (error) {
      console.error('Error fetching search results:', error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useCallback(debounce(fetchSearchResults, 500), []);

  const handleChangeText = (query: string) => {
    setSearchQuery(query);
    debouncedSearch(query);
  };

  return (
    <TextInput
      mode="outlined"
      placeholder="Search"
      placeholderTextColor="#000"
      value={searchQuery}
      onChangeText={handleChangeText}
      right={
        loading ? (
          <ActivityIndicator animating={true} size="small" />
        ) : searchQuery.length > 0 ? (
          <TextInput.Icon
            icon="close"
            color="#000"
            onPress={() => {
              setSearchQuery('');
              onResults([]); // Clear results
            }}
          />
        ) : (
          <TextInput.Icon icon="magnify" color="#000" />
        )
      }
    />
  );
};

export default SearchBar;
