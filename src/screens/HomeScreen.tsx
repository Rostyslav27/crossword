import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation';
import { useCrosswordStore } from '../store/useCrosswordStore';
import { useUserStore } from '../store/useUserStore';
import { ICrossword } from '../types/crossword';
import { IUserCrosswordState, makeDefaultUserCrosswordState } from '../types/userCrossword';
import CrosswordCard from '../components/CrosswordCard';
import EnergyBar from '../components/EnergyBar';
import EnergyModal from '../components/EnergyModal';

type HomeNavProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeNavProp;
}

type Tab = 'all' | 'collection';

export default function HomeScreen({ navigation }: Props) {
  const { crosswords, userStates, isLoaded, loadUserState } = useCrosswordStore();
  const { init: initUser } = useUserStore();
  const [tab, setTab] = useState<Tab>('all');
  const [energyModal, setEnergyModal] = useState<{ crosswordId: string } | null>(null);

  useEffect(() => {
    initUser();
  }, []);

  // Load user states for visible crosswords.
  useEffect(() => {
    for (const cw of crosswords) {
      if (!userStates[cw.id]) loadUserState(cw.id);
    }
  }, [crosswords]);

  function getState(id: string): IUserCrosswordState {
    return userStates[id] ?? makeDefaultUserCrosswordState(id);
  }

  const visible = crosswords.filter((cw) => {
    const s = getState(cw.id);
    if (s.hidden) return false;
    if (tab === 'collection') return s.inCollection;
    return true;
  });

  function handleCardPress(cw: ICrossword) {
    const s = getState(cw.id);
    const hasProgress =
      Object.keys(s.answers).length > 0 || s.completed || s.markedDone;
    if (hasProgress) {
      navigation.navigate('Crossword', { crosswordId: cw.id });
    } else {
      setEnergyModal({ crosswordId: cw.id });
    }
  }

  function handleEnergyGained() {
    if (energyModal) {
      setEnergyModal(null);
      navigation.navigate('Crossword', { crosswordId: energyModal.crosswordId });
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header row */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Кросворди</Text>
        <EnergyBar onShopPress={() => navigation.navigate('Shop')} />
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, tab === 'all' && styles.tabActive]}
          onPress={() => setTab('all')}
        >
          <Text style={[styles.tabText, tab === 'all' && styles.tabTextActive]}>Всі</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === 'collection' && styles.tabActive]}
          onPress={() => setTab('collection')}
        >
          <Text style={[styles.tabText, tab === 'collection' && styles.tabTextActive]}>
            Колекція
          </Text>
        </TouchableOpacity>
      </View>

      {!isLoaded ? (
        <ActivityIndicator style={styles.loader} size="large" color="#3f51b5" />
      ) : (
        <FlatList
          data={visible}
          keyExtractor={(c) => c.id}
          renderItem={({ item }) => (
            <CrosswordCard
              crossword={item}
              userState={getState(item.id)}
              onPress={() => handleCardPress(item)}
            />
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>
              {tab === 'collection'
                ? 'Колекція порожня. Додайте кросворди зі списку «Всі».'
                : 'Немає кросвордів.'}
            </Text>
          }
          contentContainerStyle={styles.list}
        />
      )}

      {/* Energy modal */}
      <EnergyModal
        visible={energyModal !== null}
        onClose={() => setEnergyModal(null)}
        onEnergyGained={handleEnergyGained}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f8' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#1a237e',
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e8eaf6',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#3f51b5',
  },
  tabText: { fontSize: 14, color: '#888' },
  tabTextActive: { color: '#3f51b5', fontWeight: '600' },
  list: { paddingVertical: 8 },
  loader: { marginTop: 60 },
  empty: {
    textAlign: 'center',
    marginTop: 60,
    color: '#aaa',
    fontSize: 14,
    paddingHorizontal: 32,
    lineHeight: 22,
  },
});
