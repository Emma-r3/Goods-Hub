import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

export default function CheckoutScreen({
  navigation,
  cart,
  onOrderPlaced,
}) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [payment, setPayment] = useState('Cash on Delivery');

  const subtotal = cart.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0
  );

  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const handlePlaceOrder = () => {
    if (!name.trim() || !phone.trim() || !address.trim()) {
      Alert.alert(
        'Incomplete Information',
        'Please fill in your name, phone number, and shipping address.'
      );
      return;
    }

    if (cart.length === 0) {
      Alert.alert('Empty Cart', 'Your cart is empty.');
      navigation.navigate('Products');
      return;
    }

    const order = {
      orderNumber: `GH-${Date.now().toString().slice(-8)}`,
      customerName: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
      payment,
      items: cart.map((item) => ({
        name:
          typeof item.name === 'object'
            ? item.name.en || item.name.id
            : item.name,
        price: Number(item.price),
        quantity: item.quantity,
      })),
      totalItems,
      total: subtotal,
      date: new Date().toLocaleDateString('id-ID'),
    };

    onOrderPlaced();

    navigation.replace('OrderSuccess', { order });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.heading}>Shipping Information</Text>

      <Text style={styles.label}>Full Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter recipient's name"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Phone Number</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter phone number"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Shipping Address</Text>
      <TextInput
        style={[styles.input, styles.addressInput]}
        placeholder="Enter complete shipping address"
        value={address}
        onChangeText={setAddress}
        multiline
        textAlignVertical="top"
      />

      <Text style={styles.heading}>Payment Method</Text>

      {['Cash on Delivery', 'Bank Transfer', 'E-Wallet'].map((method) => (
        <TouchableOpacity
          key={method}
          style={styles.paymentOption}
          onPress={() => setPayment(method)}
        >
          <View style={styles.radio}>
            {payment === method && <View style={styles.radioSelected} />}
          </View>
          <Text style={styles.paymentText}>{method}</Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.heading}>Order Summary</Text>

      {cart.map((item) => {
        const productName =
          typeof item.name === 'object'
            ? item.name.en || item.name.id
            : item.name;

        return (
          <View
            key={String(item._id || item.customId)}
            style={styles.orderRow}
          >
            <Text style={styles.productText}>
              {productName} × {item.quantity}
            </Text>
            <Text style={styles.productPrice}>
              Rp {(Number(item.price) * item.quantity)
                .toLocaleString('id-ID')}
            </Text>
          </View>
        );
      })}

      <View style={styles.divider} />

      <View style={styles.orderRow}>
        <Text style={styles.totalLabel}>Total Payment</Text>
        <Text style={styles.totalPrice}>
          Rp {subtotal.toLocaleString('id-ID')}
        </Text>
      </View>

      <Text style={styles.note}>
        Shipping fees are not included. Payment is not processed online in this demo.
      </Text>

      <TouchableOpacity
        style={styles.placeOrderButton}
        onPress={handlePlaceOrder}
        activeOpacity={0.8}
      >
        <Text style={styles.placeOrderText}>Place Order</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  content: {
    padding: 20,
    paddingBottom: 35,
  },
  heading: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 12,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
    marginBottom: 7,
  },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 9,
    padding: 13,
    fontSize: 14,
    marginBottom: 16,
    color: '#222',
  },
  addressInput: {
    height: 95,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 9,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  radioSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#222',
  },
  paymentText: {
    fontSize: 14,
    color: '#333',
  },
  orderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 13,
  },
  productText: {
    flex: 1,
    fontSize: 13,
    color: '#555',
    marginRight: 10,
  },
  productPrice: {
    fontSize: 13,
    color: '#222',
  },
  divider: {
    height: 1,
    backgroundColor: '#DDD',
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  totalPrice: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#222',
  },
  note: {
    fontSize: 12,
    color: '#999',
    lineHeight: 18,
    marginTop: 8,
  },
  placeOrderButton: {
    backgroundColor: '#222',
    padding: 17,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 22,
  },
  placeOrderText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});