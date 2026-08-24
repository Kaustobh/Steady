import type { StorageDataExport, UserProfile, Task, Project, Resource, DailyReview } from '../types';

const DB_NAME = 'SteadyAppDB';
const DB_VERSION = 1;
const STORE_NAME = 'user_data';

/**
 * Initialize IndexedDB with local storage fallback
 */
export const initDB = (): Promise<IDBDatabase | null> => {
  return new Promise((resolve) => {
    if (!window.indexedDB) {
      resolve(null);
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => resolve(null);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
};

/**
 * Save state to LocalStorage & IndexedDB
 */
export const savePersistentState = async (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    const db = await initDB();
    if (db) {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put(data, key);
    }
  } catch (e) {
    console.warn(`Storage save error for ${key}:`, e);
  }
};

/**
 * Load state from LocalStorage
 */
export const loadPersistentState = <T>(key: string, fallback: T): T => {
  try {
    const item = localStorage.getItem(key);
    if (!item || item === 'undefined' || item === 'null') return fallback;
    return JSON.parse(item);
  } catch (e) {
    console.warn(`Storage load error for ${key}:`, e);
    return fallback;
  }
};

/**
 * Export full backup as JSON
 */
export const exportUserDataJSON = (
  user: UserProfile,
  tasks: Task[],
  projects: Project[],
  resources: Resource[],
  dailyReviews: DailyReview[]
): string => {
  const exportData: StorageDataExport = {
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    user,
    tasks,
    projects,
    resources,
    dailyReviews,
  };
  return JSON.stringify(exportData, null, 2);
};
