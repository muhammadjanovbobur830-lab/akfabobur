import React from 'react';
import type { TranslationDict } from '../i18n/translations';
import type { CartItem, OrderFormData } from '../types/window';
import { formatUZS } from '../utils/pricing';
import { AkfaLogo } from './AkfaLogo';
import { WindowSchematicSVG } from './WindowSchematicSVG';

export interface PrintableQuotePayload {
  orderNumber: string;
  createdAt: string;
  customer: OrderFormData;
  items: CartItem[];
  totalAmount: number;
}

interface PrintableQuoteProps {
  payload: PrintableQuotePayload | null;
  t: TranslationDict;
}

export const PrintableQuote: React.FC<PrintableQuoteProps> = ({ payload, t }) => {
  if (!payload) return null;

  return (
    <div className="print-only p-8 bg-white text-[#0F172A] space-y-6">
      <div className="flex items-start justify-between border-b-2 border-[#0F172A] pb-4">
        <div className="space-y-1">
          <AkfaLogo size="lg" />
          <p className="text-xs font-bold tracking-wider uppercase text-slate-600 pt-1">
            {t.print.docTitle}
          </p>
        </div>
        <div className="text-right text-xs font-mono space-y-1">
          <div>
            <strong>{t.print.orderNo}:</strong> {payload.orderNumber}
          </div>
          <div>
            <strong>{t.print.generatedAt}:</strong>{' '}
            {new Date(payload.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Customer Details */}
      <div className="grid grid-cols-3 gap-4 text-xs bg-slate-50 border border-slate-200 rounded-lg p-4">
        <div>
          <span className="text-slate-500 block">{t.print.customer}</span>
          <strong className="text-sm">{payload.customer.name || '—'}</strong>
        </div>
        <div>
          <span className="text-slate-500 block">{t.print.phone}</span>
          <strong className="text-sm font-mono">{payload.customer.phone || '—'}</strong>
        </div>
        <div>
          <span className="text-slate-500 block">{t.print.address}</span>
          <strong className="text-sm">{payload.customer.address || '—'}</strong>
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full border-collapse text-xs">
        <thead>
          <tr className="border-b border-slate-300 text-left text-slate-500 uppercase">
            <th className="py-2 pr-3">#</th>
            <th className="py-2 pr-3">{t.print.specs}</th>
            <th className="py-2 pr-3">{t.print.dimensions}</th>
            <th className="py-2 pr-3 text-right">{t.print.qty}</th>
            <th className="py-2 pr-3 text-right">{t.print.unitPrice}</th>
            <th className="py-2 text-right">{t.print.total}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {payload.items.map((item, idx) => {
            const c = item.config;
            return (
              <tr key={item.id}>
                <td className="py-3 pr-3 font-mono align-top">{idx + 1}</td>
                <td className="py-3 pr-3 align-top">
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-16 shrink-0 border border-slate-200 rounded p-1">
                      <WindowSchematicSVG config={c} className="w-full h-full" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="font-bold text-sm">
                        {t.catalog.models[c.modelId]?.name ?? c.modelId}
                      </div>
                      <div className="text-slate-600">
                        {t.seriesNames[c.series].name} · {t.glass[c.glassType].name}
                      </div>
                      <div className="text-slate-500">
                        {t.cart.outerShort}: {t.colors[c.outerColor]} / {t.cart.innerShort}:{' '}
                        {t.colors[c.innerColor]}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-3 pr-3 font-mono tabular-nums align-top">
                  {c.widthMm} × {c.heightMm}
                </td>
                <td className="py-3 pr-3 text-right font-mono tabular-nums align-top">
                  {c.quantity}
                </td>
                <td className="py-3 pr-3 text-right font-mono tabular-nums align-top">
                  {formatUZS(item.price.unitPrice, t.currency)}
                </td>
                <td className="py-3 text-right font-mono font-bold tabular-nums align-top">
                  {formatUZS(item.price.totalPrice, t.currency)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="flex items-center justify-between border-t-2 border-[#0F172A] pt-4">
        <span className="text-xs text-slate-500 max-w-md">{t.print.note}</span>
        <div className="text-right">
          <div className="text-xs font-bold uppercase text-slate-500">
            {t.print.grandTotal}
          </div>
          <div className="text-2xl font-extrabold font-mono tabular-nums text-[#D91E2A]">
            {formatUZS(payload.totalAmount, t.currency)}
          </div>
        </div>
      </div>
    </div>
  );
};
