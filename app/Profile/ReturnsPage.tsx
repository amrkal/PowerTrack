import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Alert,
  Modal,
} from 'react-native';
import {
  Text,
  Button,
  TextInput,
  ActivityIndicator,

} from 'react-native-paper';
import axiosInstance from '../../services/axiosInstance';
import { CheckBox } from 'react-native-elements';

interface ReturnableItem {
  order_id: string;
  item_id: string;
  item_name: string;
  purchase_date: string;
  price: number;
  quantity: number;
}

const ReturnPage = () => {
  const [returnableItems, setReturnableItems] = useState<ReturnableItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState<
    { item: ReturnableItem; quantity: number }[]
  >([]);
  const [showModal, setShowModal] = useState(false);
  const [returnReason, setReturnReason] = useState('');

  useEffect(() => {
    fetchReturnableItems();
  }, []);

  const fetchReturnableItems = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/orders/returns');
      setReturnableItems(response.data.returnable_items || []);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch returnable items');
    } finally {
      setLoading(false);
    }
  };

  const toggleSelection = (item: ReturnableItem) => {
    const existing = selectedItems.find((selected) => selected.item.item_id === item.item_id);

    if (existing) {
      setSelectedItems(selectedItems.filter((selected) => selected.item.item_id !== item.item_id));
    } else {
      setSelectedItems([...selectedItems, { item, quantity: 0 }]);
    }
  };

  const updateQuantity = (item: ReturnableItem, quantity: string) => {
    const quantityNumber = parseInt(quantity, 10);

    if (isNaN(quantityNumber) || quantityNumber < 0 || quantityNumber > item.quantity) {
      Alert.alert('Error', `Invalid quantity. Max available: ${item.quantity}`);
      return;
    }

    setSelectedItems((prev) =>
      prev.map((selected) =>
        selected.item.item_id === item.item_id ? { ...selected, quantity: quantityNumber } : selected
      )
    );
  };

  const handleSubmitReturn = async () => {
    if (selectedItems.length === 0) {
      Alert.alert('Error', 'Please select items to return');
      return;
    }

    if (!returnReason.trim()) {
      Alert.alert('Error', 'Please provide a reason for the return');
      return;
    }

    try {
      for (const { item, quantity } of selectedItems) {
        if (quantity <= 0) {
          Alert.alert('Error', `Invalid quantity for ${item.item_name}`);
          return;
        }

        await axiosInstance.post('/orders/returns', {
          order_id: item.order_id,
          item_id: item.item_id,
          quantity_to_return: quantity,
          return_reason: returnReason,
        });
      }
      Alert.alert('Success', 'Return requests submitted successfully');
      fetchReturnableItems(); // Refresh the list
      setSelectedItems([]); // Clear selections
      setReturnReason(''); // Reset return reason
      setShowModal(false); // Close modal
    } catch (error) {
      Alert.alert('Error', 'Failed to submit return requests');
    }
  };

  const renderItem = ({ item }: { item: ReturnableItem }) => {
    const isSelected = selectedItems.some((selected) => selected.item.item_id === item.item_id);

    return (
      <View style={styles.row}>
        <CheckBox
          checked={isSelected}
          onPress={() => toggleSelection(item)}
        />
        <Text style={styles.itemText}>{item.item_name}</Text>
        <Text style={styles.itemText}>{item.purchase_date}</Text>
        <Text style={styles.itemText}>{item.price}</Text>
        {isSelected && (
          <TextInput
            style={styles.input}
            placeholder="Quantity"
            keyboardType="numeric"
            onChangeText={(value) => updateQuantity(item, value)}
          />
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Returnable Items</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <FlatList
            data={returnableItems}
            keyExtractor={(item) => `${item.order_id}-${item.item_id}`}
            renderItem={renderItem}
          />
          <Button mode="contained" onPress={() => setShowModal(true)}>Submit Return</Button>
        </>
      )}

      {/* Modal for return reason */}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter reason for return"
              value={returnReason}
              onChangeText={setReturnReason}
            />
            <Button mode="contained" onPress={handleSubmitReturn}>Submit</Button>
            <Button onPress={() => setShowModal(false)}>Cancel</Button>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 8,
  },
  itemText: {
    flex: 1,
    fontSize: 14,
    marginLeft: 8,
  },
  input: {
    width: 60,
    height: 30,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#999',
    padding: 16,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
});

export default ReturnPage;
