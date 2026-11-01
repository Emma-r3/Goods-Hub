import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';

export default function ProductDetailScreen({
  route,
  navigation,
  onAddToCart,
  cartCount,
}) {
  const { product } = route.params;

  const productName =
    typeof product.name === 'object'
      ? product.name.en || product.name.id
      : product.name;

  const productDescription =
    typeof product.description === 'object'
      ? product.description.en || product.description.id
      : product.description;

  const handleAddToCart = () => {
    if (Number(product.stock) <= 0) {
      Alert.alert('Out of Stock', 'This product is currently unavailable.');
      return;
    }

    onAddToCart(product);

    Alert.alert(
      'Added to Cart',
      `${productName} has been added to your cart.`
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.topActions}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>← Back to Products</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => navigation.navigate('Cart')}
        >
          <Text style={styles.cartButtonText}>
            Cart ({cartCount})
          </Text>
        </TouchableOpacity>
      </View>

      {product.image ? (
        <Image
          source={{ uri: product.image }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text>No Image</Text>
        </View>
      )}

      <View style={styles.content}>
        <Text style={styles.category}>{product.category}</Text>

        <Text style={styles.name}>{productName}</Text>

        <Text style={styles.rating}>
          ★ {product.rating || 0} / 5
        </Text>

        <Text style={styles.price}>
          Rp {Number(product.price).toLocaleString('id-ID')}
        </Text>

        <Text style={styles.sectionTitle}>Description</Text>

        <Text style={styles.description}>
          {productDescription}
        </Text>

        <Text style={styles.stock}>
          Stock available: {product.stock}
        </Text>

        <TouchableOpacity
          style={[
            styles.addButton,
            Number(product.stock) <= 0 && styles.disabledButton,
          ]}
          onPress={handleAddToCart}
          disabled={Number(product.stock) <= 0}
          activeOpacity={0.8}
        >
          <Text style={styles.addButtonText}>
            {Number(product.stock) > 0 ? 'Add to Cart' : 'Out of Stock'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  topActions: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backText: {
    fontSize: 15,
    color: '#2563EB',
    fontWeight: '600',
  },
  cartButton: {
    backgroundColor: '#222',
    paddingVertical: 9,
    paddingHorizontal: 13,
    borderRadius: 8,
  },
  cartButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 13,
  },
  image: {
    width: '100%',
    height: 300,
    backgroundColor: '#EEE',
  },
  imagePlaceholder: {
    width: '100%',
    height: 300,
    backgroundColor: '#EEE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 22,
  },
  category: {
    fontSize: 13,
    color: '#888',
    textTransform: 'capitalize',
  },
  name: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 8,
  },
  rating: {
    fontSize: 15,
    color: '#D69E00',
    marginTop: 12,
  },
  price: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 28,
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    color: '#666',
    lineHeight: 23,
  },
  stock: {
    fontSize: 14,
    color: '#228B55',
    marginTop: 20,
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#222',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: '#999',
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});