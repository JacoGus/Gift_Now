import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { useShop } from '../context/ShopContext';

const MeusPedidosScreen = ({ navigation }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Em Trânsito':
        return COLORS.primary;
      case 'Entregue':
        return COLORS.success;
      case 'Cancelado':
        return COLORS.danger;
      default:
        return COLORS.textLight;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Em Trânsito':
        return 'car-outline';
      case 'Entregue':
        return 'checkmark-circle-outline';
      case 'Cancelado':
        return 'close-circle-outline';
      default:
        return 'time-outline';
    }
  };

  const { orders, cancelOrder } = useShop();

  const renderOrderCard = (order) => (
    <View style={styles.orderCard} key={order.id}>
      <View style={styles.orderHeader}>
        <View style={styles.orderInfo}>
          <Text style={styles.orderId}>Pedido #{order.id}</Text>
          <Text style={styles.orderDate}>{order.createdAt ? order.createdAt.split('T')[0] : ''}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) + '20' }]}>
          <Ionicons 
            name={getStatusIcon(order.status)} 
            size={14} 
            color={getStatusColor(order.status)} 
            style={{ marginRight: 4 }}
          />
          <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}> 
            {order.status}
          </Text>
        </View>
      </View>

      <View style={styles.orderItems}>
        {order.items.map((item, index) => (
          <View key={index} style={styles.orderItem}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemQuantity}>x{item.qty}</Text>
            <Text style={styles.itemPrice}>R$ {item.price}</Text>
          </View>
        ))}
      </View>

      <View style={styles.orderFooter}>
        <View>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>R$ {order.total.toFixed(2)}</Text>
        </View>
        <TouchableOpacity
          style={styles.detailsButton}
          onPress={() => console.log('Ver detalhes do pedido:', order.id)}
          activeOpacity={0.7}
        >
          <Text style={styles.detailsButtonText}>Ver Detalhes</Text>
          <Ionicons name="chevron-forward" size={16} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
      {order.status !== 'Cancelado' && (
        <TouchableOpacity onPress={() => cancelOrder(order.id)} style={{ marginTop: 8 }}>
          <Text style={{ color: COLORS.danger }}>Cancelar pedido</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meus Pedidos</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {orders && orders.length > 0 ? (
          orders.map(o => renderOrderCard(o))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={64} color={COLORS.textLight} />
            <Text style={styles.emptyStateText}>
              Você ainda não possui pedidos
            </Text>
            <Text style={styles.emptyStateSubtext}>
              Seus pedidos aparecerão aqui
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding,
    paddingVertical: 15,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    ...SHADOWS.light,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  placeholder: {
    width: 34,
  },
  scrollContainer: {
    padding: SIZES.padding,
    paddingBottom: 100,
  },
  orderCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: 20,
    marginBottom: 20,
    ...SHADOWS.medium,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  orderDate: {
    fontSize: SIZES.small,
    color: COLORS.textLight,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    fontSize: SIZES.small,
    fontWeight: '600',
  },
  orderItems: {
    marginBottom: 15,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemName: {
    flex: 1,
    fontSize: SIZES.font,
    color: COLORS.text,
  },
  itemQuantity: {
    fontSize: SIZES.font,
    color: COLORS.textLight,
    marginHorizontal: 10,
  },
  itemPrice: {
    fontSize: SIZES.font,
    fontWeight: '600',
    color: COLORS.text,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  totalLabel: {
    fontSize: SIZES.small,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  totalValue: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#F3F0FF',
    borderRadius: 8,
  },
  detailsButtonText: {
    fontSize: SIZES.font,
    fontWeight: '600',
    color: COLORS.primary,
    marginRight: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: SIZES.medium,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 16,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: SIZES.font,
    color: COLORS.textLight,
    marginTop: 8,
    textAlign: 'center',
  },
});

export default MeusPedidosScreen;

