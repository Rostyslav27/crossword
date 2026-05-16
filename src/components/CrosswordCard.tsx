import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { ICrossword } from '../types/crossword';
import { IUserCrosswordState } from '../types/userCrossword';
import { useCrosswordStore } from '../store/useCrosswordStore';

interface CrosswordCardProps {
  crossword: ICrossword;
  userState: IUserCrosswordState;
  onPress: () => void;
}

/** Calculate fill percentage (0-100). */
function calcProgress(crossword: ICrossword, answers: Record<string, string>): number {
  let total = 0;
  let filled = 0;
  for (let r = 0; r < crossword.grid.length; r++) {
    for (let c = 0; c < crossword.grid[r].length; c++) {
      if (crossword.grid[r][c] !== '') {
        total++;
        if (answers[`${r}_${c}`]) filled++;
      }
    }
  }
  return total === 0 ? 0 : Math.round((filled / total) * 100);
}

/** Mini grid preview (max 5×5 cells). */
function GridPreview({ grid }: { grid: string[][] }) {
  const maxRows = Math.min(grid.length, 5);
  const maxCols = grid[0] ? Math.min(grid[0].length, 9) : 0;
  return (
    <View style={previewStyles.container}>
      {grid.slice(0, maxRows).map((row, r) => (
        <View key={r} style={previewStyles.row}>
          {row.slice(0, maxCols).map((cell, c) => (
            <View
              key={c}
              style={[previewStyles.cell, cell === '' && previewStyles.blocked]}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

const previewStyles = StyleSheet.create({
  container: { flexDirection: 'column', gap: 1 },
  row: { flexDirection: 'row', gap: 1 },
  cell: { width: 6, height: 6, backgroundColor: '#e8eaf6', borderRadius: 1 },
  blocked: { backgroundColor: '#1a237e' },
});

export default function CrosswordCard({ crossword, userState, onPress }: CrosswordCardProps) {
  const { toggleLike, hideCrossword, toggleCollection, markDone } = useCrosswordStore();
  const [menuVisible, setMenuVisible] = useState(false);
  const progress = calcProgress(crossword, userState.answers);

  function handleMenu() {
    setMenuVisible(false);
    Alert.alert(crossword.name, 'Виберіть дію', [
      {
        text: userState.inCollection ? 'Видалити з колекції' : 'Додати в колекцію',
        onPress: () => toggleCollection(crossword.id),
      },
      {
        text: 'Позначити як виконаний',
        onPress: () => markDone(crossword.id),
      },
      {
        text: 'Прибрати зі списку',
        style: 'destructive',
        onPress: () => hideCrossword(crossword.id),
      },
      { text: 'Скасувати', style: 'cancel' },
    ]);
  }

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.left}>
        <GridPreview grid={crossword.grid} />
      </View>
      <View style={styles.middle}>
        <Text style={styles.title}>{crossword.name}</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` as any }]} />
        </View>
        <Text style={styles.progressText}>
          {userState.completed ? '✅ Виконано' : userState.markedDone ? '☑ Позначено' : `${progress}%`}
        </Text>
      </View>
      <View style={styles.right}>
        <TouchableOpacity onPress={() => toggleLike(crossword.id)} style={styles.likeBtn}>
          <Text style={styles.likeIcon}>{userState.liked ? '❤️' : '🤍'}</Text>
          <Text style={styles.likeCount}>{crossword.likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleMenu} style={styles.menuBtn}>
          <Text style={styles.menuIcon}>⋮</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    gap: 12,
  },
  left: { width: 60 },
  middle: { flex: 1 },
  right: { alignItems: 'center', gap: 8 },
  title: { fontSize: 15, fontWeight: '600', color: '#1a237e', marginBottom: 4 },
  progressBar: {
    height: 4,
    backgroundColor: '#e8eaf6',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: { height: 4, backgroundColor: '#3f51b5', borderRadius: 2 },
  progressText: { fontSize: 11, color: '#888' },
  likeBtn: { alignItems: 'center' },
  likeIcon: { fontSize: 18 },
  likeCount: { fontSize: 11, color: '#888' },
  menuBtn: { padding: 4 },
  menuIcon: { fontSize: 22, color: '#555' },
});
