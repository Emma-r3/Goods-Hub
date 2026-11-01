import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import * as SecureStore from 'expo-secure-store';
import api from './src/services/api';

import LoginScreen from './src/screens/LoginScreen';
import ProductListScreen from './src/screens/ProductListScreen';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import CartScreen from './src/screens/CartScreen';
import CheckoutScreen from './src/screens/CheckoutScreen';
import OrderSuccessScreen from './src/screens/OrderSuccessScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState(null);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const token = await SecureStore.getItemAsync('token');

        if (!token) {
          setInitialRoute('Login');
          return;
        }

        await api.get('/auth/me');
        setInitialRoute('Products');
      } catch (error) {
        await SecureStore.deleteItemAsync('token');
        await SecureStore.deleteItemAsync('user');
        setInitialRoute('Login');
      }
    };

    checkLogin();
  }, []);

  const addToCart = (product) => {
    const productId = String(product._id || product.customId);

    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (item) => String(item._id || item.customId) === productId
      );

      if (existingItem) {
        return currentCart.map((item) =>
          String(item._id || item.customId) === productId
            ? {
                ...item,
                quantity: Math.min(
                  item.quantity + 1,
                  Number(item.stock) || 999
                ),
              }
            : item
        );
      }

      return [...currentCart, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId, change) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          String(item._id || item.customId) === String(productId)
            ? {
                ...item,
                quantity: Math.min(
                  Math.max(item.quantity + change, 0),
                  Number(item.stock) || 999
                ),
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId) => {
    setCart((currentCart) =>
      currentCart.filter(
        (item) =>
          String(item._id || item.customId) !== String(productId)
      )
    );
  };

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  if (!initialRoute) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#222" />
        <Text style={styles.loadingText}>Loading GoodsHub...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Products"
          options={{ headerShown: false }}
        >
          {(props) => (
            <ProductListScreen
              {...props}
              cartCount={cartCount}
            />
          )}
        </Stack.Screen>

        <Stack.Screen
          name="ProductDetail"
          options={{ title: 'Product Detail' }}
        >
          {(props) => (
            <ProductDetailScreen
              {...props}
              onAddToCart={addToCart}
              cartCount={cartCount}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Cart" options={{ title: 'Shopping Cart' }}>
          {(props) => (
            <CartScreen
              {...props}
              cart={cart}
              updateQuantity={updateQuantity}
              removeFromCart={removeFromCart}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Checkout" options={{ title: 'Checkout' }}>
          {(props) => (
            <CheckoutScreen
              {...props}
              cart={cart}
              onOrderPlaced={() => setCart([])}
            />
          )}
        </Stack.Screen>

        <Stack.Screen
          name="OrderSuccess"
          component={OrderSuccessScreen}
          options={{
            title: 'Order Confirmation',
            headerBackVisible: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
  },
  loadingText: {
    marginTop: 12,
    color: '#777',
  },
});