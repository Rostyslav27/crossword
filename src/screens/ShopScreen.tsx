import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useUserStore } from '../store/useUserStore';
import { showRewardedAd } from '../services/ads';
import { purchaseProduct, IAP_PRODUCT_LIST } from '../services/iap';

export default function ShopScreen() {
  const { energy, gain } = useUserStore();
  const [loading, setLoading] = useState<string | null>(null); // productId or 'ad'

  async function handleWatchAd() {
    setLoading('ad');
    try {
      const result = await showRewardedAd();
      if (result === 'rewarded') {
        await gain(1);
        Alert.alert('⚡ +1 Енергія', 'Дякуємо за перегляд реклами!');
      }
    } finally {
      setLoading(null);
    }
  }

  async function handleBuy(productId: string, energyAmount: number) {
    setLoading(productId);
    try {
      const earned = await purchaseProduct(productId);
      if (earned !== null) {
        await gain(earned);
        Alert.alert(`⚡ +${earned} Енергії`, 'Покупку успішно завершено!');
      }
    } finally {
      setLoading(null);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.energyDisplay}>
        <Text style={styles.energyLabel}>Ваша енергія</Text>
        <Text style={styles.energyNum}>⚡ {energy.amount}</Text>
      </View>

      <Text style={styles.sectionTitle}>Безкоштовно</Text>
      <TouchableOpacity
        style={[styles.card, styles.cardAd]}
        onPress={handleWatchAd}
        disabled={loading !== null}
      >
        {loading === 'ad' ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Text style={styles.cardIcon}>📺</Text>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>Переглянути рекламу</Text>
              <Text style={styles.cardSub}>Отримайте +1 ⚡ безкоштовно</Text>
            </View>
            <Text style={styles.cardPrice}>Безкоштовно</Text>
          </>
        )}
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Купити</Text>
      {IAP_PRODUCT_LIST.map((product) => (
        <TouchableOpacity
          key={product.productId}
          style={[styles.card, styles.cardBuy]}
          onPress={() => handleBuy(product.productId, product.energyAmount)}
          disabled={loading !== null}
        >
          {loading === product.productId ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.cardIcon}>⚡</Text>
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>{product.title}</Text>
                <Text style={styles.cardSub}>{product.description}</Text>
              </View>
              <Text style={styles.cardPrice}>{product.price}</Text>
            </>
          )}
        </TouchableOpacity>
      ))}

      <Text style={styles.note}>
        * Реальна купівля залежить від підключення до App Store / Google Play.
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f8', padding: 16 },
  energyDisplay: {
    alignItems: 'center',
    backgroundColor: '#1a237e',
    borderRadius: 12,
    paddingVertical: 20,
    marginBottom: 24,
  },
  energyLabel: { color: '#c5cae9', fontSize: 13 },
  energyNum: { color: '#ffeb3b', fontSize: 36, fontWeight: 'bold', marginTop: 4 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    marginTop: 4,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    gap: 12,
    minHeight: 70,
  },
  cardAd: { backgroundColor: '#f57c00' },
  cardBuy: { backgroundColor: '#3f51b5' },
  cardIcon: { fontSize: 28 },
  cardBody: { flex: 1 },
  cardTitle: { color: '#fff', fontWeight: '700', fontSize: 15 },
  cardSub: { color: 'rgba(255,255,255,0.75)', fontSize: 12, marginTop: 2 },
  cardPrice: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  note: { color: '#aaa', fontSize: 11, textAlign: 'center', marginTop: 16, lineHeight: 16 },
});
