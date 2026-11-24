import React from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { CATALOG_MODELS, PROFILE_SERIES } from '../constants/catalog';
import type { TranslationDict } from '../i18n/translations';
import type { ProfileSeriesId, WindowConfig } from '../types/window';
import { calculateWindowPrice, formatUZS } from '../utils/pricing';
import { WindowSchematicSVG } from './WindowSchematicSVG';

interface CatalogViewProps {
  t: TranslationDict;
  onSelectModel: (config: WindowConfig) => void;
  onOpenConfigurator: () => void;
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  t,
  onSelectModel,
  onOpenConfigurator,
}) => {
  const seriesOrder: ProfileSeriesId[] = ['standard', 'comfort', 'premium'];

  return (
    <div className="space-y-12 pb-16">
      {/* Storefront Hero Section */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-5">
          <p className="text-xs font-bold tracking-wider uppercase text-[#D91E2A]">
            AKFI Deraza
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F172A] tracking-tight leading-tight text-balance">
            {t.catalog.heroTitle}
          </h1>
          <p className="text-base text-slate-600 max-w-2xl leading-relaxed">
            {t.catalog.heroSubtitle}
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={onOpenConfigurator}
              className="min-h-[48px] px-6 py-3 rounded-xl bg-[#D91E2A] hover:bg-[#B81620] text-white font-bold text-sm sm:text-base inline-flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
            >
              <span>{t.catalog.startConfiguring}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 flex items-center justify-center bg-[#F7F8FA] border border-slate-200/80 rounded-xl p-6">
          <WindowSchematicSVG
            config={CATALOG_MODELS[2].defaultConfig}
            showDimensions
            className="w-full max-w-[300px] h-auto"
          />
        </div>
      </section>

      {/* Window & Door Models Grid */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
              {t.catalog.modelsTitle}
            </h2>
            <p className="text-sm text-slate-600 mt-1">{t.catalog.modelsSubtitle}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATALOG_MODELS.map((preset) => {
            const meta = t.catalog.models[preset.id];
            const cfg = preset.defaultConfig;
            const samplePrice = calculateWindowPrice(cfg);

            return (
              <article
                key={preset.id}
                className="group bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md"
              >
                {/* SVG Elevation Frame */}
                <div className="bg-[#F4F6F9] border-b border-slate-200/80 p-6 flex items-center justify-center h-56">
                  <WindowSchematicSVG
                    config={cfg}
                    className="max-h-44 w-auto transition-transform duration-200 group-hover:scale-[1.02]"
                  />
                </div>

                {/* Card Details */}
                <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="text-xs font-medium text-slate-500 flex items-center gap-1.5 font-mono tabular-nums">
                      <span>
                        {cfg.widthMm} × {cfg.heightMm} mm
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>
                        {cfg.sashCount} {t.catalog.sashesLabel}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-[#0F172A]">{meta.name}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{meta.desc}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                    <div>
                      <span className="block text-[11px] font-medium text-slate-500">
                        {t.catalog.fromPrice}
                      </span>
                      <span className="text-base font-extrabold font-mono tabular-nums text-[#0F172A]">
                        {formatUZS(samplePrice.unitPrice, t.currency)}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onSelectModel(cfg)}
                      className="min-h-[42px] px-4 py-2 rounded-xl bg-[#0F172A] hover:bg-[#D91E2A] text-white text-xs sm:text-sm font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <span>{t.catalog.configureBtn}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* AKFA Profile Series Comparison */}
      <section className="space-y-6">
        <h2 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
          {t.catalog.seriesTitle}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {seriesOrder.map((seriesId) => {
            const spec = PROFILE_SERIES[seriesId];
            const copy = t.seriesNames[seriesId];

            return (
              <div
                key={seriesId}
                className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between gap-5"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-slate-500 font-mono">
                      {spec.chambers} {t.catalog.chambers} · {spec.depthMm} mm
                    </span>
                    <ShieldCheck className="w-4 h-4 text-[#D91E2A] shrink-0" />
                  </div>
                  <h3 className="text-xl font-extrabold text-[#0F172A]">{copy.name}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{copy.desc}</p>
                </div>

                <div className="space-y-2.5 pt-4 border-t border-slate-100 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>{t.catalog.thermal}</span>
                    <span className="font-mono font-semibold text-[#0F172A]">
                      {spec.thermalRating}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>{t.catalog.sound}</span>
                    <span className="font-mono font-semibold text-[#0F172A]">
                      {spec.soundInsulationDb} dB
                    </span>
                  </div>
                  <div className="pt-2 flex items-baseline justify-between">
                    <span className="text-slate-500 font-medium">{t.catalog.fromPrice}</span>
                    <span className="text-base font-extrabold font-mono tabular-nums text-[#D91E2A]">
                      {formatUZS(spec.pricePerM2, t.currency)}{' '}
                      <span className="text-xs font-normal text-slate-500">{t.catalog.perM2}</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
