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

// Mock Data - Endereços de entrega
const MOCK_ADDRESSES = [
  {
    id: '1',
    apelido: 'Casa',
    rua: 'Rua das Flores',
    numero: '123',
    bairro: 'Centro',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '01310-100',
    principal: true,
  },
  {
    id: '2',
    apelido: 'Trabalho',
    rua: 'Avenida Paulista',
    numero: '1000',
    bairro: 'Bela Vista',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '01310-100',
    principal: false,
  },
];

const EnderecoEntregaScreen = ({ navigation }) => {
  const renderAddressCard = ({ item }) => (
    <View style={styles.addressCard}>
      <View style={styles.addressHeader}>
        <View style={styles.addressTitleRow}>
          <Ionicons 
            name={item.principal ? 'home' : 'briefcase'} 
            size={20} 
            color={COLORS.primary} 
            style={{ marginRight: 8 }}
          />
          <Text style={styles.addressApelido}>{item.apelido}</Text>
          {item.principal && (
            <View style={styles.principalBadge}>
              <Text style={styles.principalBadgeText}>Principal</Text>
            </View>
          )}
        </View>
        <TouchableOpacity
          onPress={() => console.log('Editar endereço:', item.id)}
          activeOpacity={0.7}
        >
          <Ionicons name="create-outline" size={20} color={COLORS.textLight} />
        </TouchableOpacity>
      </View>

      <View style={styles.addressContent}>
        <Text style={styles.addressText}>
          {item.rua}, {item.numero}
        </Text>
        <Text style={styles.addressText}>
          {item.bairro}, {item.cidade} - {item.estado}
        </Text>
        <Text style={styles.addressText}>
          CEP: {item.cep}
        </Text>
      </View>

      <View style={styles.addressActions}>
        {!item.principal && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => console.log('Definir como principal:', item.id)}
            activeOpacity={0.7}
          >
            <Ionicons name="star-outline" size={16} color={COLORS.primary} />
            <Text style={styles.actionButtonText}>Definir como principal</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => console.log('Excluir endereço:', item.id)}
          activeOpacity={0.7}
        >
          <Ionicons name="trash-outline" size={16} color={COLORS.danger} />
          <Text style={[styles.actionButtonText, styles.deleteButtonText]}>
            Excluir
          </Text>
        </TouchableOpacity>
      </View>
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
        <Text style={styles.headerTitle}>Endereços de Entrega</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <FlatList
          data={MOCK_ADDRESSES}
          keyExtractor={item => item.id}
          renderItem={renderAddressCard}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => console.log('Adicionar novo endereço')}
          activeOpacity={0.7}
        >
          <Ionicons name="add-circle-outline" size={24} color={COLORS.primary} />
          <Text style={styles.addButtonText}>Adicionar novo endereço</Text>
        </TouchableOpacity>
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
  addressCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: 20,
    ...SHADOWS.medium,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  addressTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  addressApelido: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.text,
    marginRight: 10,
  },
  principalBadge: {
    backgroundColor: COLORS.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  principalBadgeText: {
    fontSize: SIZES.small,
    fontWeight: '600',
    color: COLORS.primary,
  },
  addressContent: {
    marginBottom: 15,
  },
  addressText: {
    fontSize: SIZES.font,
    color: COLORS.text,
    marginBottom: 4,
    lineHeight: 20,
  },
  addressActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F3F0FF',
    borderRadius: 8,
  },
  actionButtonText: {
    fontSize: SIZES.small,
    fontWeight: '600',
    color: COLORS.primary,
    marginLeft: 6,
  },
  deleteButton: {
    backgroundColor: '#FFF0F0',
  },
  deleteButtonText: {
    color: COLORS.danger,
  },
  separator: {
    height: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: 18,
    marginTop: 20,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    ...SHADOWS.light,
  },
  addButtonText: {
    fontSize: SIZES.medium,
    fontWeight: '600',
    color: COLORS.primary,
    marginLeft: 8,
  },
});

export default EnderecoEntregaScreen;

