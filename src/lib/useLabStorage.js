"use client";
import { useState, useEffect, useCallback, useRef } from 'react';

const DB_NAME = 'nd3-lab-data';
const DB_VERSION = 1;

function openDB() {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB not available'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('labHistory')) {
        db.createObjectStore('labHistory', { keyPath: 'id' });
      }
    };
  });
}

async function dbGet(labId) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('labHistory', 'readonly');
      const store = tx.objectStore('labHistory');
      const request = store.get(labId);
      request.onsuccess = () => resolve(request.result?.data || null);
      request.onerror = () => reject(request.error);
    });
  } catch {
    return null;
  }
}

async function dbSet(labId, data) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('labHistory', 'readwrite');
      const store = tx.objectStore('labHistory');
      const request = store.put({ id: labId, data, updatedAt: Date.now() });
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  } catch {
    return false;
  }
}

async function dbDelete(labId) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('labHistory', 'readwrite');
      const store = tx.objectStore('labHistory');
      const request = store.delete(labId);
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  } catch {
    return false;
  }
}

async function dbClearAll() {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('labHistory', 'readwrite');
      const store = tx.objectStore('labHistory');
      const request = store.clear();
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  } catch {
    return false;
  }
}

async function dbExportAll() {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('labHistory', 'readonly');
      const store = tx.objectStore('labHistory');
      const request = store.getAll();
      request.onsuccess = () => {
        const result = {};
        request.result.forEach(item => {
          result[item.id] = item.data;
        });
        resolve(result);
      };
      request.onerror = () => reject(request.error);
    });
  } catch {
    return {};
  }
}

async function dbImportAll(data) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('labHistory', 'readwrite');
      const store = tx.objectStore('labHistory');
      let completed = 0;
      const total = Object.keys(data).length;
      if (total === 0) {
        resolve(true);
        return;
      }
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
      Object.entries(data).forEach(([id, labData]) => {
        store.put({ id, data: labData, updatedAt: Date.now() });
      });
    });
  } catch {
    return false;
  }
}

function lsGet(key, fallback = null) {
  if (typeof window === 'undefined') return fallback;
  try {
    const val = localStorage.getItem(key);
    return val !== null ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
}

function lsSet(key, value) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

function lsDelete(key) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(key);
  } catch {}
}

export function useLabStorage(labId, initialData = {}) {
  const [data, setData] = useState(initialData);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const saveTimeoutRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const stored = await dbGet(labId);
      if (!cancelled) {
        setData(stored !== null ? stored : initialData);
        setIsLoaded(true);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [labId]);

  const save = useCallback(async (newData) => {
    setData(newData);
    setIsSaving(true);
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(async () => {
      await dbSet(labId, newData);
      setIsSaving(false);
    }, 300);
  }, [labId]);

  const update = useCallback((updater) => {
    setData(prev => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      save(next);
      return next;
    });
  }, [save]);

  const reset = useCallback(async () => {
    await dbDelete(labId);
    setData(initialData);
  }, [labId, initialData]);

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, []);

  return { data, setData: update, isLoaded, isSaving, reset };
}

export function useLabLocalStorage(key, fallback = null) {
  const [value, setValue] = useState(fallback);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = lsGet(key, fallback);
    setValue(stored);
    setIsLoaded(true);
  }, [key]);

  const setStored = useCallback((newVal) => {
    const next = typeof newVal === 'function' ? newVal(value) : newVal;
    setValue(next);
    lsSet(key, next);
  }, [key, value]);

  const remove = useCallback(() => {
    lsDelete(key);
    setValue(fallback);
  }, [key, fallback]);

  return { value, setValue: setStored, isLoaded, remove };
}

export const labStorage = {
  dbGet,
  dbSet,
  dbDelete,
  dbClearAll,
  dbExportAll,
  dbImportAll,
  lsGet,
  lsSet,
  lsDelete,
};

export async function exportAllLabData() {
  const dbData = await dbExportAll();
  const lsKeys = [
    'nd3-coin-label-a', 'nd3-coin-label-b',
    'nd3-spoon-tracker-date', 'nd3-spoon-tracker-max',
    'nd3-spoon-tracker-banked', 'nd3-spoon-tracker-tasks',
    'nd3-audit-save-permission', 'nd3-audit-last-ratings',
    'nd3-visual-grain', 'nd3-visual-wash', 'nd3-visual-color',
    'nd3-visual-snow-sitewide',
  ];
  const lsData = {};
  lsKeys.forEach(key => {
    const val = lsGet(key);
    if (val !== null) lsData[`ls:${key}`] = val;
  });
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    source: 'neurodivers3',
    indexedDB: dbData,
    localStorage: lsData,
  };
}

export async function importAllLabData(data) {
  if (!data || !data.version || data.source !== 'neurodivers3') {
    throw new Error('Invalid data format');
  }
  if (data.indexedDB) {
    await dbImportAll(data.indexedDB);
  }
  if (data.localStorage) {
    Object.entries(data.localStorage).forEach(([key, value]) => {
      if (key.startsWith('ls:')) {
        lsSet(key.replace('ls:', ''), value);
      }
    });
  }
  return true;
}

export async function clearAllLabData() {
  await dbClearAll();
  const keys = [
    'nd3-coin-label-a', 'nd3-coin-label-b',
    'nd3-spoon-tracker-date', 'nd3-spoon-tracker-max',
    'nd3-spoon-tracker-banked', 'nd3-spoon-tracker-tasks',
    'nd3-audit-save-permission', 'nd3-audit-last-ratings',
    'nd3-visual-grain', 'nd3-visual-wash', 'nd3-visual-color',
    'nd3-visual-snow-sitewide',
  ];
  keys.forEach(key => lsDelete(key));
}
