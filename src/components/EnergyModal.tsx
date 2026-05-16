import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useUserStore } from '../store/useUserStore';
import { showRewardedAd } from '../services/ads';

interface EnergyModalProps {
  visible: boolean;
  onClose: () => void;
  /** Called when the user successfully gains energy and wants to proceed. */
  onEnergyGained: () => void;
}

export default function EnergyModal({ visible, onClose, onEnergyGained }: EnergyModalProps) {
  const { energy, spend, gain } = useUserStore();
  const [loading, setLoading] = useState(false);

  async function handleWatchAd() {
    setLoading(true);
    try {
      const result = await showRewardedAd();
      if (result === 'rewarded') {
        await gain(1);
        // Now try to spend the just-gained energy.
        const ok = await spend();
        if (ok) onEnergyGained();
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleSpendEnergy() {
    const ok = await spend();
    if (ok) onEnergyGained();
  }

  const hasEnergy = energy.amount > 0;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Відкрити кросворд</Text>
          <Text style={styles.subtitle}>
            ⚡ Поточна енергія: <Text style={styles.energyNum}>{energy.amount}</Text>
          </Text>

          {hasEnergy ? (
            <TouchableOpacity
              style={[styles.btn, styles.btnPrimary]}
              onPress={handleSpendEnergy}
              disabled={loading}
            >
              <Text style={styles.btnText}>Витратити 1 ⚡ і відкрити</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.noEnergy}>У вас немає енергії. Отримайте її:</Text>
          )}

          <TouchableOpacity
            style={[styles.btn, styles.btnAd]}
            onPress={handleWatchAd}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>📺 Переглянути рекламу (+1 ⚡)</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>Закрити</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '85%',
    gap: 12,
    alignItems: 'center',
  },
  title: { fontSize: 18, fontWeight: 'bold', color: '#1a237e' },
  subtitle: { fontSize: 14, color: '#555' },
  energyNum: { fontWeight: 'bold', color: '#f57c00' },
  noEnergy: { fontSize: 13, color: '#e53935', textAlign: 'center' },
  btn: {
    width: '100%',
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnPrimary: { backgroundColor: '#3f51b5' },
  btnAd: { backgroundColor: '#f57c00' },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  closeBtn: { marginTop: 4 },
  closeBtnText: { color: '#888', fontSize: 13 },
});
