import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { COLORS, SIZES, FONTS } from '../constants/theme';
import { CATEGORIES } from '../data/mock';
import SearchBar from '../components/SearchBar';
import CategoryItem from '../components/CategoryItem';
import ShopCard from '../components/ShopCard';
import Button from '../components/Button';
import { useUser } from '../context/UserContext';
import { useShop } from '../context/ShopContext';
import { fetchShops } from '../services/shopService';

const HomeScreen = ({ navigation }) => {
  const { user } = useUser();
  const { shops: contextShops } = useShop();
  const [allShops, setAllShops] = useState([]);
  const [filteredShops, setFilteredShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    loadShops();
  }, []);

  useEffect(() => {
    // Mesclar lojas do Firebase com lojas do Context
    mergeShops();
  }, [contextShops]);

  const loadShops = async () => {
    try {
      setLoading(true);
      const firebaseShops = await fetchShops();
      
      // Mesclar lojas do Firebase com as do contexto
      const merged = mergeTwoSources(firebaseShops, contextShops);
      setAllShops(merged);
      setFilteredShops(merged);
    } catch (error) {
      console.error('Erro ao carregar lojas:', error);
      // Se falhar, usar apenas as do contexto
      setAllShops(contextShops);
      setFilteredShops(contextShops);
      
      Alert.alert(
        'Aviso',
        'Algumas lojas podem não estar disponíveis. Mostrando lojas locais.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const mergeTwoSources = (firebaseShops = [], contextShops = []) => {
    // Criar um Map para evitar duplicatas (usando id como chave)
    const shopsMap = new Map();
    
    // Adicionar lojas do Firebase primeiro
    firebaseShops.forEach(shop => {
      shopsMap.set(shop.id, shop);
    });
    
    // Adicionar lojas do Context (sobrescreve se id já existir)
    contextShops.forEach(shop => {
      shopsMap.set(shop.id, shop);
    });
    
    // Converter Map de volta para array
    return Array.from(shopsMap.values());
  };

  const mergeShops = () => {
    // Quando contextShops mudar, mesclar novamente
    const merged = mergeTwoSources(allShops, contextShops);
    setAllShops(merged);
    
    // Se houver busca ativa, aplicar o filtro novamente
    if (query) {
      handleSearch(query);
    } else {
      setFilteredShops(merged);
    }
  };

  const handleSearch = (q) => {
    const text = (q || '').toLowerCase();
    setQuery(q);
    if (!text) {
      setFilteredShops(allShops);
      return;
    }
    const result = allShops.filter(s => {
      if ((s.name || '').toLowerCase().includes(text)) return true;
      const hasItem = (s.items || []).some(i => (i.name || '').toLowerCase().includes(text));
      return hasItem;
    });
    setFilteredShops(result);
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Top Row: Greetings & Avatar */}
      <View style={styles.topRow}>
        <View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="gift" size={18} color={COLORS.primary} style={{ marginRight: 6 }} />
            <Text style={styles.appName}>GiftNow</Text>
          </View>
          <Text style={styles.greeting}>Olá, {user?.name}</Text>
        </View>
        <TouchableOpacity>
           <Image source={{ uri: user?.avatar }} style={styles.avatar} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <SearchBar value={query} onChangeText={setQuery} onSubmit={handleSearch} />

      {/* If user is admin or vendor show manage button */}
      {(user?.role === 'admin' || user?.role === 'vendor') && (
        <View style={{ marginTop: 10 }}>
          <Button title="Gerenciar Lojas" onPress={() => navigation.navigate('ShopManage')} />
        </View>
      )}

      {/* Banner Promocional */}
      <View style={styles.bannerContainer}>
        <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>Club GiftNow</Text>
            <Text style={styles.bannerText}>Ganhe cupons e entrega grátis!</Text>
        </View>
        <Ionicons name="gift-outline" size={50} color={COLORS.white} style={{ opacity: 0.8 }} />
      </View>

      {/* Categories */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Categorias</Text>
        <FlatList
          data={CATEGORIES}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <CategoryItem
                item={item}
                onPress={() => console.log('Categoria:', item.name)}
            />
          )}
          contentContainerStyle={{ paddingRight: SIZES.padding }}
        />
      </View>

      {/* Recommended Shops Title */}
      <View style={[styles.sectionContainer, { marginBottom: 10 }]}>
        <Text style={styles.sectionTitle}>Lojas Recomendadas</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Carregando lojas...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={filteredShops}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
            <ShopCard
                shop={item}
                onPress={() => navigation.navigate('ShopDetail', { shopId: item.id })}
            />
        )}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="storefront-outline" size={64} color={COLORS.textLight} />
            <Text style={styles.emptyText}>Nenhuma loja disponível no momento</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  listContent: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: 80,
    paddingTop: 10,
  },
  headerContainer: {
    marginBottom: 20,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  appName: {
    fontSize: SIZES.small,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  greeting: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  bannerContainer: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
    padding: 20,
    marginTop: 10,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  bannerContent: {
      flex: 1,
  },
  bannerTitle: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 4,
  },
  bannerText: {
    fontSize: SIZES.font,
    color: COLORS.white,
    opacity: 0.9,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: SIZES.font,
    color: COLORS.textLight,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 16,
    fontSize: SIZES.font,
    color: COLORS.textLight,
    textAlign: 'center',
  },
});

export default HomeScreen;