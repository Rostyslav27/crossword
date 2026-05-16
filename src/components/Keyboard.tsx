import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const UA_ROWS = [
  ['Й', 'Ц', 'У', 'К', 'Е', 'Н', 'Г', 'Ш', 'Щ', 'З'],
  ['Х', 'Ф', 'І', 'В', 'А', 'П', 'Р', 'О', 'Л', 'Д'],
  ['Ж', 'Є', 'Я', 'Ч', 'С', 'М', 'И', 'Т', 'Ь', 'Б'],
  ['Ю', 'Ї', 'Ґ', '⌫'],
];

interface KeyboardProps {
  onKey: (key: string) => void;
  onDelete: () => void;
}

export default function Keyboard({ onKey, onDelete }: KeyboardProps) {
  return (
    <View style={styles.container}>
      {UA_ROWS.map((row, ri) => (
        <View key={ri} style={styles.row}>
          {row.map((key) => {
            if (key === '⌫') {
              return (
                <TouchableOpacity
                  key={key}
                  style={[styles.key, styles.deleteKey]}
                  onPress={onDelete}
                  activeOpacity={0.7}
                >
                  <Text style={styles.deleteText}>{key}</Text>
                </TouchableOpacity>
              );
            }
            return (
              <TouchableOpacity
                key={key}
                style={styles.key}
                onPress={() => onKey(key)}
                activeOpacity={0.7}
              >
                <Text style={styles.keyText}>{key}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e8eaf6',
    paddingVertical: 6,
    paddingHorizontal: 4,
    gap: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  key: {
    minWidth: 30,
    height: 38,
    backgroundColor: '#fff',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  keyText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1a237e',
  },
  deleteKey: {
    minWidth: 46,
    backgroundColor: '#ef9a9a',
  },
  deleteText: {
    fontSize: 18,
    color: '#b71c1c',
  },
});
