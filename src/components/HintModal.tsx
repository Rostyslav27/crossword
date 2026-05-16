import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { showRewardedAd } from '../services/ads';

interface HintModalProps {
  visible: boolean;
  onClose: () => void;
  /** Called when reward is earned – caller should reveal the current cell. */
  onHintEarned: () => void;
}

export default function HintModal({ visible, onClose, onHintEarned }: HintModalProps) {
  const [loading, setLoading] = useState(false);

  async function handleWatchAd() {
    setLoading(true);
    try {
      const result = await showRewardedAd();
      if (result === 'rewarded') {
        onHintEarned();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>💡 Підказка</Text>
          <Text style={styles.body}>
            Перегляньте коротку рекламу, щоб відкрити поточну клітинку.
          </Text>

          <TouchableOpacity
            style={styles.btn}
            onPress={handleWatchAd}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>📺 Переглянути рекламу</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.closeBtn} onPress={onClose} disabled={loading}>
            <Text style={styles.closeBtnText}>Скасувати</Text>
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
    width: '80%',
    gap: 14,
    alignItems: 'center',
  },
  title: { fontSize: 18, fontWeight: 'bold', color: '#1a237e' },
  body: { fontSize: 14, color: '#555', textAlign: 'center', lineHeight: 20 },
  btn: {
    backgroundColor: '#f57c00',
    width: '100%',
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  closeBtn: { marginTop: 4 },
  closeBtnText: { color: '#888', fontSize: 13 },
});
