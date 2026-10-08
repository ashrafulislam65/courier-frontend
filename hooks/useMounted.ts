'use client';

import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

// Server-এ false, browser-এ true: persisted auth state-এর hydration mismatch এড়াতে
export function useMounted() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}