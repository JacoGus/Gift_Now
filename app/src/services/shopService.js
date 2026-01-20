import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Busca todas as lojas da coleção 'lojas' no Firestore
 * @returns {Promise<Array>} Array de lojas com os campos: name, category, rating, image
 */
export const fetchShops = async () => {
  try {
    const shopsCollection = collection(db, 'lojas');
    const shopsSnapshot = await getDocs(shopsCollection);
    
    const shops = [];
    shopsSnapshot.forEach((doc) => {
      const data = doc.data();
      shops.push({
        id: doc.id, // ID do documento
        name: data.name || '',
        category: data.category || '',
        rating: data.rating || 0,
        image: data.image || '',
        // Campos opcionais com valores padrão para manter compatibilidade com ShopCard
        deliveryTime: data.deliveryTime || '60 min',
        deliveryFee: data.deliveryFee || 'R$ 5,90',
        badges: data.badges || []
      });
    });
    
    return shops;
  } catch (error) {
    console.error('Erro ao buscar lojas do Firestore:', error);
    throw error;
  }
};

