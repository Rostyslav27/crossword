export interface IWord {
  index: string;
  question: string;
  answer: string; // uppercase letters, e.g. "СЛОВО"
  row: number;    // starting row (0-based)
  col: number;    // starting column (0-based)
  vertical: boolean;
  clue?: string;
}

/**
 * grid[row][col]: '' = blocked cell, uppercase letter = answer letter at that position.
 * Computed from `words` via computeGrid().
 */
export interface ICrossword {
  id: string;
  name: string;
  grid: string[][];
  words: IWord[];
  likes: number;
  createdAt: number; // Unix ms timestamp
}

/**
 * Builds a grid from a word list. All cells default to '' (blocked).
 * Each word's answer letters are placed at the appropriate positions.
 */
export function computeGrid(words: IWord[]): string[][] {
  let maxRow = 0;
  let maxCol = 0;
  for (const w of words) {
    const answer = w.answer.toUpperCase();
    if (w.vertical) {
      maxRow = Math.max(maxRow, w.row + answer.length - 1);
      maxCol = Math.max(maxCol, w.col);
    } else {
      maxRow = Math.max(maxRow, w.row);
      maxCol = Math.max(maxCol, w.col + answer.length - 1);
    }
  }

  const grid: string[][] = Array.from({ length: maxRow + 1 }, () =>
    Array(maxCol + 1).fill('')
  );

  for (const w of words) {
    const answer = w.answer.toUpperCase();
    for (let i = 0; i < answer.length; i++) {
      if (w.vertical) {
        grid[w.row + i][w.col] = answer[i];
      } else {
        grid[w.row][w.col + i] = answer[i];
      }
    }
  }

  return grid;
}
