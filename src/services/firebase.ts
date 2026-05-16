/**
 * Firebase Firestore service with graceful offline fallback.
 * All errors are silently caught so the app keeps working offline
 * when the free-tier quota is exhausted.
 */
import { initializeApp, FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  Firestore,
  collection,
  query,
  where,
  orderBy,
  getDocs,
  doc,
  updateDoc,
  increment,
} from 'firebase/firestore';
import { ICrossword } from '../types/crossword';

// ---------------------------------------------------------------------------
// Configuration – replace with your own Firebase project values.
// ---------------------------------------------------------------------------
const FIREBASE_CONFIG = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_PROJECT.firebaseapp.com',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_PROJECT.appspot.com',
  messagingSenderId: 'YOUR_SENDER_ID',
  appId: 'YOUR_APP_ID',
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;

function getDb(): Firestore | null {
  if (db) return db;
  try {
    app = initializeApp(FIREBASE_CONFIG);
    db = getFirestore(app);
    return db;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Fetch new crosswords published after `afterTimestamp`.
// Returns an empty array on any error (quota exceeded, offline, etc.).
// ---------------------------------------------------------------------------
export async function fetchNewCrosswords(afterTimestamp: number): Promise<ICrossword[]> {
  const database = getDb();
  if (!database) return [];
  try {
    const crosswordsRef = collection(database, 'crosswords');
    const q = query(
      crosswordsRef,
      where('createdAt', '>', afterTimestamp),
      orderBy('createdAt', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as ICrossword));
  } catch {
    // Quota exceeded or network error – work offline.
    return [];
  }
}

// ---------------------------------------------------------------------------
// Increment like counter on a crossword document.
// Silently ignored on failure.
// ---------------------------------------------------------------------------
export async function incrementLikeOnServer(crosswordId: string): Promise<void> {
  const database = getDb();
  if (!database) return;
  try {
    const ref = doc(database, 'crosswords', crosswordId);
    await updateDoc(ref, { likes: increment(1) });
  } catch {
    // Quota exceeded or offline – like is still stored locally.
  }
}
