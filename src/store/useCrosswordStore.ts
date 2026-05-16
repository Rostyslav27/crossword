/**
 * Crossword store – manages the crossword list and per-crossword user state.
 */
import { create } from 'zustand';
import { ICrossword } from '../types/crossword';
import { IUserCrosswordState } from '../types/userCrossword';
import { EMBEDDED_CROSSWORDS } from '../data/embedded';
import {
  getCrosswordList,
  setCrosswordList,
  getUserCrosswordState,
  setUserCrosswordState,
} from '../services/storage';
import { maybeSyncCrosswords } from '../services/crosswordSync';
import { incrementLikeOnServer } from '../services/firebase';

interface CrosswordStore {
  crosswords: ICrossword[];
  /** Loaded per-crossword user states, keyed by crossword id. */
  userStates: Record<string, IUserCrosswordState>;
  isLoaded: boolean;

  /** Call once on app mount. */
  init(): Promise<void>;

  /** Load user state for a specific crossword into the store. */
  loadUserState(crosswordId: string): Promise<IUserCrosswordState>;

  /** Persist and update user state in the store. */
  saveUserState(state: IUserCrosswordState): Promise<void>;

  /** Toggle like. Syncs to Firebase on first like. */
  toggleLike(crosswordId: string): Promise<void>;

  /** Hide crossword from main list. */
  hideCrossword(crosswordId: string): Promise<void>;

  /** Toggle collection membership. */
  toggleCollection(crosswordId: string): Promise<void>;

  /** Mark crossword as manually done (does NOT reveal answers). */
  markDone(crosswordId: string): Promise<void>;
}

export const useCrosswordStore = create<CrosswordStore>((set, get) => ({
  crosswords: [],
  userStates: {},
  isLoaded: false,

  async init() {
    // Run daily Firebase sync in background (no await – don't block UI).
    maybeSyncCrosswords()
      .then(() => getCrosswordList())
      .then(async (synced) => {
        // Merge embedded + synced, keeping embedded order first.
        const embeddedIds = new Set(EMBEDDED_CROSSWORDS.map((c) => c.id));
        const extra = synced.filter((c) => !embeddedIds.has(c.id));
        const merged = [...EMBEDDED_CROSSWORDS, ...extra];
        await setCrosswordList(merged);
        set({ crosswords: merged });
      })
      .catch(() => {});

    // Immediately show embedded crosswords while sync happens.
    const stored = await getCrosswordList();
    const embeddedIds = new Set(EMBEDDED_CROSSWORDS.map((c) => c.id));
    const extra = stored.filter((c) => !embeddedIds.has(c.id));
    const initial = [...EMBEDDED_CROSSWORDS, ...extra];
    set({ crosswords: initial, isLoaded: true });
  },

  async loadUserState(crosswordId) {
    const existing = get().userStates[crosswordId];
    if (existing) return existing;
    const state = await getUserCrosswordState(crosswordId);
    set((s) => ({ userStates: { ...s.userStates, [crosswordId]: state } }));
    return state;
  },

  async saveUserState(state) {
    await setUserCrosswordState(state);
    set((s) => ({ userStates: { ...s.userStates, [state.crosswordId]: state } }));
  },

  async toggleLike(crosswordId) {
    const prev = await get().loadUserState(crosswordId);
    const nowLiked = !prev.liked;
    const updated = { ...prev, liked: nowLiked };
    await get().saveUserState(updated);

    // Update local like count.
    set((s) => ({
      crosswords: s.crosswords.map((c) =>
        c.id === crosswordId
          ? { ...c, likes: c.likes + (nowLiked ? 1 : -1) }
          : c
      ),
    }));

    // Sync to server only when adding first like.
    if (nowLiked) {
      incrementLikeOnServer(crosswordId).catch(() => {});
    }
  },

  async hideCrossword(crosswordId) {
    const prev = await get().loadUserState(crosswordId);
    await get().saveUserState({ ...prev, hidden: true });
  },

  async toggleCollection(crosswordId) {
    const prev = await get().loadUserState(crosswordId);
    await get().saveUserState({ ...prev, inCollection: !prev.inCollection });
  },

  async markDone(crosswordId) {
    const prev = await get().loadUserState(crosswordId);
    await get().saveUserState({ ...prev, markedDone: true });
  },
}));
