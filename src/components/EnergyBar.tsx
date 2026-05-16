import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useUserStore } from '../store/useUserStore';
import { formatRefillTime } from '../services/energy';

interface EnergyBarProps {
  onShopPress: () => void;
}

export default function EnergyBar({ onShopPress }: EnergyBarProps) {
  const { energy, refillRemainingMs } = useUserStore();

  return (
    <TouchableOpacity style={styles.container} onPress={onShopPress} activeOpacity={0.8}>
      <Text style={styles.icon}>⚡</Text>
      <Text style={styles.amount}>{energy.amount}</Text>
      {refillRemainingMs !== null && refillRemainingMs > 0 && (
        <Text style={styles.timer}>+1 за {formatRefillTime(refillRemainingMs)}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffeb3b',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  icon: {
    fontSize: 16,
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  timer: {
    fontSize: 11,
    color: '#555',
    marginLeft: 4,
  },
});
