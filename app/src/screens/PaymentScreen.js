import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { PAYMENT_METHODS } from '../data/mock';
import PaymentMethodItem from '../components/PaymentMethodItem';
import Button from '../components/Button';
import { useShop } from '../context/ShopContext';
import { useUser } from '../context/UserContext';
import { usePayment } from '../context/PaymentContext';

const PaymentScreen = ({ navigation }) => {
  const [selectedMethod, setSelectedMethod] = React.useState(null);
  const { cart, checkout } = useShop();
  const { user } = useUser();
  const { paymentMethods } = usePayment();

  const handleSelect = (id) => {
    setSelectedMethod(id);
  };

  const handleConfirm = () => {
    if (!selectedMethod) {
      Alert.alert('Atenção', 'Selecione uma forma de pagamento para continuar.');
      return;
    }
    // perform checkout
    const created = checkout({ customer: user });
    Alert.alert('Sucesso', `Pedido criado (${created.length} pedidos)` , [
      { text: 'OK', onPress: () => navigation.navigate('MeusPedidos') }
    ]);
  };

  const renderHeader = () => (
    <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pagamento</Text>
    </View>
  );

  const renderFooter = () => (
    <View style={styles.footerContainer}>
        {/* Order Summary */}
        <View style={styles.summaryContainer}>
            {(() => {
              const subtotal = cart.reduce((s, it) => s + (Number(it.price) * it.qty || 0), 0);
              const shopsCount = new Set(cart.map(c => c.shopId)).size;
              const delivery = shopsCount * 5.9;
              const total = subtotal + delivery;
              return (
                <>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Subtotal</Text>
                    <Text style={styles.summaryValue}>R$ {subtotal.toFixed(2)}</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Entrega</Text>
                    <Text style={styles.summaryValue}>R$ {delivery.toFixed(2)}</Text>
                  </View>
                  <View style={[styles.summaryRow, styles.totalRow]}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalValue}>R$ {total.toFixed(2)}</Text>
                  </View>
                </>
              );
            })()}
        </View>

        {/* Action Button */}
        <Button
            title="Confirmar pagamento"
            onPress={handleConfirm}
        />
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {renderHeader()}

      <FlatList
        data={paymentMethods}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
            <PaymentMethodItem
                method={item}
                isSelected={Boolean(selectedMethod === item.id)}
                onPress={() => handleSelect(item.id)}
            />
        )}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: SIZES.medium, fontWeight: '600', color: COLORS.text, marginBottom: 12 }}>Suas formas de pagamento:</Text>
          </View>
        }
        ListEmptyComponent={
          <View style={{ padding: SIZES.padding }}>
            <Text style={{ color: COLORS.textLight }}>Nenhum cartão adicionado</Text>
            <Button
              title="Adicionar cartão"
              onPress={() => navigation.navigate('ManagePaymentMethods')}
              style={{ marginTop: 12 }}
            />
          </View>
        }
      />

      {renderFooter()}
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
    paddingHorizontal: SIZES.padding,
    paddingVertical: 15,
    backgroundColor: COLORS.white,
    ...SHADOWS.light,
    zIndex: 1,
  },
  backButton: {
    marginRight: 15,
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
  footerContainer: {
    padding: SIZES.padding,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    ...SHADOWS.medium,
  },
  summaryContainer: {
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: SIZES.font,
    color: COLORS.textLight,
  },
  summaryValue: {
    fontSize: SIZES.font,
    color: COLORS.text,
    fontWeight: '500',
  },
  totalRow: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 10,
  },
  totalLabel: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  totalValue: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
});

export default PaymentScreen;
