import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IWord } from '../types/crossword';

interface CrosswordClueProps {
  word: IWord | null;
}

export default function CrosswordClue({ word }: CrosswordClueProps) {
  if (!word) {
    return (
      <View style={styles.container}>
        <Text style={styles.placeholder}>Оберіть клітинку для введення</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.index}>
        {word.index} {word.vertical ? '↓' : '→'}
      </Text>
      <Text style={styles.question} numberOfLines={3}>
        {word.question}
      </Text>
      {word.clue ? (
        <Text style={styles.clue}>Підказка: {word.clue}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#e8eaf6',
    minHeight: 60,
  },
  placeholder: {
    color: '#aaa',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 8,
  },
  index: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3f51b5',
    marginBottom: 2,
  },
  question: {
    fontSize: 13,
    color: '#333',
    lineHeight: 18,
  },
  clue: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
    fontStyle: 'italic',
  },
});
