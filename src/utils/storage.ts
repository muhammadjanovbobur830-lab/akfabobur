import type { CartItem, Language, OrderRecord } from '../types/window';

const KEYS = {
  PHONE: 'akfa_user_phone',
  LANG: 'akfa_language',
  CART: 'akfa_cart_items',
  ORDERS: 'akfa_order_history',
} as const;

// In-memory fallback if localStorage is blocked or unavailable
const memoryFallback = new Map<string, string>();

function safeGetItem(key: string): string | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key);
    }
  } catch {
    // Fallback below
  }
  return memoryFallback.get(key) ?? null;
}

function safeSetItem(key: string, value: string): void {
  memoryFallback.set(key, value);
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
    }
  } catch {
    // Ignore storage quota/privacy mode errors cleanly
  }
}

export function loadSavedPhone(): string {
  return safeGetItem(KEYS.PHONE) ?? '';
}

export function savePhone(phone: string): void {
  safeSetItem(KEYS.PHONE, phone);
}

export function loadSavedLanguage(): Language {
  const val = safeGetItem(KEYS.LANG);
  if (val === 'uz' || val === 'ru' || val === 'en') {
    return val;
  }
  return 'uz';
}

export function saveLanguage(lang: Language): void {
  safeSetItem(KEYS.LANG, lang);
}

export function loadCart(): CartItem[] {
  const raw = safeGetItem(KEYS.CART);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]): void {
  try {
    safeSetItem(KEYS.CART, JSON.stringify(items));
  } catch {
    // Ignore serialization errors
  }
}

export function loadOrders(): OrderRecord[] {
  const raw = safeGetItem(KEYS.ORDERS);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveOrder(order: OrderRecord): OrderRecord[] {
  const current = loadOrders();
  const updated = [order, ...current];
  try {
    safeSetItem(KEYS.ORDERS, JSON.stringify(updated));
  } catch {
    // Ignore errors
  }
  return updated;
}
