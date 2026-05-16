import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation';
import { useCrosswordStore } from '../store/useCrosswordStore';
import { IWord } from '../types/crossword';
import { IUserCrosswordState } from '../types/userCrossword';
import { cellKey } from '../types/userCrossword';
import CrosswordGrid from '../components/CrosswordGrid';
import CrosswordClue from '../components/CrosswordClue';
import Keyboard from '../components/Keyboard';
import HintModal from '../components/HintModal';

type NavProp = StackNavigationProp<RootStackParamList, 'Crossword'>;
type RoutePropType = RouteProp<RootStackParamList, 'Crossword'>;

interface Props {
  navigation: NavProp;
  route: RoutePropType;
}

/** Find which words cover a given cell. Returns them in order: prefer same direction. */
function wordsAtCell(words: IWord[], row: number, col: number): IWord[] {
  return words.filter((w) => {
    const len = w.answer.length;
    if (w.vertical) {
      return col === w.col && row >= w.row && row < w.row + len;
    } else {
      return row === w.row && col >= w.col && col < w.col + len;
    }
  });
}

/** Check if all words are correctly filled by the user. */
function isCompleted(words: IWord[], answers: Record<string, string>): boolean {
  for (const w of words) {
    for (let i = 0; i < w.answer.length; i++) {
      const r = w.vertical ? w.row + i : w.row;
      const c = w.vertical ? w.col : w.col + i;
      if ((answers[cellKey(r, c)] ?? '').toUpperCase() !== w.answer[i].toUpperCase()) {
        return false;
      }
    }
  }
  return true;
}

export default function CrosswordScreen({ navigation, route }: Props) {
  const { crosswordId } = route.params;
  const { crosswords, userStates, loadUserState, saveUserState } = useCrosswordStore();
  const crossword = crosswords.find((c) => c.id === crosswordId);

  const [state, setState] = useState<IUserCrosswordState | null>(null);
  const [activeWord, setActiveWord] = useState<IWord | null>(null);
  const [focusedCell, setFocusedCell] = useState<string | null>(null);
  const [hintModal, setHintModal] = useState(false);
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    (async () => {
      const loaded = await loadUserState(crosswordId);
      setState(loaded);
    })();
  }, [crosswordId]);

  // Debounced save to avoid too many AsyncStorage writes.
  function scheduleSave(s: IUserCrosswordState) {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => saveUserState(s), 500);
  }

  const handleCellPress = useCallback(
    (row: number, col: number) => {
      if (!crossword) return;
      const key = cellKey(row, col);
      const atCell = wordsAtCell(crossword.words, row, col);
      if (atCell.length === 0) return;

      if (focusedCell === key && atCell.length > 1) {
        // Cycle direction when tapping focused cell.
        const currentIdx = activeWord ? atCell.indexOf(activeWord) : -1;
        setActiveWord(atCell[(currentIdx + 1) % atCell.length]);
      } else {
        setFocusedCell(key);
        // Prefer same direction as current active word if available.
        const sameDirWord =
          activeWord ? atCell.find((w) => w.vertical === activeWord.vertical) : null;
        setActiveWord(sameDirWord ?? atCell[0]);
      }
    },
    [crossword, focusedCell, activeWord]
  );

  function handleKey(letter: string) {
    if (!state || !focusedCell || !activeWord) return;
    const newAnswers = { ...state.answers, [focusedCell]: letter };
    const completed = isCompleted(crossword!.words, newAnswers);
    const newState: IUserCrosswordState = { ...state, answers: newAnswers, completed };

    if (completed && !state.completed) {
      Alert.alert('🎉 Вітаємо!', 'Ви успішно розгадали кросворд!');
    }

    setState(newState);
    scheduleSave(newState);
    advanceFocus(letter);
  }

  function handleDelete() {
    if (!state || !focusedCell) return;
    const newAnswers = { ...state.answers };
    if (newAnswers[focusedCell]) {
      delete newAnswers[focusedCell];
    } else {
      retreatFocus();
      return;
    }
    const newState = { ...state, answers: newAnswers };
    setState(newState);
    scheduleSave(newState);
  }

  /** Move focus to the next cell in the active word. */
  function advanceFocus(letter: string) {
    if (!activeWord || !focusedCell) return;
    const [fr, fc] = focusedCell.split('_').map(Number);
    const nextR = activeWord.vertical ? fr + 1 : fr;
    const nextC = activeWord.vertical ? fc : fc + 1;
    const maxR = activeWord.vertical
      ? activeWord.row + activeWord.answer.length - 1
      : activeWord.row;
    const maxC = activeWord.vertical
      ? activeWord.col
      : activeWord.col + activeWord.answer.length - 1;
    if (nextR <= maxR && nextC <= maxC) {
      setFocusedCell(cellKey(nextR, nextC));
    }
  }

  /** Move focus to the previous cell in the active word. */
  function retreatFocus() {
    if (!activeWord || !focusedCell) return;
    const [fr, fc] = focusedCell.split('_').map(Number);
    const prevR = activeWord.vertical ? fr - 1 : fr;
    const prevC = activeWord.vertical ? fc : fc - 1;
    if (
      prevR >= activeWord.row &&
      prevC >= activeWord.col
    ) {
      setFocusedCell(cellKey(prevR, prevC));
    }
  }

  function handleHintEarned() {
    if (!state || !focusedCell || !crossword) return;
    setHintModal(false);
    const [r, c] = focusedCell.split('_').map(Number);
    const answerLetter = crossword.grid[r]?.[c] ?? '';
    if (!answerLetter) return;

    const newRevealed = state.revealedCells.includes(focusedCell)
      ? state.revealedCells
      : [...state.revealedCells, focusedCell];
    const newAnswers = { ...state.answers, [focusedCell]: answerLetter };
    const completed = isCompleted(crossword.words, newAnswers);
    const newState = { ...state, answers: newAnswers, revealedCells: newRevealed, completed };
    setState(newState);
    saveUserState(newState);
    advanceFocus(answerLetter);
  }

  if (!crossword || !state) {
    return <ActivityIndicator style={styles.loader} size="large" color="#3f51b5" />;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <Text style={styles.cwName}>{crossword.name}</Text>
        <TouchableOpacity
          style={styles.hintBtn}
          onPress={() => {
            if (!focusedCell) {
              Alert.alert('Оберіть клітинку', 'Натисніть на клітинку, щоб отримати підказку.');
              return;
            }
            setHintModal(true);
          }}
        >
          <Text style={styles.hintBtnText}>💡 Підказка</Text>
        </TouchableOpacity>
      </View>

      {/* Crossword grid */}
      <View style={styles.gridWrapper}>
        <CrosswordGrid
          grid={state.completed
            ? crossword.grid.map((row) => row.slice()) // show answers if completed
            : crossword.grid}
          answers={state.completed
            ? Object.fromEntries(
                crossword.grid.flatMap((row, r) =>
                  row.map((cell, c) => (cell ? [cellKey(r, c), cell] : null)).filter(Boolean) as [string, string][]
                )
              )
            : state.answers}
          revealedCells={state.revealedCells}
          activeWord={activeWord}
          focusedCell={focusedCell}
          onCellPress={handleCellPress}
        />
      </View>

      {/* Clue */}
      <CrosswordClue word={activeWord} />

      {/* Keyboard */}
      {!state.completed && <Keyboard onKey={handleKey} onDelete={handleDelete} />}

      {state.completed && (
        <View style={styles.completedBanner}>
          <Text style={styles.completedText}>✅ Кросворд розгадано!</Text>
        </View>
      )}

      {/* Hint modal */}
      <HintModal
        visible={hintModal}
        onClose={() => setHintModal(false)}
        onHintEarned={handleHintEarned}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f8' },
  loader: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#1a237e',
  },
  cwName: { color: '#fff', fontSize: 16, fontWeight: '600' },
  hintBtn: {
    backgroundColor: '#f57c00',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  hintBtnText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  gridWrapper: { flex: 1 },
  completedBanner: {
    backgroundColor: '#e8f5e9',
    paddingVertical: 14,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#c8e6c9',
  },
  completedText: { color: '#2e7d32', fontWeight: '700', fontSize: 16 },
});
