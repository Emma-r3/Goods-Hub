import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

export default function OrderSuccessScreen({ route, navigation }) {
  const { order } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.successIcon}>✓</Text>

      <Text style={styles.title}>Order Placed!</Text>

      <Text style={styles.subtitle}>
        Thank you for shopping with GoodsHub.
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>Order Number</Text>
        <Text style={styles.orderNumber}>{order.orderNumber}</Text>

        <View style={styles.divider} />

        <Text style={styles.label}>Recipient</Text>
        <Text style={styles.value}>{order.customerName}</Text>

        <Text style={styles.label}>Phone Number</Text>
        <Text style={styles.value}>{order.phone}</Text>

        <Text style={styles.label}>Shipping Address</Text>
        <Text style={styles.value}>{order.address}</Text>

        <Text style={styles.label}>Payment Method</Text>
        <Text style={styles.value}>{order.payment}</Text>

        <View style={styles.divider} />

        <Text style={styles.label}>Items ({order.totalItems})</Text>

        {order.items.map((item, index) => (
          <View key={index} style={styles.itemRow}>
            <Text style={styles.itemName}>
              {item.name} × {item.quantity}
            </Text>
            <Text style={styles.itemPrice}>
              Rp {(item.price * item.quantity).toLocaleString('id-ID')}
            </Text>
          </View>
        ))}

        <View style={styles.divider} />

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Payment</Text>
          <Text style={styles.totalValue}>
            Rp {order.total.toLocaleString('id-ID')}
          </Text>
        </View>

        <Text style={styles.date}>Order Date: {order.date}</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.reset({
            index: 0,
            routes: [{ name: 'Products' }],
          })
        }
      >
        <Text style={styles.buttonText}>Continue Shopping</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F8F8F8',
    padding: 22,
    alignItems: 'center',
  },
  successIcon: {
    width: 75,
    height: 75,
    lineHeight: 75,
    borderRadius: 40,
    backgroundColor: '#228B55',
    color: '#FFF',
    fontSize: 42,
    fontWeight: 'bold',
    textAlign: 'center',
    overflow: 'hidden',
    marginTop: 25,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 18,
  },
  subtitle: {
    fontSize: 14,
    color: '#777',
    marginTop: 8,
    marginBottom: 25,
    textAlign: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 12,
  },
  label: {
    fontSize: 12,
    color: '#888',
    marginTop: 12,
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 5,
  },
  value: {
    fontSize: 14,
    color: '#333',
    marginTop: 5,
  },
  divider: {
    height: 1,
    backgroundColor: '#EEE',
    marginVertical: 16,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  itemName: {
    flex: 1,
    fontSize: 13,
    color: '#555',
    marginRight: 10,
  },
  itemPrice: {
    fontSize: 13,
    color: '#333',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  date: {
    fontSize: 12,
    color: '#999',
    marginTop: 15,
  },
  button: {
    width: '100%',
    backgroundColor: '#222',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 22,
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
});