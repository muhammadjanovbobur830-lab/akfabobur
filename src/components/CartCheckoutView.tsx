import React, { useState } from 'react';
import {
  Copy,
  Edit3,
  Minus,
  Plus,
  Printer,
  ShoppingBag,
  Trash2,
} from 'lucide-react';
import type { TranslationDict } from '../i18n/translations';
import type { CartItem, OrderFormData } from '../types/window';
import { formatUzPhone, isValidUzPhone } from '../utils/phone';
import { formatUZS } from '../utils/pricing';
import { WindowSchematicSVG } from './WindowSchematicSVG';

interface CartCheckoutViewProps {
  items: CartItem[];
  savedPhone: string;
  t: TranslationDict;
  onBrowseCatalog: () => void;
  onEditItem: (item: CartItem) => void;
  onDuplicateItem: (item: CartItem) => void;
  onRemoveItem: (id: string) => void;
  onUpdateQuantity: (id: string, qty: number) => void;
  onSubmitOrder: (form: OrderFormData) => void;
  onPrintDraftQuote: (form: OrderFormData) => void;
}

export const CartCheckoutView: React.FC<CartCheckoutViewProps> = ({
  items,
  savedPhone,
  t,
  onBrowseCatalog,
  onEditItem,
  onDuplicateItem,
  onRemoveItem,
  onUpdateQuantity,
  onSubmitOrder,
  onPrintDraftQuote,
}) => {
  const [form, setForm] = useState<OrderFormData>({
    name: '',
    phone: savedPhone ? formatUzPhone(savedPhone) : '+998 ',
    address: '',
    roomNotes: '',
    measurementDate: '',
    comment: '',
  });
  const [errors, setErrors] = useState<{
    name?: string;
    phone?: string;
    address?: string;
  }>({});

  const grandTotal = items.reduce((sum, item) => sum + item.price.totalPrice, 0);
  const totalWindowsCount = items.reduce((sum, item) => sum + item.config.quantity, 0);

  const validateAndSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: { name?: string; phone?: string; address?: string } = {};
    if (!form.name.trim()) nextErrors.name = t.cart.nameError;
    if (!isValidUzPhone(form.phone)) nextErrors.phone = t.cart.phoneError;
    if (!form.address.trim()) nextErrors.address = t.cart.addressError;

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onSubmitOrder({
      ...form,
      phone: formatUzPhone(form.phone),
    });
  };

  if (items.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-10 sm:p-14 text-center max-w-2xl mx-auto my-8 space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-[#F4F6F9] text-slate-400 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-extrabold text-[#0F172A]">{t.cart.emptyTitle}</h1>
        <p className="text-sm text-slate-600 max-w-md mx-auto">{t.cart.emptyDesc}</p>
        <div className="pt-2">
          <button
            type="button"
            onClick={onBrowseCatalog}
            className="min-h-[46px] px-6 py-3 rounded-xl bg-[#D91E2A] hover:bg-[#B81620] text-white font-bold text-sm transition-colors cursor-pointer"
          >
            {t.cart.browseCatalog}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
          {t.cart.title}
        </h1>
        <button
          type="button"
          onClick={() => onPrintDraftQuote(form)}
          className="min-h-[42px] px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-[#0F172A] text-xs sm:text-sm font-bold inline-flex items-center gap-2 transition-colors cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>{t.cart.printQuote}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left: Cart Items List */}
        <div className="lg:col-span-7 space-y-4">
          {items.map((item) => {
            const c = item.config;
            const modelTitle = t.catalog.models[c.modelId]?.name ?? c.modelId;

            return (
              <article
                key={item.id}
                className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:gap-5"
              >
                {/* SVG Thumbnail */}
                <div className="w-full sm:w-36 h-36 bg-[#F4F6F9] border border-slate-200/80 rounded-xl p-3 flex items-center justify-center shrink-0">
                  <WindowSchematicSVG config={c} className="max-h-28 w-auto" />
                </div>

                {/* Specs & Controls */}
                <div className="flex-1 flex flex-col justify-between gap-3">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <h2 className="text-base font-extrabold text-[#0F172A]">
                          {modelTitle}
                        </h2>
                        <p className="text-xs text-slate-500 font-mono tabular-nums mt-0.5">
                          {t.seriesNames[c.series].name} · {c.widthMm} × {c.heightMm} mm ·{' '}
                          {item.price.areaM2.toFixed(2)} m²
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-base font-extrabold font-mono tabular-nums text-[#0F172A]">
                          {formatUZS(item.price.totalPrice, t.currency)}
                        </div>
                        {c.quantity > 1 && (
                          <div className="text-[11px] font-mono text-slate-500 tabular-nums">
                            {formatUZS(item.price.unitPrice, t.currency)} × {c.quantity}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-xs text-slate-600 flex flex-wrap gap-x-2 gap-y-1 pt-1">
                      <span>
                        {t.cart.outerShort}: {t.colors[c.outerColor]}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>
                        {t.cart.innerShort}: {t.colors[c.innerColor]}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{t.glass[c.glassType].name}</span>
                      <span aria-hidden="true">·</span>
                      <span>{t.handles[c.extras.handleType]}</span>
                    </div>
                  </div>

                  {/* Action Row */}
                  <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                    {/* Quantity Stepper */}
                    <div className="inline-flex items-center gap-1 bg-[#F8FAFC] border border-slate-200 rounded-lg p-0.5">
                      <button
                        type="button"
                        aria-label="Decrease"
                        onClick={() =>
                          onUpdateQuantity(item.id, Math.max(1, c.quantity - 1))
                        }
                        className="w-8 h-8 rounded-md bg-white border border-slate-200 flex items-center justify-center text-[#0F172A] hover:bg-slate-50 cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-xs font-mono font-bold tabular-nums text-[#0F172A]">
                        {c.quantity}
                      </span>
                      <button
                        type="button"
                        aria-label="Increase"
                        onClick={() => onUpdateQuantity(item.id, c.quantity + 1)}
                        className="w-8 h-8 rounded-md bg-white border border-slate-200 flex items-center justify-center text-[#0F172A] hover:bg-slate-50 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onEditItem(item)}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:text-[#0F172A] hover:bg-slate-50 inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>{t.cart.edit}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onDuplicateItem(item)}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:text-[#0F172A] hover:bg-slate-50 inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>{t.cart.duplicate}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.id)}
                        className="px-3 py-1.5 rounded-lg border border-red-200 text-xs font-semibold text-[#D91E2A] hover:bg-red-50 inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>{t.cart.remove}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Right: Order Form & Summary */}
        <form
          onSubmit={validateAndSubmit}
          noValidate
          className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-5 lg:sticky lg:top-20"
        >
          <h2 className="text-lg font-extrabold text-[#0F172A]">
            {t.cart.orderFormTitle}
          </h2>

          <div className="space-y-3.5">
            {/* Name */}
            <div className="space-y-1">
              <label htmlFor="ord-name" className="block text-xs font-bold text-slate-700">
                {t.cart.nameLabel}
              </label>
              <input
                id="ord-name"
                type="text"
                value={form.name}
                onChange={(e) => {
                  setForm({ ...form, name: e.target.value });
                  if (errors.name) setErrors({ ...errors, name: undefined });
                }}
                placeholder={t.cart.namePlaceholder}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-[#F8FAFC] focus:bg-white focus:outline-none ${
                  errors.name ? 'border-[#D91E2A]' : 'border-slate-300 focus:border-[#0F172A]'
                }`}
              />
              {errors.name && (
                <p className="text-xs font-semibold text-[#D91E2A]">{errors.name}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <label htmlFor="ord-phone" className="block text-xs font-bold text-slate-700">
                {t.cart.phoneLabel}
              </label>
              <input
                id="ord-phone"
                type="tel"
                inputMode="numeric"
                value={form.phone}
                onChange={(e) => {
                  setForm({ ...form, phone: formatUzPhone(e.target.value) });
                  if (errors.phone) setErrors({ ...errors, phone: undefined });
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-mono tabular-nums bg-[#F8FAFC] focus:bg-white focus:outline-none ${
                  errors.phone ? 'border-[#D91E2A]' : 'border-slate-300 focus:border-[#0F172A]'
                }`}
              />
              {errors.phone && (
                <p className="text-xs font-semibold text-[#D91E2A]">{errors.phone}</p>
              )}
            </div>

            {/* Address */}
            <div className="space-y-1">
              <label htmlFor="ord-addr" className="block text-xs font-bold text-slate-700">
                {t.cart.addressLabel}
              </label>
              <input
                id="ord-addr"
                type="text"
                value={form.address}
                onChange={(e) => {
                  setForm({ ...form, address: e.target.value });
                  if (errors.address) setErrors({ ...errors, address: undefined });
                }}
                placeholder={t.cart.addressPlaceholder}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-[#F8FAFC] focus:bg-white focus:outline-none ${
                  errors.address
                    ? 'border-[#D91E2A]'
                    : 'border-slate-300 focus:border-[#0F172A]'
                }`}
              />
              {errors.address && (
                <p className="text-xs font-semibold text-[#D91E2A]">{errors.address}</p>
              )}
            </div>

            {/* Room Notes */}
            <div className="space-y-1">
              <label htmlFor="ord-room" className="block text-xs font-bold text-slate-700">
                {t.cart.roomNotesLabel}
              </label>
              <input
                id="ord-room"
                type="text"
                value={form.roomNotes}
                onChange={(e) => setForm({ ...form, roomNotes: e.target.value })}
                placeholder={t.cart.roomNotesPlaceholder}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-[#F8FAFC] focus:bg-white focus:border-[#0F172A] focus:outline-none"
              />
            </div>

            {/* Preferred Measurement Date */}
            <div className="space-y-1">
              <label htmlFor="ord-date" className="block text-xs font-bold text-slate-700">
                {t.cart.measurementDateLabel}
              </label>
              <input
                id="ord-date"
                type="date"
                value={form.measurementDate}
                onChange={(e) => setForm({ ...form, measurementDate: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono bg-[#F8FAFC] focus:bg-white focus:border-[#0F172A] focus:outline-none"
              />
            </div>

            {/* Comment */}
            <div className="space-y-1">
              <label htmlFor="ord-comment" className="block text-xs font-bold text-slate-700">
                {t.cart.commentLabel}
              </label>
              <textarea
                id="ord-comment"
                rows={2}
                value={form.comment}
                onChange={(e) => setForm({ ...form, comment: e.target.value })}
                placeholder={t.cart.commentPlaceholder}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-[#F8FAFC] focus:bg-white focus:border-[#0F172A] focus:outline-none resize-none"
              />
            </div>
          </div>

          {/* Summary Box */}
          <div className="pt-4 border-t border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>{t.cart.itemsCount}</span>
              <span className="font-mono font-bold text-[#0F172A] tabular-nums">
                {totalWindowsCount}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-[#0F172A]">
                {t.pricing.grandTotal}
              </span>
              <span className="text-xl sm:text-2xl font-extrabold font-mono tabular-nums text-[#D91E2A]">
                {formatUZS(grandTotal, t.currency)}
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full min-h-[48px] px-5 py-3.5 rounded-xl bg-[#D91E2A] hover:bg-[#B81620] text-white font-bold text-sm sm:text-base transition-colors cursor-pointer"
          >
            {t.cart.submitOrder}
          </button>
        </form>
      </div>
    </div>
  );
};
