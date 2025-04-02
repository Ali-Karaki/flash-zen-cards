
"use client";
import { useState, useEffect } from "react";

const kLocalStoragePrefix = "d6ceec545bb05b78e3dd0b64765f36889dbddc39.swe-flashcards";

const prefix = (key: string) =>
  key.startsWith(kLocalStoragePrefix) ? key : `${kLocalStoragePrefix}.${key}`;

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const item = window.localStorage.getItem(prefix(key));
      if (item !== null) {
        setStoredValue(JSON.parse(item));
      } else {
        window.localStorage.setItem(prefix(key), JSON.stringify(initialValue));
      }
    } catch (error) {
      console.log("Error accessing localStorage", error);
    }
    setHasHydrated(true);
  }, [key, initialValue]);

  const setValue = (value: T) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(prefix(key), JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.log("Error setting localStorage", error);
    }
  };

  return [storedValue, setValue];
}

export function resetLocalStorage() {
  if (typeof window === "undefined") return;

  const keysToRemove: string[] = [];
  for (let i = 0; i < window.localStorage.length; i++) {
    const key = window.localStorage.key(i);
    if (key && key.startsWith(kLocalStoragePrefix)) {
      keysToRemove.push(key);
    }
  }

  keysToRemove.forEach((key) => {
    window.localStorage.removeItem(key);
  });
}
