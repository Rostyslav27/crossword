export interface IEnergyState {
  /** Current energy amount. Unbounded maximum. */
  amount: number;
  /**
   * Unix ms timestamp when auto-refill started (i.e. when energy dropped to 0).
   * null if amount > 0 (no active refill timer).
   */
  lastAutoRefillTimestamp: number | null;
}
