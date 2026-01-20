import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { usePayment } from '../context/PaymentContext';
import Button from '../components/Button';

const ManagePaymentMethodsScreen = ({ navigation }) => {
  const { paymentMethods, addPaymentMethod, updatePaymentMethod, deletePaymentMethod } = usePayment();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    type: 'CREDIT_CARD',
    brand: 'Visa',
    holderName: '',
    last4: '',
    expiryMonth: '',
    expiryYear: '',
  });

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      type: 'CREDIT_CARD',
      brand: 'Visa',
      holderName: '',
      last4: '',
      expiryMonth: '',
      expiryYear: '',
    });
    setModalVisible(true);
  };

  const openEditModal = (method) => {
    setEditingId(method.id);
    setFormData(method);
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!formData.holderName || !formData.last4) {
      Alert.alert('Erro', 'Preencha o nome do titular e últimos 4 dígitos');
      return;
    }

    if (editingId) {
      updatePaymentMethod(editingId, formData);
      Alert.alert('Sucesso', 'Cartão atualizado');
    } else {
      addPaymentMethod(formData);
      Alert.alert('Sucesso', 'Cartão adicionado');
    }
    setModalVisible(false);
  };

  const handleDelete = (id) => {
    Alert.alert('Remover', 'Deseja remover este cartão?', [
      { text: 'Cancelar' },
      {
        text: 'Remover',
        onPress: () => {
          deletePaymentMethod(id);
          Alert.alert('Sucesso', 'Cartão removido');
        },
        style: 'destructive',
      },
    ]);
  };

  const renderCard = ({ item }) => (
    <View style={styles.cardContainer}>
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Ionicons name={item.icon || 'card-outline'} size={24} color={COLORS.primary} />
          <Text style={styles.cardBrand}>{item.brand || item.type}</Text>
        </View>
        <Text style={styles.holderName}>{item.holderName}</Text>
        {item.type === 'CREDIT_CARD' && (
          <>
            <Text style={styles.cardNumber}>•••• •••• •••• {item.last4}</Text>
            <View style={styles.cardFooter}>
              <Text style={styles.expiryText}>Válido até {item.expiryMonth}/{item.expiryYear}</Text>
            </View>
          </>
        )}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() => openEditModal(item)}
          style={styles.actionBtn}
        >
          <Ionicons name="pencil-outline" size={18} color={COLORS.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDelete(item.id)}
          style={[styles.actionBtn, { backgroundColor: '#FDECEA' }]}
        >
          <Ionicons name="trash-outline" size={18} color={COLORS.danger} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Formas de Pagamento</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={paymentMethods}
        keyExtractor={(item) => item.id}
        renderItem={renderCard}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="card-outline" size={64} color={COLORS.textLight} />
            <Text style={styles.emptyText}>Nenhum cartão adicionado</Text>
          </View>
        }
      />

      <View style={styles.addButtonContainer}>
        <Button
          title="Adicionar Cartão"
          iconName="add"
          onPress={openAddModal}
        />
      </View>

      {/* Add/Edit Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <SafeAreaView style={styles.modalSafeArea}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={28} color={COLORS.text} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {editingId ? 'Editar Cartão' : 'Novo Cartão'}
            </Text>
            <View style={{ width: 28 }} />
          </View>

          <View style={styles.modalContent}>
            {/* Tipo de Pagamento */}
            <Text style={styles.formLabel}>Tipo de Pagamento</Text>
            <View style={styles.typeSelector}>
              {['CREDIT_CARD', 'PIX'].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeButton,
                    formData.type === type && styles.typeButtonActive,
                  ]}
                  onPress={() => setFormData({ ...formData, type })}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      formData.type === type && styles.typeButtonTextActive,
                    ]}
                  >
                    {type === 'CREDIT_CARD' ? 'Cartão' : 'PIX'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {formData.type === 'CREDIT_CARD' ? (
              <>
                {/* Bandeira */}
                <Text style={styles.formLabel}>Bandeira</Text>
                <View style={styles.brandSelector}>
                  {['Visa', 'Mastercard', 'Elo'].map((brand) => (
                    <TouchableOpacity
                      key={brand}
                      style={[
                        styles.brandButton,
                        formData.brand === brand && styles.brandButtonActive,
                      ]}
                      onPress={() => setFormData({ ...formData, brand })}
                    >
                      <Text
                        style={[
                          styles.brandButtonText,
                          formData.brand === brand && styles.brandButtonTextActive,
                        ]}
                      >
                        {brand}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Nome do Titular */}
                <Text style={styles.formLabel}>Nome do Titular</Text>
                <TextInput
                  style={styles.input}
                  placeholder="JOÃO SILVA"
                  value={formData.holderName}
                  onChangeText={(text) =>
                    setFormData({ ...formData, holderName: text.toUpperCase() })
                  }
                  placeholderTextColor={COLORS.textLight}
                />

                {/* Últimos 4 dígitos */}
                <Text style={styles.formLabel}>Últimos 4 Dígitos</Text>
                <TextInput
                  style={styles.input}
                  placeholder="1234"
                  value={formData.last4}
                  onChangeText={(text) =>
                    setFormData({ ...formData, last4: text.slice(0, 4) })
                  }
                  keyboardType="numeric"
                  maxLength={4}
                  placeholderTextColor={COLORS.textLight}
                />

                {/* Data de Expiração */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <View style={{ flex: 1, marginRight: 10 }}>
                    <Text style={styles.formLabel}>Mês</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="MM"
                      value={formData.expiryMonth}
                      onChangeText={(text) =>
                        setFormData({
                          ...formData,
                          expiryMonth: text.slice(0, 2),
                        })
                      }
                      keyboardType="numeric"
                      maxLength={2}
                      placeholderTextColor={COLORS.textLight}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.formLabel}>Ano</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="YY"
                      value={formData.expiryYear}
                      onChangeText={(text) =>
                        setFormData({
                          ...formData,
                          expiryYear: text.slice(0, 2),
                        })
                      }
                      keyboardType="numeric"
                      maxLength={2}
                      placeholderTextColor={COLORS.textLight}
                    />
                  </View>
                </View>
              </>
            ) : (
              <View style={styles.pixInfo}>
                <Ionicons name="qr-code-outline" size={64} color={COLORS.primary} />
                <Text style={styles.pixText}>PIX - Pagamento instantâneo</Text>
                <Text style={styles.pixSubtext}>
                  Você será direcionado para confirmar o pagamento com PIX
                </Text>
              </View>
            )}

            <Button
              title={editingId ? 'Atualizar' : 'Adicionar'}
              onPress={handleSave}
              style={{ marginTop: 20 }}
            />
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  listContent: { padding: SIZES.padding, paddingBottom: 100 },
  cardContainer: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...SHADOWS.light,
  },
  cardContent: { flex: 1 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  cardBrand: { fontSize: SIZES.medium, fontWeight: '700', marginLeft: 8, color: COLORS.text },
  holderName: { fontSize: SIZES.font, fontWeight: '600', color: COLORS.text, marginBottom: 4 },
  cardNumber: { fontSize: SIZES.small, color: COLORS.textLight, marginBottom: 6 },
  cardFooter: {},
  expiryText: { fontSize: SIZES.small, color: COLORS.textLight },
  actions: { flexDirection: 'row', marginLeft: 8 },
  actionBtn: { padding: 8, marginLeft: 8, backgroundColor: '#F3F3F3', borderRadius: 6 },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: SIZES.font,
    color: COLORS.textLight,
    marginTop: 16,
    textAlign: 'center',
  },
  addButtonContainer: { padding: SIZES.padding, backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: '#F0F0F0' },
  modalSafeArea: { flex: 1, backgroundColor: COLORS.white },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  modalContent: {
    flex: 1,
    padding: SIZES.padding,
  },
  formLabel: {
    fontSize: SIZES.font,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: SIZES.font,
    color: COLORS.text,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 10,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  typeButtonText: {
    color: COLORS.text,
    fontWeight: '600',
  },
  typeButtonTextActive: {
    color: COLORS.white,
  },
  brandSelector: {
    flexDirection: 'row',
    gap: 10,
  },
  brandButton: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    alignItems: 'center',
  },
  brandButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  brandButtonText: {
    color: COLORS.text,
    fontWeight: '600',
  },
  brandButtonTextActive: {
    color: COLORS.white,
  },
  pixInfo: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 40,
  },
  pixText: {
    fontSize: SIZES.medium,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 16,
  },
  pixSubtext: {
    fontSize: SIZES.font,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: 8,
  },
});

export default ManagePaymentMethodsScreen;
