import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';

import * as SecureStore from 'expo-secure-store';
import api from '../services/api';

export default function ProductListScreen({ navigation, cartCount }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get('/products');
      setProducts(response.data.products || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        'Failed to load products'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await SecureStore.deleteItemAsync('token');
      await SecureStore.deleteItemAsync('user');

      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      Alert.alert('Logout Failed', 'Please try again.');
      console.log('Logout error:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#222" />
        <Text style={styles.message}>Loading products...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>

        <TouchableOpacity onPress={fetchProducts}>
          <Text style={styles.retry}>Try Again</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logout}>Logout</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>GoodsHub.</Text>
          <Text style={styles.subtitle}>Discover our products</Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.cartButton}
            onPress={() => navigation.navigate('Cart')}
          >
            <Text style={styles.cartButtonText}>
              Cart ({cartCount})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <Text style={styles.logout}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => String(item._id || item.customId)}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const productName =
            typeof item.name === 'object'
              ? item.name.en || item.name.id
              : item.name;

          return (
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.8}
              onPress={() =>
                navigation.navigate('ProductDetail', {
                  product: item,
                })
              }
            >
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

              <Text style={styles.name} numberOfLines={2}>
                {productName}
              </Text>

              <Text style={styles.category}>
                {item.category}
              </Text>

              <Text style={styles.price}>
                Rp {Number(item.price).toLocaleString('id-ID')}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 18,
    paddingTop: 55,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 22,
  },
  headerActions: {
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222',
  },
  subtitle: {
    fontSize: 14,
    color: '#777',
    marginTop: 5,
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
  logoutButton: {
    padding: 8,
  },
  logout: {
    color: '#DC2626',
    fontWeight: '600',
    fontSize: 14,
  },
  list: {
    paddingBottom: 25,
  },
  row: {
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 10,
    marginBottom: 15,
  },
  image: {
    width: '100%',
    height: 135,
    borderRadius: 8,
    backgroundColor: '#EEE',
  },
  imagePlaceholder: {
    width: '100%',
    height: 135,
    backgroundColor: '#EEE',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222',
    marginTop: 10,
  },
  category: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
    textTransform: 'capitalize',
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 8,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  message: {
    marginTop: 12,
    color: '#777',
  },
  error: {
    color: 'red',
    textAlign: 'center',
  },
  retry: {
    color: '#2563EB',
    marginTop: 15,
    fontWeight: 'bold',
  },
});