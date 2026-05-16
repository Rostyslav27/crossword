export interface IUserCrosswordState {
  crosswordId: string;
  /** Map from "row_col" key to letter entered by the user. */
  answers: Record<string, string>;
  /** List of "row_col" keys whose cells were revealed via hint (ad). */
  revealedCells: string[];
  /** True when all words are correctly filled. Persisted forever. */
  completed: boolean;
  /** User liked this crossword. */
  liked: boolean;
  /** User added this crossword to their personal collection. */
  inCollection: boolean;
  /** User dismissed/hid this crossword from the main list. */
  hidden: boolean;
  /** User manually marked as done (does NOT reveal answers). */
  markedDone: boolean;
}

export function makeDefaultUserCrosswordState(crosswordId: string): IUserCrosswordState {
  return {
    crosswordId,
    answers: {},
    revealedCells: [],
    completed: false,
    liked: false,
    inCollection: false,
    hidden: false,
    markedDone: false,
  };
}

/** "row_col" helper */
export function cellKey(row: number, col: number): string {
  return `${row}_${col}`;
}
