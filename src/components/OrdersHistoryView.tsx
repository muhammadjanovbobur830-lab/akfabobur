import React from 'react';
import { ClipboardList, Printer } from 'lucide-react';
import type { TranslationDict } from '../i18n/translations';
import type { OrderRecord } from '../types/window';
import { formatUZS } from '../utils/pricing';
import { WindowSchematicSVG } from './WindowSchematicSVG';

interface OrdersHistoryViewProps {
  orders: OrderRecord[];
  t: TranslationDict;
  onPrintQuote: (order: OrderRecord) => void;
  onBrowseCatalog: () => void;
}

export const OrdersHistoryView: React.FC<OrdersHistoryViewProps> = ({
  orders,
  t,
  onPrintQuote,
  onBrowseCatalog,
}) => {
  if (orders.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-10 sm:p-14 text-center max-w-2xl mx-auto my-8 space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-[#F4F6F9] text-slate-400 flex items-center justify-center mx-auto">
          <ClipboardList className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-extrabold text-[#0F172A]">{t.orders.emptyTitle}</h1>
        <p className="text-sm text-slate-600 max-w-md mx-auto">{t.orders.emptyDesc}</p>
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
      <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
        {t.orders.title}
      </h1>

      <div className="space-y-4">
        {orders.map((order) => {
          const formattedDate = new Date(order.createdAt).toLocaleString();
          return (
            <article
              key={order.orderNumber}
              className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-100">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 text-sm font-extrabold text-[#0F172A] font-mono">
                    <span>
                      {t.orders.orderLabel} #{order.orderNumber}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 font-mono">{formattedDate}</div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="block text-[11px] text-slate-500">
                      {t.orders.totalLabel}
                    </span>
                    <span className="text-lg font-extrabold font-mono tabular-nums text-[#D91E2A]">
                      {formatUZS(order.totalAmount, t.currency)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onPrintQuote(order)}
                    className="min-h-[40px] px-3.5 py-2 rounded-xl border border-slate-200 bg-[#F8FAFC] hover:bg-slate-100 text-xs font-bold text-[#0F172A] inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>{t.orders.printQuote}</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
                <div>
                  <span className="text-slate-400 block">{t.orders.customerLabel}</span>
                  <span className="font-semibold text-[#0F172A]">
                    {order.customer.name} · {order.customer.phone}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">{t.orders.addressLabel}</span>
                  <span className="font-semibold text-[#0F172A]">
                    {order.customer.address}
                  </span>
                </div>
                {order.customer.measurementDate && (
                  <div>
                    <span className="text-slate-400 block">
                      {t.orders.measurementLabel}
                    </span>
                    <span className="font-mono font-semibold text-[#0F172A]">
                      {order.customer.measurementDate}
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-[#F7F8FA] border border-slate-200/80"
                  >
                    <div className="w-16 h-16 bg-white rounded-lg border border-slate-200 p-1.5 flex items-center justify-center shrink-0">
                      <WindowSchematicSVG config={item.config} className="max-h-12 w-auto" />
                    </div>
                    <div className="min-w-0 flex-1 text-xs">
                      <div className="font-bold text-[#0F172A] truncate">
                        {t.catalog.models[item.config.modelId]?.name ?? item.config.modelId}
                      </div>
                      <div className="text-slate-500 font-mono tabular-nums">
                        {item.config.widthMm} × {item.config.heightMm} mm · ×
                        {item.config.quantity}
                      </div>
                      <div className="font-mono font-bold text-[#0F172A] mt-0.5 tabular-nums">
                        {formatUZS(item.price.totalPrice, t.currency)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
