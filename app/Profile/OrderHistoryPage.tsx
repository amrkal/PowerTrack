import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Modal,
} from "react-native";
import axiosInstance from "../../services/axiosInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { WebView } from "react-native-webview";
import * as FileSystem from 'expo-file-system';

interface Item {
  item_key: string;
  item_name: string;
  quantity: number;
  price_per_unit: number;
}

interface Order {
  order_number: string;
  items: Item[];
  total_amount: number;
  order_status: string;
  order_date: string;
}

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [pdfUri, setPdfUri] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const accessToken = await AsyncStorage.getItem("accessToken");
        if (!accessToken) {
          console.error("No JWT token found");
          setLoading(false);
          return;
        }
        const response = await axiosInstance.get("/orders/history", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setOrders(response.data.orders || []);
      } catch (error) {
        console.error("Error fetching order history", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, []);

  // Generate PDF using Expo Print
  const generatePDF = async (order: Order) => {
    try {
        const html = `
        <html>
          <body>
            <h1 style="text-align:center;">Order Details</h1>
            <h2>Order ID: ${order.order_number}</h2>
            <p><b>Order Date:</b> ${new Date(
              order.order_date
            ).toLocaleString()}</p>
            <p><b>Order Status:</b> ${order.order_status}</p>
            <p><b>Total Amount:</b> $${order.total_amount.toFixed(2)}</p>
            <h3>Items</h3>
            <ul>
              ${order.items
                .map(
                  (item) => `
                    <li>
                      <b>${item.item_name}</b> | Qty: ${item.quantity} | Price: $${item.price_per_unit.toFixed(
                    2
                  )}
                    </li>`
                )
                .join("")}
            </ul>
          </body>
        </html>
      `;

        const { uri } = await Print.printToFileAsync({ html });
        console.log("PDF generated at:", uri);
        
        // Move the file to a readable directory
        const pdfUri = `${FileSystem.documentDirectory}Order-${order.order_number}.pdf`;
        await FileSystem.moveAsync({ from: uri, to: pdfUri });

        // Share the file directly instead of using WebView
        const canShare = await Sharing.isAvailableAsync();
        if (canShare) {
            await Sharing.shareAsync(pdfUri);
        } else {
            Alert.alert("Error", "Sharing is not available on this device");
        }
    } catch (error) {
        console.error("Error generating PDF:", error);
    }
};

  


  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={(order) => order.order_number}
        renderItem={({ item: order }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Order ID: {order.order_number}</Text>
            <Text style={styles.cardText}>
              <Text style={styles.label}>Total Amount:</Text> ${order.total_amount.toFixed(2)}
            </Text>
            <Text style={styles.cardText}>
              <Text style={styles.label}>Order Status:</Text> {order.order_status}
            </Text>
            <Text style={styles.cardText}>
              <Text style={styles.label}>Order Date:</Text>{" "}
              {new Date(order.order_date).toLocaleString()}
            </Text>

            <Text style={styles.subtitle}>Items:</Text>
            <FlatList
              data={order.items}
              renderItem={({ item }) => (
                <View style={styles.itemContainer}>
                  <Text style={styles.itemText}>
                    <Text style={styles.label}>Name:</Text> {item.item_name}
                  </Text>
                  <Text style={styles.itemText}>
                    <Text style={styles.label}>Quantity:</Text> {item.quantity}
                  </Text>
                  <Text style={styles.itemText}>
                    <Text style={styles.label}>Price:</Text> $
                    {item.price_per_unit.toFixed(2)}
                  </Text>
                </View>
              )}
            />

            <TouchableOpacity
              style={styles.button}
              onPress={() => generatePDF(order)}
            >
              <Text style={styles.buttonText}>View & Download PDF</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {pdfUri && (
        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <WebView
              source={{ uri: pdfUri }}
              style={styles.pdfViewer}
              useWebKit={true}
              startInLoadingState={true}
              onError={(syntheticEvent) => {
                  const { nativeEvent } = syntheticEvent;
                  Alert.alert("Error", `Failed to load PDF: ${nativeEvent.description}`);
                  setModalVisible(false);
              }}
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Close PDF</Text>
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
};

export default OrderHistoryPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  cardText: {
    fontSize: 16,
    marginVertical: 4,
  },
  label: {
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 8,
  },
  itemContainer: {
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  itemText: {
    fontSize: 14,
  },
  button: {
    backgroundColor: "#1E90FF",
    padding: 12,
    marginTop: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  pdfViewer: {
    flex: 1,
  },
  closeButton: {
    backgroundColor: "#FF6347",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    margin: 16,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
