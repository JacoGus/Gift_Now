import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES } from '../constants/theme';
import { useShop } from '../context/ShopContext';
import { useUser } from '../context/UserContext';

const ShopManageScreen = ({ navigation }) => {
  const { shops, addShop, updateShop, deleteShop } = useShop();
  const { user } = useUser();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');
  const [deliveryFee, setDeliveryFee] = useState('R$ 5,90');
  const [editingShop, setEditingShop] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  if (!(user?.role === 'admin' || user?.role === 'vendor')) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={{ padding: SIZES.padding }}>
          <Text style={{ fontSize: 18 }}>Acesso negado. Apenas admins e vendedores podem gerenciar lojas.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleAdd = () => {
    if (!name) return Alert.alert('Preencha o nome da loja');
    addShop({ name, category, image: image || 'https://via.placeholder.com/150', deliveryFee, badges: [], items: [] });
    setName(''); setCategory(''); setImage(''); setDeliveryFee('R$ 5,90');
  };

  const handleDelete = (id) => {
    Alert.alert('Confirmar', 'Deseja remover esta loja?', [
      { text: 'Cancelar' },
      { text: 'Remover', onPress: () => deleteShop(id), style: 'destructive' }
    ]);
  };

  const handleStartEdit = (shop) => {
    setEditingShop(shop);
    setName(shop.name || '');
    setCategory(shop.category || '');
    setImage(shop.image || '');
    setDeliveryFee(shop.deliveryFee || 'R$ 5,90');
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (!editingShop) return;
    updateShop(editingShop.id, { name, category, image, deliveryFee });
    setShowEditModal(false);
    setEditingShop(null);
    setName(''); setCategory(''); setImage(''); setDeliveryFee('R$ 5,90');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={{ padding: SIZES.padding }}>
        <Text style={styles.title}>Gerenciar Lojas</Text>

        <View style={styles.form}>
          <TextInput placeholder="Nome da loja" value={name} onChangeText={setName} style={styles.input} />
          <TextInput placeholder="Categoria" value={category} onChangeText={setCategory} style={styles.input} />
          <TextInput placeholder="Imagem (url)" value={image} onChangeText={setImage} style={styles.input} />
          <TextInput placeholder="Frete" value={deliveryFee} onChangeText={setDeliveryFee} style={styles.input} />
          <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
            <Text style={styles.addButtonText}>Adicionar Loja</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={shops}
          keyExtractor={s => s.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.shopRow}>
              <TouchableOpacity onPress={() => navigation.navigate('ShopDetail', { shopId: item.id })}>
                <Text style={styles.shopName}>{item.name}</Text>
                <Text style={styles.shopMeta}>{item.category} • {item.deliveryFee}</Text>
              </TouchableOpacity>
              <View style={styles.actions}>
                <TouchableOpacity onPress={() => navigation.navigate('ShopDetail', { shopId: item.id })} style={styles.actionBtn}>
                  <Text style={styles.actionText}>Itens</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleStartEdit(item)} style={styles.actionBtn}>
                  <Text style={styles.actionText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.id)} style={[styles.actionBtn, { backgroundColor: '#FDECEA' }] }>
                  <Text style={[styles.actionText, { color: COLORS.danger }]}>Remover</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />

        <Modal visible={showEditModal} animationType="slide" transparent>
          <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.4)' }}>
            <View style={{ margin: 20, backgroundColor: '#fff', borderRadius: 8, padding: 16 }}>
              <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 8 }}>Editar Loja</Text>
              <TextInput placeholder="Nome da loja" value={name} onChangeText={setName} style={styles.input} />
              <TextInput placeholder="Categoria" value={category} onChangeText={setCategory} style={styles.input} />
              <TextInput placeholder="Imagem (url)" value={image} onChangeText={setImage} style={styles.input} />
              <TextInput placeholder="Frete" value={deliveryFee} onChangeText={setDeliveryFee} style={styles.input} />
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                <TouchableOpacity onPress={() => { setShowEditModal(false); setEditingShop(null); }} style={[styles.actionBtn, { marginRight: 8 }] }>
                  <Text style={styles.actionText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSaveEdit} style={[styles.actionBtn, { backgroundColor: COLORS.primary }]}>
                  <Text style={[styles.actionText, { color: '#fff' }]}>Salvar</Text>
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
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  form: { marginBottom: 18 },
  input: { backgroundColor: COLORS.white, padding: 12, borderRadius: 8, marginBottom: 8 },
  addButton: { backgroundColor: COLORS.primary, padding: 12, borderRadius: 8, alignItems: 'center' },
  addButtonText: { color: '#fff', fontWeight: '700' },
  shopRow: { backgroundColor: COLORS.white, padding: 12, borderRadius: 8, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  shopName: { fontSize: 16, fontWeight: '700' },
  shopMeta: { color: COLORS.textLight },
  actions: { flexDirection: 'row' },
  actionBtn: { padding: 8, marginLeft: 8, backgroundColor: '#F3F3F3', borderRadius: 6 },
  actionText: { color: COLORS.text }
});

export default ShopManageScreen;
