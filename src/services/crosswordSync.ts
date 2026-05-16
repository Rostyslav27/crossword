/**
 * Daily sync service.
 * Reads from Firebase at most once per calendar day, merges new crosswords
 * into local storage and never throws errors to the caller.
 */
import { computeGrid } from '../types/crossword';
import { fetchNewCrosswords } from './firebase';
import {
  getCrosswordList,
  setCrosswordList,
  getLastSyncDate,
  setLastSyncDate,
  getLastSyncTimestamp,
  setLastSyncTimestamp,
} from './storage';

function todayDateString(): string {
  return new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
}

/**
 * Call this once on app launch.
 * If the last sync was on a previous calendar day, fetches new crosswords.
 * Otherwise does nothing (no reads consumed).
 */
export async function maybeSyncCrosswords(): Promise<void> {
  try {
    const today = todayDateString();
    const lastSync = await getLastSyncDate();
    if (lastSync === today) return; // already synced today

    const lastTs = await getLastSyncTimestamp();
    const newCrosswords = await fetchNewCrosswords(lastTs);

    if (newCrosswords.length > 0) {
      const existing = await getCrosswordList();
      const existingIds = new Set(existing.map((c) => c.id));

      let latestTs = lastTs;
      const toAdd = newCrosswords
        .filter((c) => !existingIds.has(c.id))
        .map((c) => {
          // Recompute grid from words in case it wasn't stored.
          if (!c.grid || c.grid.length === 0) {
            c.grid = computeGrid(c.words);
          }
          if (c.createdAt > latestTs) latestTs = c.createdAt;
          return c;
        });

      if (toAdd.length > 0) {
        await setCrosswordList([...existing, ...toAdd]);
        await setLastSyncTimestamp(latestTs);
      }
    }

    await setLastSyncDate(today);
  } catch {
    // Any error – silently continue offline.
  }
}
