import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';

export default function CartScreen({
  navigation,
  cart,
  updateQuantity,
  removeFromCart,
}) {
  const subtotal = cart.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0
  );

  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const getProductName = (item) =>
    typeof item.name === 'object'
      ? item.name.en || item.name.id
      : item.name;

  const handleRemove = (item) => {
    Alert.alert(
      'Remove Item',
      `Remove ${getProductName(item)} from your cart?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () =>
            removeFromCart(item._id || item.customId),
        },
      ]
    );
  };

  if (cart.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🛒</Text>
        <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
        <Text style={styles.emptyText}>
          Add some products to your cart first.
        </Text>

        <TouchableOpacity
          style={styles.shopButton}
          onPress={() => navigation.navigate('Products')}
        >
          <Text style={styles.shopButtonText}>Continue Shopping</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={cart}
        keyExtractor={(item) =>
          String(item._id || item.customId)
        }
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <Text style={styles.heading}>
            Your Cart ({totalItems} items)
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            {item.image ? (
              <Image
                source={{ uri: item.image }}
                style={styles.image}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text>No Image</Text>
              </View>
            )}

            <View style={styles.details}>
              <Text style={styles.name} numberOfLines={2}>
                {getProductName(item)}
              </Text>

              <Text style={styles.price}>
                Rp {Number(item.price).toLocaleString('id-ID')}
              </Text>

              <View style={styles.quantityRow}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() =>
                    updateQuantity(item._id || item.customId, -1)
                  }
                >
                  <Text style={styles.quantityButtonText}>−</Text>
                </TouchableOpacity>

                <Text style={styles.quantity}>{item.quantity}</Text>

                <TouchableOpacity
                  style={styles.quantityButton}
                  disabled={item.quantity >= Number(item.stock)}
                  onPress={() =>
                    updateQuantity(item._id || item.customId, 1)
                  }
                >
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={() => handleRemove(item)}>
                <Text style={styles.removeText}>Remove</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.itemTotal}>
              Rp {(Number(item.price) * item.quantity)
                .toLocaleString('id-ID')}
            </Text>
          </View>
        )}
      />

      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>
            Rp {subtotal.toLocaleString('id-ID')}
          </Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>
            Rp {subtotal.toLocaleString('id-ID')}
          </Text>
        </View>

        <Text style={styles.note}>
          Shipping fees are not included.
        </Text>

        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={() => navigation.navigate('Checkout')}
          activeOpacity={0.8}
        >
          <Text style={styles.checkoutButtonText}>
            Proceed to Checkout
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  list: {
    padding: 16,
    paddingBottom: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 18,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    alignItems: 'center',
  },
  image: {
    width: 85,
    height: 95,
    borderRadius: 8,
    backgroundColor: '#EEE',
  },
  imagePlaceholder: {
    width: 85,
    height: 95,
    borderRadius: 8,
    backgroundColor: '#EEE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  details: {
    flex: 1,
    marginLeft: 10,
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#222',
  },
  price: {
    fontSize: 13,
    color: '#555',
    marginTop: 6,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  quantityButton: {
    width: 28,
    height: 28,
    backgroundColor: '#EEE',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  quantity: {
    marginHorizontal: 12,
    fontWeight: 'bold',
    color: '#222',
  },
  removeText: {
    color: '#DC2626',
    fontSize: 12,
    marginTop: 9,
    fontWeight: '600',
  },
  itemTotal: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#222',
    marginLeft: 5,
  },
  summary: {
    backgroundColor: '#FFF',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 15,
    color: '#666',
  },
  summaryValue: {
    fontSize: 15,
    color: '#222',
  },
  totalLabel: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#222',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  note: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  checkoutButton: {
    backgroundColor: '#222',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 18,
  },
  checkoutButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    padding: 25,
  },
  emptyIcon: {
    fontSize: 55,
    marginBottom: 15,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
  },
  emptyText: {
    fontSize: 14,
    color: '#888',
    marginTop: 8,
    textAlign: 'center',
  },
  shopButton: {
    backgroundColor: '#222',
    padding: 14,
    borderRadius: 8,
    marginTop: 20,
  },
  shopButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});