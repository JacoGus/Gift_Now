import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme';

// Props: value, onChangeText, onSubmit (triggered when search icon pressed)
const SearchBar = ({ value, onChangeText, onSubmit }) => {
  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Buscar lojas ou presentes"
        placeholderTextColor={COLORS.textLight}
        style={styles.input}
        autoCorrect={false}
        autoCapitalize="none"
        value={value}
        onChangeText={onChangeText}
      />
      <TouchableOpacity onPress={() => onSubmit && onSubmit(value)} style={styles.iconWrap}>
        <Ionicons name="search" size={20} color={COLORS.primary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: SIZES.padding / 2,
    height: 50,
    borderRadius: SIZES.radius,
    // Sombra suave
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    marginVertical: SIZES.base,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: SIZES.font,
    color: COLORS.text,
  },
  iconWrap: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SearchBar;
