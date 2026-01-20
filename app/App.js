import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { UserProvider } from './src/context/UserContext';
import { ShopProvider } from './src/context/ShopContext';
import { PaymentProvider } from './src/context/PaymentContext';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import BottomTabNavigator from './src/navigation/BottomTabNavigator';
import PaymentScreen from './src/screens/PaymentScreen';
import MeusPedidosScreen from './src/screens/MeusPedidosScreen';
import EnderecoEntregaScreen from './src/screens/EnderecoEntregaScreen';
import CartScreen from './src/screens/CartScreen';
import ManagePaymentMethodsScreen from './src/screens/ManagePaymentMethodsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <UserProvider>
      <ShopProvider>
        <PaymentProvider>
          <SafeAreaProvider>
            <NavigationContainer>
          <StatusBar style="dark" />
          <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{
              headerShown: false
            }}
          >
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Main" component={BottomTabNavigator} />
            <Stack.Screen name="ShopDetail" component={require('./src/screens/ShopDetailScreen').default} />
            <Stack.Screen name="ShopManage" component={require('./src/screens/ShopManageScreen').default} />
            <Stack.Screen name="CartView" component={CartScreen} />
            <Stack.Screen name="Payment" component={PaymentScreen} />
            <Stack.Screen name="ManagePaymentMethods" component={ManagePaymentMethodsScreen} />
            <Stack.Screen name="MeusPedidos" component={MeusPedidosScreen} />
            <Stack.Screen name="EnderecoEntrega" component={EnderecoEntregaScreen} />
          </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
        </PaymentProvider>
      </ShopProvider>
    </UserProvider>
  );
}
