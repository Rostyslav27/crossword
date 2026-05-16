/**
 * Energy service.
 *
 * Rules:
 *  - Auto-refill: 1 energy added after 2 hours when amount === 0.
 *  - Auto-refill timer starts the moment energy drops to 0.
 *  - If amount > 0, no auto-refill (but a pending timer is cleared).
 *  - Maximum for auto-refill is 1, but total amount is unbounded.
 *  - Sources: watch ad (+1), buy 50 for $0.99, buy 200 for $2.49.
 */
import { IEnergyState } from '../types/user';
import { getEnergyState, setEnergyState } from './storage';

export const REFILL_INTERVAL_MS = 2 * 60 * 60 * 1000; // 2 hours
export const IAP_PRODUCTS = {
  energy50: 'energy_50',   // $0.99
  energy200: 'energy_200', // $2.49
};

/**
 * Read the current energy state, apply any pending auto-refill, and return it.
 * Call this on app launch and every 30 seconds via a timer.
 */
export async function refreshEnergyState(): Promise<IEnergyState> {
  let state = await getEnergyState();
  state = applyAutoRefill(state);
  await setEnergyState(state);
  return state;
}

/** Pure function – applies auto-refill logic without side effects. */
export function applyAutoRefill(state: IEnergyState): IEnergyState {
  const { amount, lastAutoRefillTimestamp } = state;

  if (amount === 0 && lastAutoRefillTimestamp !== null) {
    const elapsed = Date.now() - lastAutoRefillTimestamp;
    if (elapsed >= REFILL_INTERVAL_MS) {
      // Refill 1 energy and clear timer.
      return { amount: 1, lastAutoRefillTimestamp: null };
    }
  }

  // If amount > 0, ensure no timer is running.
  if (amount > 0 && lastAutoRefillTimestamp !== null) {
    return { ...state, lastAutoRefillTimestamp: null };
  }

  return state;
}

/**
 * Spend 1 energy to open a crossword.
 * Returns the new state. If amount is already 0, returns false.
 */
export async function spendEnergy(): Promise<IEnergyState | false> {
  let state = await refreshEnergyState();
  if (state.amount <= 0) return false;

  state = {
    amount: state.amount - 1,
    lastAutoRefillTimestamp: state.amount - 1 === 0 ? Date.now() : null,
  };
  await setEnergyState(state);
  return state;
}

/** Add energy (from ad reward or purchase). */
export async function addEnergy(amount: number): Promise<IEnergyState> {
  let state = await getEnergyState();
  state = {
    amount: state.amount + amount,
    lastAutoRefillTimestamp: null, // clear timer since amount > 0
  };
  await setEnergyState(state);
  return state;
}

/** Returns remaining ms until auto-refill completes, or null if not active. */
export function getRefillRemainingMs(state: IEnergyState): number | null {
  if (state.amount > 0 || state.lastAutoRefillTimestamp === null) return null;
  const remaining = REFILL_INTERVAL_MS - (Date.now() - state.lastAutoRefillTimestamp);
  return Math.max(0, remaining);
}

/** Format ms as "H:MM:SS". */
export function formatRefillTime(ms: number): string {
  const totalSec = Math.ceil(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
