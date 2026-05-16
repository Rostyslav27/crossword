/**
 * Storage service – thin wrapper around AsyncStorage.
 * Designed so it can later be swapped to Firebase Firestore
 * when authentication is introduced.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ICrossword } from '../types/crossword';
import { IEnergyState } from '../types/user';
import { IUserCrosswordState, makeDefaultUserCrosswordState } from '../types/userCrossword';

const KEYS = {
  CROSSWORD_LIST: '@crossword:list',
  ENERGY: '@crossword:energy',
  USER_CW_PREFIX: '@crossword:uc:',
  LAST_SYNC_DATE: '@crossword:lastSyncDate',
  LAST_SYNC_TS: '@crossword:lastSyncTs',
};

// ---------------------------------------------------------------------------
// Crossword list
// ---------------------------------------------------------------------------
export async function getCrosswordList(): Promise<ICrossword[]> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.CROSSWORD_LIST);
    if (!raw) return [];
    return JSON.parse(raw) as ICrossword[];
  } catch {
    return [];
  }
}

export async function setCrosswordList(list: ICrossword[]): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.CROSSWORD_LIST, JSON.stringify(list));
  } catch {
    // ignore write errors
  }
}

// ---------------------------------------------------------------------------
// Energy state
// ---------------------------------------------------------------------------
const DEFAULT_ENERGY: IEnergyState = { amount: 3, lastAutoRefillTimestamp: null };

export async function getEnergyState(): Promise<IEnergyState> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.ENERGY);
    if (!raw) return DEFAULT_ENERGY;
    return JSON.parse(raw) as IEnergyState;
  } catch {
    return DEFAULT_ENERGY;
  }
}

export async function setEnergyState(state: IEnergyState): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.ENERGY, JSON.stringify(state));
  } catch {
    // ignore write errors
  }
}

// ---------------------------------------------------------------------------
// Per-crossword user state
// ---------------------------------------------------------------------------
export async function getUserCrosswordState(crosswordId: string): Promise<IUserCrosswordState> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.USER_CW_PREFIX + crosswordId);
    if (!raw) return makeDefaultUserCrosswordState(crosswordId);
    return JSON.parse(raw) as IUserCrosswordState;
  } catch {
    return makeDefaultUserCrosswordState(crosswordId);
  }
}

export async function setUserCrosswordState(state: IUserCrosswordState): Promise<void> {
  try {
    await AsyncStorage.setItem(
      KEYS.USER_CW_PREFIX + state.crosswordId,
      JSON.stringify(state)
    );
  } catch {
    // ignore write errors
  }
}

// ---------------------------------------------------------------------------
// Sync metadata
// ---------------------------------------------------------------------------
export async function getLastSyncDate(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(KEYS.LAST_SYNC_DATE);
  } catch {
    return null;
  }
}

export async function setLastSyncDate(date: string): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.LAST_SYNC_DATE, date);
  } catch {
    // ignore
  }
}

export async function getLastSyncTimestamp(): Promise<number> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.LAST_SYNC_TS);
    return raw ? parseInt(raw, 10) : 0;
  } catch {
    return 0;
  }
}

export async function setLastSyncTimestamp(ts: number): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.LAST_SYNC_TS, String(ts));
  } catch {
    // ignore
  }
}
