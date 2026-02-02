const DB_NAME = 'buildbridge-offline';
const DB_VERSION = 1;

export const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('pending_updates')) {
        db.createObjectStore('pending_updates', { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains('cached_projects')) {
        db.createObjectStore('cached_projects', { keyPath: 'id' });
      }
    };
  });
};

export const savePendingUpdate = async (data: any, token: string) => {
  const db = await openDB();
  const tx = db.transaction('pending_updates', 'readwrite');
  const store = tx.objectStore('pending_updates');
  await store.add({ data, token, timestamp: Date.now() });
};

export const getCachedProjects = async () => {
  const db = await openDB();
  const tx = db.transaction('cached_projects', 'readonly');
  const store = tx.objectStore('cached_projects');
  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const cacheProjects = async (projects: any[]) => {
  const db = await openDB();
  const tx = db.transaction('cached_projects', 'readwrite');
  const store = tx.objectStore('cached_projects');
  projects.forEach(p => store.put(p));
};
