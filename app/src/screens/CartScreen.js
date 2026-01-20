import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { useShop } from '../context/ShopContext';
import Button from '../components/Button';

const CartScreen = ({ navigation }) => {
  const { shops, cart, removeFromCart, updateCartQty } = useShop();
  
  // Log cart changes for debugging
  React.useEffect(() => {
    console.log('[CartScreen] Cart updated:', cart);
  }, [cart]);

  // Group cart items by shop
  const itemsByShop = useMemo(() => {
    const grouped = {};
    cart.forEach((cartItem) => {
      if (!grouped[cartItem.shopId]) {
        grouped[cartItem.shopId] = [];
      }
      grouped[cartItem.shopId].push(cartItem);
    });
    console.log('[CartScreen] Items by shop:', grouped);
    return grouped;
  }, [cart]);

  const shopsByCartId = useMemo(() => {
    const map = {};
    cart.forEach((item) => {
      if (!map[item.shopId]) {
        map[item.shopId] = shops.find((s) => s.id === item.shopId);
      }
    });
    return map;
  }, [cart, shops]);

  const totalPrice = useMemo(() => {
    return cart.reduce((sum, item) => sum + (Number(item.price) * item.qty), 0);
  }, [cart]);

  const handleRemoveItem = (shopId, itemId) => {
    Alert.alert('Remover', 'Deseja remover este item do carrinho?', [
      { text: 'Cancelar' },
      {
        text: 'Remover',
        onPress: () => removeFromCart(Number(shopId), itemId),
        style: 'destructive',
      },
    ]);
  };

  const handleIncrement = (shopId, itemId, currentQty) => {
    updateCartQty(Number(shopId), itemId, currentQty + 1);
  };

  const handleDecrement = (shopId, itemId, currentQty) => {
    if (currentQty > 1) {
      updateCartQty(Number(shopId), itemId, currentQty - 1);
    } else {
      handleRemoveItem(shopId, itemId);
    }
  };

  const renderShopGroup = ({ shopId, items }) => {
    const shop = shopsByCartId[shopId];
    if (!shop) return null;

    return (
      <View key={shopId} style={styles.shopGroup}>
        <View style={styles.shopHeader}>
          <Ionicons name="storefront-outline" size={20} color={COLORS.primary} />
          <Text style={styles.shopName}>{shop.name}</Text>
        </View>

        {items.map((item) => (
          <View key={`${shopId}-${item.itemId}`} style={styles.cartItemContainer}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>R$ {Number(item.price).toFixed(2)}</Text>
            </View>

            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={styles.quantityBtn}
                onPress={() => handleDecrement(shopId, item.itemId, item.qty)}
              >
                <Ionicons name="remove" size={16} color={COLORS.primary} />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{item.qty}</Text>
              <TouchableOpacity
                style={styles.quantityBtn}
                onPress={() => handleIncrement(shopId, item.itemId, item.qty)}
              >
                <Ionicons name="add" size={16} color={COLORS.primary} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => handleRemoveItem(shopId, item.itemId)}
              style={styles.deleteBtn}
            >
              <Ionicons name="trash-outline" size={18} color={COLORS.danger} />
            </TouchableOpacity>
          </View>
        ))}

        <View style={styles.shopSummary}>
          <Text style={styles.shopSubtotal}>
            Subtotal da loja: R$ {items.reduce((s, it) => s + (Number(it.price) * it.qty), 0).toFixed(2)}
          </Text>
          <Text style={styles.shopDelivery}>Frete: R$ 5,90</Text>
        </View>
      </View>
    );
  };

  if (cart.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Carrinho</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={64} color={COLORS.textLight} />
          <Text style={styles.emptyText}>Seu carrinho está vazio</Text>
          <Text style={styles.emptySubtext}>Adicione itens para começar a comprar</Text>
          <Button
            title="Voltar às lojas"
            onPress={() => navigation.navigate('Home')}
            style={{ marginTop: 20 }}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Carrinho</Text>
      </View>

      <FlatList
        data={Object.keys(itemsByShop).map((shopId) => ({
          shopId,
          items: itemsByShop[shopId],
        }))}
        keyExtractor={(item) => item.shopId.toString()}
        renderItem={({ item }) => renderShopGroup(item)}
        contentContainerStyle={styles.listContent}
      />

      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total do carrinho</Text>
          <Text style={styles.totalValue}>R$ {totalPrice.toFixed(2)}</Text>
          <Text style={styles.freightNote}>
            +R$ {(Object.keys(itemsByShop).length * 5.9).toFixed(2)} de frete
          </Text>
        </View>
        <Button
          title="Ir para pagamento"
          onPress={() => navigation.navigate('Payment')}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  header: {
    padding: SIZES.padding,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  listContent: {
    padding: SIZES.padding,
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
  },
  emptyText: {
    fontSize: SIZES.large,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: SIZES.font,
    color: COLORS.textLight,
    marginTop: 8,
    textAlign: 'center',
  },
  shopGroup: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    marginBottom: 16,
    overflow: 'hidden',
    ...SHADOWS.light,
  },
  shopHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F9F9F9',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  shopName: {
    fontSize: SIZES.medium,
    fontWeight: '700',
    color: COLORS.text,
    marginLeft: 10,
  },
  cartItemContainer: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
    alignItems: 'center',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: SIZES.font,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: SIZES.small,
    color: COLORS.textLight,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    backgroundColor: '#F9F9F9',
    borderRadius: 6,
    paddingHorizontal: 4,
  },
  quantityBtn: {
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    marginHorizontal: 8,
    fontWeight: '600',
    minWidth: 20,
    textAlign: 'center',
  },
  deleteBtn: {
    padding: 8,
  },
  shopSummary: {
    padding: 12,
    backgroundColor: '#F9F9F9',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  shopSubtotal: {
    fontSize: SIZES.font,
    color: COLORS.text,
    fontWeight: '600',
    marginBottom: 4,
  },
  shopDelivery: {
    fontSize: SIZES.small,
    color: COLORS.textLight,
  },
  footer: {
    padding: SIZES.padding,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    ...SHADOWS.medium,
  },
  totalContainer: {
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: SIZES.font,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  totalValue: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  freightNote: {
    fontSize: SIZES.small,
    color: COLORS.textLight,
  },
});

export default CartScreen;
