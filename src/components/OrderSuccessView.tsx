import React from 'react';
import { CheckCircle2, ClipboardList, PlusCircle, Printer } from 'lucide-react';
import type { TranslationDict } from '../i18n/translations';
import type { OrderRecord } from '../types/window';
import { formatUZS } from '../utils/pricing';

interface OrderSuccessViewProps {
  order: OrderRecord;
  t: TranslationDict;
  onPrintQuote: (order: OrderRecord) => void;
  onViewOrders: () => void;
  onConfigureAnother: () => void;
}

export const OrderSuccessView: React.FC<OrderSuccessViewProps> = ({
  order,
  t,
  onPrintQuote,
  onViewOrders,
  onConfigureAnother,
}) => {
  return (
    <div className="max-w-2xl mx-auto my-8 bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
        <CheckCircle2 className="w-9 h-9" />
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
          {t.success.title}
        </h1>
        <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          {t.success.subtitle}
        </p>
      </div>

      <div className="bg-[#F7F8FA] border border-slate-200 rounded-xl p-4 sm:p-5 space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-slate-500">{t.success.orderNumberLabel}</span>
          <span className="font-mono font-extrabold text-[#0F172A]">
            {order.orderNumber}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-500">{t.orders.customerLabel}</span>
          <span className="font-semibold text-[#0F172A]">
            {order.customer.name} · {order.customer.phone}
          </span>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-slate-200">
          <span className="font-bold text-[#0F172A]">{t.pricing.grandTotal}</span>
          <span className="font-mono tabular-nums font-extrabold text-lg text-[#D91E2A]">
            {formatUZS(order.totalAmount, t.currency)}
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={() => onPrintQuote(order)}
          className="min-h-[46px] px-5 py-3 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white text-sm font-bold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>{t.success.printQuote}</span>
        </button>

        <button
          type="button"
          onClick={onViewOrders}
          className="min-h-[46px] px-5 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-[#0F172A] text-sm font-bold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <ClipboardList className="w-4 h-4" />
          <span>{t.success.viewOrders}</span>
        </button>

        <button
          type="button"
          onClick={onConfigureAnother}
          className="min-h-[46px] px-5 py-3 rounded-xl bg-[#D91E2A] hover:bg-[#B81620] text-white text-sm font-bold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{t.success.configureAnother}</span>
        </button>
      </div>
    </div>
  );
};
