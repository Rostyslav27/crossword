import React, { useCallback } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';
import { IWord } from '../types/crossword';

interface CrosswordGridProps {
  grid: string[][];
  /** User-entered answers per cell key "row_col". */
  answers: Record<string, string>;
  /** Cells revealed by hints. */
  revealedCells: string[];
  /** Currently selected word. */
  activeWord: IWord | null;
  /** Currently focused cell key. */
  focusedCell: string | null;
  onCellPress: (row: number, col: number) => void;
}

const CELL_SIZE = 34;
const CELL_MARGIN = 1;

export default function CrosswordGrid({
  grid,
  answers,
  revealedCells,
  activeWord,
  focusedCell,
  onCellPress,
}: CrosswordGridProps) {
  /** Returns all cell keys belonging to the active word. */
  const activeWordCells = useCallback((): Set<string> => {
    if (!activeWord) return new Set();
    const keys = new Set<string>();
    const answer = activeWord.answer;
    for (let i = 0; i < answer.length; i++) {
      const r = activeWord.vertical ? activeWord.row + i : activeWord.row;
      const c = activeWord.vertical ? activeWord.col : activeWord.col + i;
      keys.add(`${r}_${c}`);
    }
    return keys;
  }, [activeWord]);

  const activeCells = activeWordCells();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.gridContainer}>
          {grid.map((row, r) => (
            <View key={r} style={styles.row}>
              {row.map((cell, c) => {
                if (cell === '') {
                  return <View key={c} style={styles.blocked} />;
                }
                const key = `${r}_${c}`;
                const isFocused = focusedCell === key;
                const isActive = activeCells.has(key);
                const isRevealed = revealedCells.includes(key);
                const userLetter = answers[key] ?? '';
                const isCorrect = userLetter.toUpperCase() === cell.toUpperCase();

                return (
                  <TouchableOpacity
                    key={c}
                    style={[
                      styles.cell,
                      isActive && styles.cellActive,
                      isFocused && styles.cellFocused,
                      isRevealed && styles.cellRevealed,
                    ]}
                    onPress={() => onCellPress(r, c)}
                    activeOpacity={0.7}
                  >
                    {userLetter !== '' && (
                      <Text
                        style={[
                          styles.cellText,
                          isCorrect && styles.cellTextCorrect,
                          isRevealed && styles.cellTextRevealed,
                        ]}
                      >
                        {userLetter.toUpperCase()}
                      </Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  gridContainer: {
    padding: 8,
    gap: CELL_MARGIN,
  },
  row: {
    flexDirection: 'row',
    gap: CELL_MARGIN,
    marginBottom: CELL_MARGIN,
  },
  blocked: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    backgroundColor: '#1a237e',
    borderRadius: 2,
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    backgroundColor: '#e8eaf6',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#c5cae9',
  },
  cellActive: {
    backgroundColor: '#c5cae9',
    borderColor: '#3f51b5',
  },
  cellFocused: {
    backgroundColor: '#7986cb',
    borderColor: '#3f51b5',
  },
  cellRevealed: {
    backgroundColor: '#fff9c4',
    borderColor: '#f9a825',
  },
  cellText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a237e',
  },
  cellTextCorrect: {
    color: '#2e7d32',
  },
  cellTextRevealed: {
    color: '#e65100',
  },
});
