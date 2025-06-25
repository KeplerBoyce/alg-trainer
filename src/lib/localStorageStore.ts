import { writable } from "svelte/store";

export function localStorageStore<T>(key: string, initialValue: T) {
  let storedValue: T;
  if (typeof window !== 'undefined') {
    const item = localStorage.getItem(key);
    storedValue = item ? (JSON.parse(item) as T) : initialValue;
  } else {
    storedValue = initialValue;
  }

  const store = writable<T>(storedValue);

  if (typeof window !== 'undefined') {
    store.subscribe(value => {
      localStorage.setItem(key, JSON.stringify(value));
    });

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue !== null) {
        store.set(JSON.parse(event.newValue) as T);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return {
      subscribe: store.subscribe,
      set: store.set,
      update: store.update,
      destroy: () => {
        window.removeEventListener('storage', handleStorageChange);
      }
    };
  }

  return store;
}