import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { COLORS, SIZES } from '../constants/theme';
import { useShop } from '../context/ShopContext';
import { useUser } from '../context/UserContext';

const ShopDetailScreen = ({ navigation }) => {
  const route = useRoute();
  const { shopId } = route.params || {};
  const { shops, addItem, updateItem, deleteItem, addToCart } = useShop();
  const { user } = useUser();
  const shop = shops.find(s => s.id === shopId) || null;

  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);

  if (!shop) return (
    <SafeAreaView style={{ flex: 1, padding: SIZES.padding }}>
      <Text>Loja não encontrada</Text>
    </SafeAreaView>
  );

  const handleAddItem = () => {
    if (!newName || !newPrice) return Alert.alert('Preencha nome e preço');
    addItem(shop.id, { name: newName, price: newPrice });
    setNewName(''); setNewPrice('');
  };

  const handleAddToCart = (item) => {
    console.log('[ShopDetailScreen] Adding to cart:', { shopId: shop.id, itemId: item.id, name: item.name, price: item.price });
    // pass the stored item.price (could be number or string with comma) — ShopContext will parse
    addToCart(shop.id, item.id, item.name, item.price, 1);
    Alert.alert('Adicionado', `${item.name} adicionado ao carrinho`);
  };

  const handleStartEditItem = (item) => {
    setEditingItem(item);
    setEditName(item.name || '');
    setEditPrice(item.price != null ? String(item.price) : '');
    setShowEditModal(true);
  };

  const handleSaveItemEdit = () => {
    if (!editingItem) return;
    updateItem(shop.id, editingItem.id, { name: editName, price: editPrice });
    setShowEditModal(false);
    setEditingItem(null);
    setEditName(''); setEditPrice('');
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemRow}>
      <View>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>R$ {item.price}</Text>
      </View>
      <View style={{ flexDirection: 'row' }}>
        {user?.role !== 'client' && (
          <TouchableOpacity onPress={() => handleStartEditItem(item)} style={styles.smallBtn}>
            <Text style={styles.smallText}>Editar</Text>
          </TouchableOpacity>
        )}
        {user?.role === 'client' ? (
          <TouchableOpacity onPress={() => handleAddToCart(item)} style={[styles.smallBtn, { backgroundColor: COLORS.primary }] }>
            <Text style={[styles.smallText, { color: '#fff' }]}>Adicionar</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => deleteItem(shop.id, item.id)} style={[styles.smallBtn, { backgroundColor: '#FDECEA' }] }>
            <Text style={[styles.smallText, { color: COLORS.danger }]}>Remover</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={{ padding: SIZES.padding }}>
        <Text style={styles.title}>{shop.name}</Text>
        <Text style={{ color: '#666', marginBottom: 12 }}>{shop.category} • {shop.deliveryFee}</Text>

        {(user?.role === 'admin' || user?.role === 'vendor') && (
          <View style={styles.addForm}>
            <TextInput placeholder="Nome do item" value={newName} onChangeText={setNewName} style={styles.input} />
            <TextInput placeholder="Preço (somente números)" value={newPrice} onChangeText={setNewPrice} style={styles.input} keyboardType="numeric" />
            <TouchableOpacity style={styles.addBtn} onPress={handleAddItem}>
              <Text style={{ color: '#fff' }}>Adicionar Item</Text>
            </TouchableOpacity>
          </View>
        )}

        <FlatList
          data={shop.items || []}
          keyExtractor={i => i.id.toString()}
          renderItem={renderItem}
          ListEmptyComponent={<Text>Sem itens nesta loja</Text>}
        />
        <Modal visible={showEditModal} animationType="slide" transparent>
          <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.4)' }}>
            <View style={{ margin: 20, backgroundColor: '#fff', borderRadius: 8, padding: 16 }}>
              <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 8 }}>Editar Item</Text>
              <TextInput placeholder="Nome do item" value={editName} onChangeText={setEditName} style={styles.input} />
              <TextInput placeholder="Preço" value={editPrice} onChangeText={setEditPrice} style={styles.input} keyboardType="numeric" />
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                <TouchableOpacity onPress={() => { setShowEditModal(false); setEditingItem(null); }} style={[styles.smallBtn, { marginRight: 8 }]}>
                  <Text style={styles.smallText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSaveItemEdit} style={[styles.smallBtn, { backgroundColor: COLORS.primary }]}>
                  <Text style={[styles.smallText, { color: '#fff' }]}>Salvar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
  addForm: { marginBottom: 12 },
  input: { backgroundColor: COLORS.white, padding: 10, borderRadius: 8, marginBottom: 8 },
  addBtn: { backgroundColor: COLORS.primary, padding: 10, borderRadius: 8, alignItems: 'center' },
  itemRow: { backgroundColor: COLORS.white, padding: 12, borderRadius: 8, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemName: { fontWeight: '700' },
  itemPrice: { color: COLORS.textLight },
  smallBtn: { padding: 8, marginLeft: 8, backgroundColor: '#F3F3F3', borderRadius: 6 },
  smallText: { color: COLORS.text }
});

export default ShopDetailScreen;
