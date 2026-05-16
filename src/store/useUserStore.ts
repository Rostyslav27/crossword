/**
 * User store – manages energy state with auto-refill polling.
 */
import { create } from 'zustand';
import { IEnergyState } from '../types/user';
import {
  refreshEnergyState,
  spendEnergy,
  addEnergy,
  getRefillRemainingMs,
  formatRefillTime,
} from '../services/energy';

interface UserStore {
  energy: IEnergyState;
  refillRemainingMs: number | null;
  refillLabel: string;
  isLoaded: boolean;

  /** Call once on mount – loads energy and starts 30-second polling. */
  init(): Promise<void>;
  /** Spend 1 energy. Returns false if insufficient. */
  spend(): Promise<boolean>;
  /** Add energy (ad reward or purchase). */
  gain(amount: number): Promise<void>;
  /** Tick – recalculate refill timer without storage read. */
  tick(): void;
}

let _pollTimer: ReturnType<typeof setInterval> | null = null;

export const useUserStore = create<UserStore>((set, get) => ({
  energy: { amount: 0, lastAutoRefillTimestamp: null },
  refillRemainingMs: null,
  refillLabel: '',
  isLoaded: false,

  async init() {
    const energy = await refreshEnergyState();
    const refillRemainingMs = getRefillRemainingMs(energy);
    set({
      energy,
      refillRemainingMs,
      refillLabel: refillRemainingMs !== null ? formatRefillTime(refillRemainingMs) : '',
      isLoaded: true,
    });

    if (_pollTimer) clearInterval(_pollTimer);
    _pollTimer = setInterval(async () => {
      const updated = await refreshEnergyState();
      const remaining = getRefillRemainingMs(updated);
      set({
        energy: updated,
        refillRemainingMs: remaining,
        refillLabel: remaining !== null ? formatRefillTime(remaining) : '',
      });
    }, 30_000);
  },

  tick() {
    const { energy } = get();
    const remaining = getRefillRemainingMs(energy);
    set({
      refillRemainingMs: remaining,
      refillLabel: remaining !== null ? formatRefillTime(remaining) : '',
    });
  },

  async spend() {
    const result = await spendEnergy();
    if (!result) return false;
    const remaining = getRefillRemainingMs(result);
    set({
      energy: result,
      refillRemainingMs: remaining,
      refillLabel: remaining !== null ? formatRefillTime(remaining) : '',
    });
    return true;
  },

  async gain(amount: number) {
    const updated = await addEnergy(amount);
    const remaining = getRefillRemainingMs(updated);
    set({
      energy: updated,
      refillRemainingMs: remaining,
      refillLabel: remaining !== null ? formatRefillTime(remaining) : '',
    });
  },
}));
