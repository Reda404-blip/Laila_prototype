"use client";

import { useMemo, useSyncExternalStore } from "react";

import {
  LOCAL_DECLARATIONS_EVENT,
  LOCAL_DECLARATIONS_KEY,
  type LocalDeclarationRecord,
} from "@/lib/local-declarations";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(LOCAL_DECLARATIONS_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(LOCAL_DECLARATIONS_EVENT, callback);
  };
}

function getSnapshot() {
  return window.localStorage.getItem(LOCAL_DECLARATIONS_KEY) ?? "[]";
}

function getServerSnapshot() {
  return "[]";
}

export function useLocalDeclarations() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return useMemo(() => {
    try {
      return JSON.parse(snapshot) as LocalDeclarationRecord[];
    } catch {
      return [];
    }
  }, [snapshot]);
}
