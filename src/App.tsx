import React, { useEffect, useState } from 'react';
import { ClipboardList, Grid, Phone, ShoppingBag, Sliders } from 'lucide-react';
import { CATALOG_MODELS } from './constants/catalog';
import { TRANSLATIONS } from './i18n/translations';
import type {
  AppView,
  CartItem,
  Language,
  OrderFormData,
  OrderRecord,
  WindowConfig,
} from './types/window';
import { isValidUzPhone } from './utils/phone';
import { calculateWindowPrice } from './utils/pricing';
import {
  loadCart,
  loadOrders,
  loadSavedLanguage,
  loadSavedPhone,
  saveCart,
  saveLanguage,
  saveOrder,
  savePhone,
} from './utils/storage';
import { sendOrderToTelegram } from './utils/telegram';
import { AkfaLogo } from './components/AkfaLogo';
import { CartCheckoutView } from './components/CartCheckoutView';
import { CatalogView } from './components/CatalogView';
import { ConfiguratorView } from './components/ConfiguratorView';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { OrderSuccessView } from './components/OrderSuccessView';
import { OrdersHistoryView } from './components/OrdersHistoryView';
import { PhoneGate } from './components/PhoneGate';
import { PrintableQuote, type PrintableQuotePayload } from './components/PrintableQuote';

function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `AKFI-${year}-${suffix}`;
}

export default function App() {
  const [language, setLanguage] = useState<Language>(() => loadSavedLanguage());
  const [savedPhone, setSavedPhone] = useState<string>(() => loadSavedPhone());
  const [gateOpen, setGateOpen] = useState<boolean>(() => !isValidUzPhone(loadSavedPhone()));

  const [view, setView] = useState<AppView>('catalog');
  const [activeConfig, setActiveConfig] = useState<WindowConfig>(
    () => ({ ...CATALOG_MODELS[1].defaultConfig })
  );
  const [editingCartItemId, setEditingCartItemId] = useState<string | null>(null);

  const [cart, setCart] = useState<CartItem[]>(() => loadCart());
  const [orders, setOrders] = useState<OrderRecord[]>(() => loadOrders());
  const [latestOrder, setLatestOrder] = useState<OrderRecord | null>(null);
  const [printPayload, setPrintPayload] = useState<PrintableQuotePayload | null>(null);

  const t = TRANSLATIONS[language];

  // Keep <html lang="..."> synced
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
    saveLanguage(language);
  }, [language]);

  useEffect(() => {
    saveCart(cart);
  }, [cart]);

  const handleUnlockPhone = (validPhone: string) => {
    savePhone(validPhone);
    setSavedPhone(validPhone);
    setGateOpen(false);
  };

  const handleSelectModel = (presetConfig: WindowConfig) => {
    setEditingCartItemId(null);
    setActiveConfig({
      ...presetConfig,
      sashes: [...presetConfig.sashes],
      extras: { ...presetConfig.extras },
    });
    setView('configurator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddOrUpdateCart = (configToSave: WindowConfig) => {
    const cleanConfig: WindowConfig = {
      ...configToSave,
      sashes: [...configToSave.sashes],
      extras: { ...configToSave.extras },
    };
    const price = calculateWindowPrice(cleanConfig);

    if (editingCartItemId) {
      setCart((prev) =>
        prev.map((item) =>
          item.id === editingCartItemId
            ? { ...item, config: cleanConfig, price }
            : item
        )
      );
      setEditingCartItemId(null);
      setView('cart');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const newItem: CartItem = {
        id: generateId(),
        config: cleanConfig,
        price,
        createdAt: new Date().toISOString(),
      };
      setCart((prev) => [...prev, newItem]);
    }
  };

  const handleEditCartItem = (item: CartItem) => {
    setEditingCartItemId(item.id);
    setActiveConfig({
      ...item.config,
      sashes: [...item.config.sashes],
      extras: { ...item.config.extras },
    });
    setView('configurator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDuplicateCartItem = (item: CartItem) => {
    const copyConfig: WindowConfig = {
      ...item.config,
      sashes: [...item.config.sashes],
      extras: { ...item.config.extras },
    };
    const duplicate: CartItem = {
      id: generateId(),
      config: copyConfig,
      price: calculateWindowPrice(copyConfig),
      createdAt: new Date().toISOString(),
    };
    setCart((prev) => [...prev, duplicate]);
  };

  const handleRemoveCartItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    if (editingCartItemId === id) {
      setEditingCartItemId(null);
    }
  };

  const handleUpdateCartQuantity = (id: string, qty: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const nextCfg = { ...item.config, quantity: Math.max(1, qty) };
        return {
          ...item,
          config: nextCfg,
          price: calculateWindowPrice(nextCfg),
        };
      })
    );
  };

  const triggerPrint = (payload: PrintableQuotePayload) => {
    setPrintPayload(payload);
    window.setTimeout(() => {
      window.print();
    }, 80);
  };

  const handleSubmitOrder = async (customerForm: OrderFormData) => {
    const orderNumber = generateOrderNumber();
    const totalAmount = cart.reduce((sum, item) => sum + item.price.totalPrice, 0);

    const newOrder: OrderRecord = {
      orderNumber,
      createdAt: new Date().toISOString(),
      customer: customerForm,
      items: cart,
      totalAmount,
      telegramSent: false,
    };

    const updatedOrders = saveOrder(newOrder);
    setOrders(updatedOrders);
    setLatestOrder(newOrder);
    setCart([]);
    setEditingCartItemId(null);
    setView('success');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Non-blocking Telegram notification (skips silently if BOT_TOKEN/CHAT_ID are empty)
    const sent = await sendOrderToTelegram(newOrder);
    if (sent) {
      setLatestOrder((prev) =>
        prev && prev.orderNumber === orderNumber ? { ...prev, telegramSent: true } : prev
      );
    }
  };

  if (gateOpen) {
    return (
      <PhoneGate
        language={language}
        onLanguageChange={setLanguage}
        t={t}
        initialPhone={savedPhone}
        onUnlock={handleUnlockPhone}
      />
    );
  }

  const cartItemTotalCount = cart.reduce((sum, item) => sum + item.config.quantity, 0);

  return (
    <>
      <div className="no-print min-h-screen flex flex-col bg-[#F7F8FA] text-[#0F172A]">
        {/* Top Bar (3-zone contract) */}
        <header className="sticky top-0 z-30 bg-white/95 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 md:gap-8">
            {/* Zone 1: Brand Wordmark */}
            <button
              type="button"
              onClick={() => setView('catalog')}
              className="cursor-pointer focus-visible:outline-2 focus-visible:outline-[#D91E2A] rounded-lg"
            >
              <AkfaLogo size="md" />
            </button>

            {/* Zone 2: Primary Desktop Navigation */}
            <nav
              className="hidden md:flex items-center gap-7 text-sm font-semibold"
              aria-label="Primary"
            >
              {(
                [
                  { id: 'catalog', label: t.nav.catalog },
                  { id: 'configurator', label: t.nav.configurator },
                  { id: 'orders', label: t.nav.orders },
                ] as const
              ).map((navItem) => {
                const active = view === navItem.id;
                return (
                  <button
                    key={navItem.id}
                    type="button"
                    onClick={() => setView(navItem.id)}
                    className={`py-1 whitespace-nowrap shrink-0 border-b-2 transition-colors cursor-pointer ${
                      active
                        ? 'text-[#D91E2A] border-[#D91E2A]'
                        : 'text-slate-600 border-transparent hover:text-[#0F172A]'
                    }`}
                  >
                    {navItem.label}
                  </button>
                );
              })}
            </nav>

            {/* Zone 3: Language Switcher + Cart Action */}
            <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
              <LanguageSwitcher language={language} onChange={setLanguage} compact />
              <button
                type="button"
                onClick={() => setView('cart')}
                className={`min-h-[40px] px-3.5 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  view === 'cart'
                    ? 'bg-[#D91E2A] text-white'
                    : 'bg-[#0F172A] hover:bg-slate-800 text-white'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">{t.nav.cart}</span>
                <span className="font-mono tabular-nums px-1.5 py-0.5 rounded-md bg-white/15 text-[11px]">
                  {cartItemTotalCount}
                </span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-20 md:pb-8">
          {view === 'catalog' && (
            <CatalogView
              t={t}
              onSelectModel={handleSelectModel}
              onOpenConfigurator={() => {
                setView('configurator');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {view === 'configurator' && (
            <ConfiguratorView
              config={activeConfig}
              isEditing={Boolean(editingCartItemId)}
              t={t}
              onChange={setActiveConfig}
              onAddToOrder={handleAddOrUpdateCart}
              onCancelEdit={() => {
                setEditingCartItemId(null);
                setView('cart');
              }}
              onGoToCart={() => {
                setView('cart');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {view === 'cart' && (
            <CartCheckoutView
              items={cart}
              savedPhone={savedPhone}
              t={t}
              onBrowseCatalog={() => setView('catalog')}
              onEditItem={handleEditCartItem}
              onDuplicateItem={handleDuplicateCartItem}
              onRemoveItem={handleRemoveCartItem}
              onUpdateQuantity={handleUpdateCartQuantity}
              onSubmitOrder={handleSubmitOrder}
              onPrintDraftQuote={(customerForm) => {
                const totalAmount = cart.reduce(
                  (sum, item) => sum + item.price.totalPrice,
                  0
                );
                triggerPrint({
                  orderNumber: 'DRAFT-QUOTE',
                  createdAt: new Date().toISOString(),
                  customer: customerForm,
                  items: cart,
                  totalAmount,
                });
              }}
            />
          )}

          {view === 'success' && latestOrder && (
            <OrderSuccessView
              order={latestOrder}
              t={t}
              onPrintQuote={(order) =>
                triggerPrint({
                  orderNumber: order.orderNumber,
                  createdAt: order.createdAt,
                  customer: order.customer,
                  items: order.items,
                  totalAmount: order.totalAmount,
                })
              }
              onViewOrders={() => setView('orders')}
              onConfigureAnother={() => {
                setView('configurator');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {view === 'orders' && (
            <OrdersHistoryView
              orders={orders}
              t={t}
              onPrintQuote={(order) =>
                triggerPrint({
                  orderNumber: order.orderNumber,
                  createdAt: order.createdAt,
                  customer: order.customer,
                  items: order.items,
                  totalAmount: order.totalAmount,
                })
              }
              onBrowseCatalog={() => setView('catalog')}
            />
          )}
        </main>

        {/* Quiet Footer */}
        <footer className="hidden md:block border-t border-slate-200 bg-white">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between text-xs text-slate-500">
            <span>AKFI Deraza · Standard / Comfort / Premium</span>
            <button
              type="button"
              onClick={() => setGateOpen(true)}
              className="inline-flex items-center gap-1.5 font-mono text-slate-600 hover:text-[#D91E2A] transition-colors cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{savedPhone}</span>
              <span className="underline ml-1">{t.nav.changePhone}</span>
            </button>
          </div>
        </footer>

        {/* Mobile Bottom Tab Bar (56px height, well under 15% cap) */}
        <nav
          aria-label="Mobile Navigation"
          className="md:hidden fixed bottom-0 left-0 right-0 z-30 h-14 bg-white border-t border-slate-200 grid grid-cols-4"
        >
          {(
            [
              { id: 'catalog', label: t.nav.catalog, icon: Grid },
              { id: 'configurator', label: t.nav.configurator, icon: Sliders },
              { id: 'cart', label: t.nav.cart, icon: ShoppingBag, badge: cartItemTotalCount },
              { id: 'orders', label: t.nav.orders, icon: ClipboardList },
            ] as const
          ).map((tab) => {
            const Icon = tab.icon;
            const active = view === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setView(tab.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`flex flex-col items-center justify-center gap-0.5 text-[11px] font-bold transition-colors cursor-pointer ${
                  active ? 'text-[#D91E2A]' : 'text-slate-500'
                }`}
              >
                <div className="relative">
                  <Icon className="w-4 h-4" />
                  {'badge' in tab && tab.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 px-1 min-w-[16px] h-4 rounded-full bg-[#D91E2A] text-white text-[10px] font-mono leading-4 text-center">
                      {tab.badge}
                    </span>
                  )}
                </div>
                <span className="truncate max-w-[76px]">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Print / PDF Quote Sheet */}
      <PrintableQuote payload={printPayload} t={t} />
    </>
  );
}
