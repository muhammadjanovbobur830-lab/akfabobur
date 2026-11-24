import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  Camera,
  Check,
  Minus,
  Plus,
  ShoppingBag,
  Sparkles,
  X,
} from 'lucide-react';
import {
  GLASS_OPTIONS,
  HANDLE_OPTIONS,
  MAX_DIMENSION_MM,
  MIN_DIMENSION_MM,
  PROFILE_COLORS,
  PROFILE_SERIES,
  ROOM_PRESETS,
  SASH_TYPES,
} from '../constants/catalog';
import type { TranslationDict } from '../i18n/translations';
import type {
  ColorId,
  GlassType,
  ProfileSeriesId,
  RoomType,
  SashOpeningType,
  WindowConfig,
} from '../types/window';
import { calculateWindowPrice, formatUZS } from '../utils/pricing';
import { WallFitScanner } from './WallFitScanner';
import { SashSymbolSVG } from './WindowSchematicSVG';
import { WindowViewer3D } from './WindowViewer3D';

interface ConfiguratorViewProps {
  config: WindowConfig;
  isEditing: boolean;
  t: TranslationDict;
  onChange: (next: WindowConfig) => void;
  onAddToOrder: (config: WindowConfig) => void;
  onCancelEdit: () => void;
  onGoToCart: () => void;
}

const ROOM_LIST: RoomType[] = [
  'living_room',
  'bedroom',
  'kitchen',
  'bathroom',
  'balcony',
  'office',
];

const COLOR_LIST: ColorId[] = [
  'white',
  'brown',
  'golden_oak',
  'anthracite',
  'black',
  'walnut',
  'silver',
];

const GLASS_LIST: GlassType[] = [
  'single_chamber',
  'double_chamber',
  'low_e',
  'frosted',
  'tinted',
];

const SERIES_LIST: ProfileSeriesId[] = ['standard', 'comfort', 'premium'];

export const ConfiguratorView: React.FC<ConfiguratorViewProps> = ({
  config,
  isEditing,
  t,
  onChange,
  onAddToOrder,
  onCancelEdit,
  onGoToCart,
}) => {
  const [widthInput, setWidthInput] = useState<string>(String(config.widthMm));
  const [heightInput, setHeightInput] = useState<string>(String(config.heightMm));
  const [widthError, setWidthError] = useState<string>('');
  const [heightError, setHeightError] = useState<string>('');
  const [roomSuggestionNote, setRoomSuggestionNote] = useState<RoomType | null>(null);
  const [justAdded, setJustAdded] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);

  // Sync text inputs when preset/room updates config externally
  React.useEffect(() => {
    setWidthInput(String(config.widthMm));
    setWidthError('');
  }, [config.widthMm]);

  React.useEffect(() => {
    setHeightInput(String(config.heightMm));
    setHeightError('');
  }, [config.heightMm]);

  const breakdown = useMemo(() => calculateWindowPrice(config), [config]);

  const handleRoomSelect = (room: RoomType) => {
    const preset = ROOM_PRESETS[room];
    onChange({
      ...config,
      roomType: room,
      modelId: preset.modelId,
      isBalconyDoor: preset.isBalconyDoor,
      series: preset.series,
      widthMm: preset.widthMm,
      heightMm: preset.heightMm,
      sashCount: preset.sashCount,
      sashes: [...preset.sashes],
      glassType: preset.glassType,
      extras: preset.extras ? { ...config.extras, ...preset.extras } : config.extras,
    });
    setRoomSuggestionNote(room);
  };

  const handleSashCountChange = (count: 1 | 2 | 3 | 4) => {
    const nextSashes: SashOpeningType[] = [...config.sashes];
    while (nextSashes.length < count) {
      nextSashes.push(nextSashes.length === 0 ? 'tilt_turn_right' : 'fixed');
    }
    const modelMap: Record<1 | 2 | 3 | 4, WindowConfig['modelId']> = {
      1: nextSashes[0] === 'fixed' ? 'fixed_window' : 'single',
      2: config.isBalconyDoor ? 'balcony_door' : 'double',
      3: 'triple',
      4: 'quad',
    };
    onChange({
      ...config,
      sashCount: count,
      sashes: nextSashes.slice(0, count),
      modelId: modelMap[count],
    });
  };

  const handleSashTypeChange = (index: number, type: SashOpeningType) => {
    const nextSashes = [...config.sashes];
    nextSashes[index] = type;
    onChange({ ...config, sashes: nextSashes });
  };

  const handleDimensionInput = (axis: 'width' | 'height', raw: string) => {
    if (axis === 'width') setWidthInput(raw);
    else setHeightInput(raw);

    if (raw.trim() === '') {
      if (axis === 'width') setWidthError(t.configurator.rangeError);
      else setHeightError(t.configurator.rangeError);
      return;
    }

    const parsed = Number(raw);
    if (!Number.isFinite(parsed) || parsed < MIN_DIMENSION_MM || parsed > MAX_DIMENSION_MM) {
      if (axis === 'width') setWidthError(t.configurator.rangeError);
      else setHeightError(t.configurator.rangeError);
      return;
    }

    const rounded = Math.round(parsed);
    if (axis === 'width') {
      setWidthError('');
      onChange({ ...config, widthMm: rounded });
    } else {
      setHeightError('');
      onChange({ ...config, heightMm: rounded });
    }
  };

  const handleDimensionBlur = (axis: 'width' | 'height') => {
    const raw = axis === 'width' ? widthInput : heightInput;
    const parsed = Number(raw);
    if (!Number.isFinite(parsed) || raw.trim() === '') {
      if (axis === 'width') {
        setWidthInput(String(config.widthMm));
        setWidthError('');
      } else {
        setHeightInput(String(config.heightMm));
        setHeightError('');
      }
      return;
    }
    const clamped = Math.min(MAX_DIMENSION_MM, Math.max(MIN_DIMENSION_MM, Math.round(parsed)));
    if (axis === 'width') {
      setWidthInput(String(clamped));
      setWidthError('');
      onChange({ ...config, widthMm: clamped });
    } else {
      setHeightInput(String(clamped));
      setHeightError('');
      onChange({ ...config, heightMm: clamped });
    }
  };

  const handleQuantityChange = (nextQty: number) => {
    const safe = Number.isFinite(nextQty) ? Math.max(1, Math.min(99, Math.floor(nextQty))) : 1;
    onChange({ ...config, quantity: safe });
  };

  const handleSubmitOrderItem = () => {
    onAddToOrder(config);
    if (!isEditing) {
      setJustAdded(true);
      window.setTimeout(() => setJustAdded(false), 3200);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Page Title / Editing Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
            {t.configurator.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-mono tabular-nums">
            {t.seriesNames[config.series].name} · {config.widthMm} × {config.heightMm} mm ·{' '}
            {breakdown.areaM2.toFixed(2)} m²
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setScannerOpen(true)}
            className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[#0F172A] hover:bg-[#D91E2A] text-white text-xs sm:text-sm font-bold inline-flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
          >
            <Camera className="w-4 h-4" />
            <span>{t.wallScanner.openButton}</span>
          </button>

          {isEditing && (
            <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-900">
              <span>{t.configurator.editingBanner}</span>
              <button
                type="button"
                onClick={onCancelEdit}
                className="inline-flex items-center gap-1 text-amber-700 hover:text-amber-950 underline cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>{t.configurator.cancelEdit}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Split Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* LEFT COLUMN (Sticky on desktop): 3D/2D Viewer + Live Price Breakdown */}
        <div className="lg:col-span-6 xl:col-span-7 lg:sticky lg:top-20 space-y-5">
          <WindowViewer3D config={config} t={t} />

          {/* Live Price Breakdown Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-base font-extrabold text-[#0F172A]">{t.pricing.title}</h2>
              <span className="text-xs font-mono text-slate-500 tabular-nums">
                {breakdown.areaM2.toFixed(2)} m² × {formatUZS(breakdown.seriesPricePerM2, t.currency)}
              </span>
            </div>

            <div className="divide-y divide-slate-100 text-sm">
              <div className="py-2 flex items-center justify-between gap-2">
                <span className="text-slate-600">{t.pricing.baseProfile}</span>
                <span className="font-mono tabular-nums font-semibold text-[#0F172A]">
                  {formatUZS(breakdown.baseProfilePrice, t.currency)}
                </span>
              </div>

              {breakdown.glassSurcharge > 0 && (
                <div className="py-2 flex items-center justify-between gap-2">
                  <span className="text-slate-600">
                    {t.pricing.glassOption} (×{breakdown.glassMultiplier.toFixed(2)})
                  </span>
                  <span className="font-mono tabular-nums font-semibold text-[#0F172A]">
                    +{formatUZS(breakdown.glassSurcharge, t.currency)}
                  </span>
                </div>
              )}

              <div className="py-2 flex items-center justify-between gap-2">
                <span className="text-slate-600">{t.pricing.openingMechanisms}</span>
                <span className="font-mono tabular-nums font-semibold text-[#0F172A]">
                  {breakdown.openingFee > 0
                    ? `+${formatUZS(breakdown.openingFee, t.currency)}`
                    : formatUZS(0, t.currency)}
                </span>
              </div>

              {breakdown.colorSurcharge > 0 && (
                <div className="py-2 flex items-center justify-between gap-2">
                  <span className="text-slate-600">{t.pricing.colorLamination}</span>
                  <span className="font-mono tabular-nums font-semibold text-[#0F172A]">
                    +{formatUZS(breakdown.colorSurcharge, t.currency)}
                  </span>
                </div>
              )}

              {breakdown.dualColorSurcharge > 0 && (
                <div className="py-2 flex items-center justify-between gap-2">
                  <span className="text-slate-600">{t.pricing.dualColorFee}</span>
                  <span className="font-mono tabular-nums font-semibold text-[#0F172A]">
                    +{formatUZS(breakdown.dualColorSurcharge, t.currency)}
                  </span>
                </div>
              )}

              {breakdown.sillPrice > 0 && (
                <div className="py-2 flex items-center justify-between gap-2">
                  <span className="text-slate-600">{t.pricing.sill}</span>
                  <span className="font-mono tabular-nums font-semibold text-[#0F172A]">
                    +{formatUZS(breakdown.sillPrice, t.currency)}
                  </span>
                </div>
              )}

              {breakdown.mosquitoNetPrice > 0 && (
                <div className="py-2 flex items-center justify-between gap-2">
                  <span className="text-slate-600">{t.pricing.mosquitoNet}</span>
                  <span className="font-mono tabular-nums font-semibold text-[#0F172A]">
                    +{formatUZS(breakdown.mosquitoNetPrice, t.currency)}
                  </span>
                </div>
              )}

              {breakdown.installationPrice > 0 && (
                <div className="py-2 flex items-center justify-between gap-2">
                  <span className="text-slate-600">{t.pricing.installation}</span>
                  <span className="font-mono tabular-nums font-semibold text-[#0F172A]">
                    +{formatUZS(breakdown.installationPrice, t.currency)}
                  </span>
                </div>
              )}
            </div>

            {breakdown.minimumApplied && (
              <p className="text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                {t.pricing.minPriceApplied}
              </p>
            )}

            {/* Grand Total & Action Row */}
            <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs text-slate-500 flex items-center gap-2 font-mono tabular-nums">
                  <span>
                    {t.pricing.unitPrice}: {formatUZS(breakdown.unitPrice, t.currency)}
                  </span>
                  <span>×</span>
                  <span>{breakdown.quantity}</span>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono tabular-nums text-[#0F172A] mt-0.5">
                  {formatUZS(breakdown.totalPrice, t.currency)}
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleSubmitOrderItem}
                  className="min-h-[48px] flex-1 sm:flex-initial px-6 py-3 rounded-xl bg-[#D91E2A] hover:bg-[#B81620] text-white font-bold text-sm sm:text-base inline-flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>
                    {isEditing ? t.configurator.updateCartItem : t.configurator.addToOrder}
                  </span>
                </button>
              </div>
            </div>

            {justAdded && (
              <div className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm font-semibold text-emerald-900">
                <span className="inline-flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                  {t.configurator.addedToast}
                </span>
                <button
                  type="button"
                  onClick={onGoToCart}
                  className="underline font-bold text-emerald-800 hover:text-emerald-950 cursor-pointer whitespace-nowrap"
                >
                  {t.configurator.goToCart}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Configuration Controls */}
        <div className="lg:col-span-6 xl:col-span-5 space-y-6">
          {/* 1. Room Type Auto-Suggestion */}
          <section className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3.5">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-extrabold text-[#0F172A]">
                {t.configurator.roomSection}
              </h2>
              <Sparkles className="w-4 h-4 text-[#D91E2A] shrink-0" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {ROOM_LIST.map((room) => {
                const active = config.roomType === room;
                return (
                  <button
                    key={room}
                    type="button"
                    onClick={() => handleRoomSelect(room)}
                    className={`min-h-[42px] px-3 py-2 rounded-xl text-xs font-bold border text-left transition-colors cursor-pointer ${
                      active
                        ? 'bg-[#0F172A] text-white border-[#0F172A]'
                        : 'bg-[#F8FAFC] text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {t.rooms[room].name}
                  </button>
                );
              })}
            </div>

            {roomSuggestionNote && (
              <p className="text-xs text-slate-600 bg-[#F4F6F9] rounded-xl px-3 py-2 leading-relaxed">
                <strong className="text-[#0F172A]">
                  {t.configurator.autoAppliedNote} {t.rooms[roomSuggestionNote].name}:
                </strong>{' '}
                {t.rooms[roomSuggestionNote].tip}
              </p>
            )}
          </section>

          {/* 2. Dimensions (Width & Height Sliders + Inputs) */}
          <section className="bg-white border border-slate-200 rounded-2xl p-5 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-[#0F172A]">
                {t.configurator.dimensionsSection}
              </h2>
              <span className="text-xs font-mono font-semibold text-slate-500 tabular-nums">
                {t.configurator.areaLabel}: {breakdown.areaM2.toFixed(2)} m²
              </span>
            </div>

            {/* Width */}
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <label
                  htmlFor="cfg-width-num"
                  className="text-xs font-bold text-slate-700"
                >
                  {t.configurator.widthLabel}
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    id="cfg-width-num"
                    type="number"
                    min={MIN_DIMENSION_MM}
                    max={MAX_DIMENSION_MM}
                    step={10}
                    value={widthInput}
                    onChange={(e) => handleDimensionInput('width', e.target.value)}
                    onBlur={() => handleDimensionBlur('width')}
                    className={`w-24 px-2.5 py-1.5 text-right text-sm font-mono tabular-nums font-bold rounded-lg border focus:outline-none ${
                      widthError
                        ? 'border-[#D91E2A] bg-red-50 text-[#D91E2A]'
                        : 'border-slate-300 bg-[#F8FAFC] text-[#0F172A] focus:border-[#0F172A]'
                    }`}
                  />
                  <span className="text-xs font-mono text-slate-500">mm</span>
                </div>
              </div>
              <input
                type="range"
                aria-label={t.configurator.widthLabel}
                min={MIN_DIMENSION_MM}
                max={MAX_DIMENSION_MM}
                step={10}
                value={config.widthMm}
                onChange={(e) => handleDimensionInput('width', e.target.value)}
                className="w-full akfa-slider"
              />
              {widthError && (
                <p className="text-xs font-semibold text-[#D91E2A] flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{widthError}</span>
                </p>
              )}
            </div>

            {/* Height */}
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <label
                  htmlFor="cfg-height-num"
                  className="text-xs font-bold text-slate-700"
                >
                  {t.configurator.heightLabel}
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    id="cfg-height-num"
                    type="number"
                    min={MIN_DIMENSION_MM}
                    max={MAX_DIMENSION_MM}
                    step={10}
                    value={heightInput}
                    onChange={(e) => handleDimensionInput('height', e.target.value)}
                    onBlur={() => handleDimensionBlur('height')}
                    className={`w-24 px-2.5 py-1.5 text-right text-sm font-mono tabular-nums font-bold rounded-lg border focus:outline-none ${
                      heightError
                        ? 'border-[#D91E2A] bg-red-50 text-[#D91E2A]'
                        : 'border-slate-300 bg-[#F8FAFC] text-[#0F172A] focus:border-[#0F172A]'
                    }`}
                  />
                  <span className="text-xs font-mono text-slate-500">mm</span>
                </div>
              </div>
              <input
                type="range"
                aria-label={t.configurator.heightLabel}
                min={MIN_DIMENSION_MM}
                max={MAX_DIMENSION_MM}
                step={10}
                value={config.heightMm}
                onChange={(e) => handleDimensionInput('height', e.target.value)}
                className="w-full akfa-slider"
              />
              {heightError && (
                <p className="text-xs font-semibold text-[#D91E2A] flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{heightError}</span>
                </p>
              )}
            </div>
          </section>

          {/* 3. Sash Count & Per-Sash Opening Mechanism */}
          <section className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
            <h2 className="text-sm font-extrabold text-[#0F172A]">
              {t.configurator.modelAndSashes}
            </h2>

            {/* Sash count 1/2/3/4 */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-500">
                {t.configurator.sashCount}
              </span>
              <div className="grid grid-cols-4 gap-2">
                {([1, 2, 3, 4] as const).map((cnt) => {
                  const active = config.sashCount === cnt;
                  return (
                    <button
                      key={cnt}
                      type="button"
                      onClick={() => handleSashCountChange(cnt)}
                      className={`min-h-[44px] rounded-xl font-mono font-bold text-sm border transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#0F172A] text-white border-[#0F172A]'
                          : 'bg-[#F8FAFC] text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {cnt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Balcony Door mode toggle */}
            <label className="flex items-center justify-between gap-3 pt-1 cursor-pointer">
              <span className="text-xs font-semibold text-slate-700">
                {t.configurator.balconyDoorMode}
              </span>
              <input
                type="checkbox"
                checked={config.isBalconyDoor}
                onChange={(e) =>
                  onChange({
                    ...config,
                    isBalconyDoor: e.target.checked,
                    heightMm:
                      e.target.checked && config.heightMm < 1900 ? 2150 : config.heightMm,
                  })
                }
                className="w-5 h-5 accent-[#D91E2A] rounded cursor-pointer"
              />
            </label>

            {/* Independent Sash Opening Types with Triangle Diagrams */}
            <div className="pt-2 border-t border-slate-100 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {t.configurator.sashConfigSection}
              </h3>

              {Array.from({ length: config.sashCount }).map((_, idx) => {
                const currentType = config.sashes[idx] ?? 'fixed';
                return (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#0F172A]">
                        {t.configurator.sashNumber} #{idx + 1}
                      </span>
                      <span className="text-slate-500 font-medium">
                        {t.sashTypes[currentType].name}
                      </span>
                    </div>
                    <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                      {SASH_TYPES.map((sashOpt) => {
                        const selected = currentType === sashOpt;
                        return (
                          <button
                            key={sashOpt}
                            type="button"
                            onClick={() => handleSashTypeChange(idx, sashOpt)}
                            title={t.sashTypes[sashOpt].name}
                            className={`p-1.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer min-h-[58px] ${
                              selected
                                ? 'bg-[#D91E2A]/10 border-[#D91E2A] text-[#D91E2A]'
                                : 'bg-[#F8FAFC] border-slate-200 text-slate-600 hover:border-slate-300'
                            }`}
                          >
                            <SashSymbolSVG type={sashOpt} size={24} />
                            <span className="text-[10px] font-semibold leading-none text-center truncate w-full">
                              {t.sashTypes[sashOpt].short}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 4. AKFA Profile Series */}
          <section className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
            <h2 className="text-sm font-extrabold text-[#0F172A]">
              {t.configurator.seriesSection}
            </h2>
            <div className="grid grid-cols-1 gap-2.5">
              {SERIES_LIST.map((sId) => {
                const spec = PROFILE_SERIES[sId];
                const copy = t.seriesNames[sId];
                const active = config.series === sId;

                return (
                  <button
                    key={sId}
                    type="button"
                    onClick={() => onChange({ ...config, series: sId })}
                    className={`p-3.5 rounded-xl border text-left flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                      active
                        ? 'bg-[#0F172A] text-white border-[#0F172A]'
                        : 'bg-[#F8FAFC] text-[#0F172A] border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-sm">{copy.name}</div>
                      <div
                        className={`text-xs mt-0.5 ${active ? 'text-slate-300' : 'text-slate-500'}`}
                      >
                        {copy.tag}
                      </div>
                    </div>
                    <div className="font-mono tabular-nums text-xs sm:text-sm font-bold shrink-0">
                      {formatUZS(spec.pricePerM2, t.currency)} {t.catalog.perM2}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* 5. Dual-Sided Lamination Colors */}
          <section className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-extrabold text-[#0F172A]">
                {t.configurator.colorsSection}
              </h2>
              {config.outerColor !== config.innerColor && (
                <span className="text-[11px] font-bold text-[#D91E2A]">
                  {t.configurator.dualColorBadge}
                </span>
              )}
            </div>

            {/* Outer Color */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">{t.configurator.outerColor}</span>
                <span className="font-medium text-slate-500">
                  {t.colors[config.outerColor]}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {COLOR_LIST.map((cid) => {
                  const spec = PROFILE_COLORS[cid];
                  const selected = config.outerColor === cid;
                  return (
                    <button
                      key={`outer-${cid}`}
                      type="button"
                      onClick={() => onChange({ ...config, outerColor: cid })}
                      title={t.colors[cid]}
                      className={`min-h-[40px] px-2.5 py-1.5 rounded-xl border inline-flex items-center gap-2 text-xs font-semibold transition-all cursor-pointer ${
                        selected
                          ? 'border-[#D91E2A] ring-2 ring-[#D91E2A]/20 bg-white text-[#0F172A]'
                          : 'border-slate-200 bg-[#F8FAFC] text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full border border-slate-300 shrink-0"
                        style={{
                          background: spec.isWoodgrain
                            ? `repeating-linear-gradient(135deg, ${spec.hex}, ${spec.hex} 3px, ${spec.grainHex} 3px, ${spec.grainHex} 5px)`
                            : spec.hex,
                        }}
                      />
                      <span>{t.colors[cid]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Inner Color */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">{t.configurator.innerColor}</span>
                <div className="flex items-center gap-3">
                  {config.innerColor !== config.outerColor && (
                    <button
                      type="button"
                      onClick={() => onChange({ ...config, innerColor: config.outerColor })}
                      className="text-[#D91E2A] font-semibold hover:underline cursor-pointer"
                    >
                      {t.configurator.sameAsOuter}
                    </button>
                  )}
                  <span className="font-medium text-slate-500">
                    {t.colors[config.innerColor]}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {COLOR_LIST.map((cid) => {
                  const spec = PROFILE_COLORS[cid];
                  const selected = config.innerColor === cid;
                  return (
                    <button
                      key={`inner-${cid}`}
                      type="button"
                      onClick={() => onChange({ ...config, innerColor: cid })}
                      title={t.colors[cid]}
                      className={`min-h-[40px] px-2.5 py-1.5 rounded-xl border inline-flex items-center gap-2 text-xs font-semibold transition-all cursor-pointer ${
                        selected
                          ? 'border-[#D91E2A] ring-2 ring-[#D91E2A]/20 bg-white text-[#0F172A]'
                          : 'border-slate-200 bg-[#F8FAFC] text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full border border-slate-300 shrink-0"
                        style={{
                          background: spec.isWoodgrain
                            ? `repeating-linear-gradient(135deg, ${spec.hex}, ${spec.hex} 3px, ${spec.grainHex} 3px, ${spec.grainHex} 5px)`
                            : spec.hex,
                        }}
                      />
                      <span>{t.colors[cid]}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* 6. Glass Unit Options */}
          <section className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
            <h2 className="text-sm font-extrabold text-[#0F172A]">
              {t.configurator.glassSection}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {GLASS_LIST.map((gId) => {
                const spec = GLASS_OPTIONS[gId];
                const copy = t.glass[gId];
                const active = config.glassType === gId;

                return (
                  <button
                    key={gId}
                    type="button"
                    onClick={() => onChange({ ...config, glassType: gId })}
                    className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                      active
                        ? 'bg-[#0F172A] text-white border-[#0F172A]'
                        : 'bg-[#F8FAFC] text-[#0F172A] border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold">{copy.name}</span>
                      <span
                        className={`text-[11px] font-mono font-bold ${
                          active ? 'text-slate-300' : 'text-slate-500'
                        }`}
                      >
                        ×{spec.multiplier.toFixed(2)}
                      </span>
                    </div>
                    <div
                      className={`text-[11px] mt-0.5 ${
                        active ? 'text-slate-300' : 'text-slate-500'
                      }`}
                    >
                      {copy.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* 7. Extras, Handle Type & Quantity */}
          <section className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
            <h2 className="text-sm font-extrabold text-[#0F172A]">
              {t.configurator.extrasSection}
            </h2>

            <div className="space-y-2.5">
              {/* Sill */}
              <label className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[#F8FAFC] border border-slate-200 cursor-pointer">
                <div>
                  <div className="text-xs font-bold text-[#0F172A]">
                    {t.configurator.sillLabel}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    {t.configurator.sillRate}
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={config.extras.sill}
                  onChange={(e) =>
                    onChange({
                      ...config,
                      extras: { ...config.extras, sill: e.target.checked },
                    })
                  }
                  className="w-5 h-5 accent-[#D91E2A] rounded cursor-pointer"
                />
              </label>

              {/* Mosquito Net */}
              <label className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[#F8FAFC] border border-slate-200 cursor-pointer">
                <div>
                  <div className="text-xs font-bold text-[#0F172A]">
                    {t.configurator.netLabel}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    {t.configurator.netRate}
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={config.extras.mosquitoNet}
                  onChange={(e) =>
                    onChange({
                      ...config,
                      extras: { ...config.extras, mosquitoNet: e.target.checked },
                    })
                  }
                  className="w-5 h-5 accent-[#D91E2A] rounded cursor-pointer"
                />
              </label>

              {/* Drain / Ebb */}
              <label className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[#F8FAFC] border border-slate-200 cursor-pointer">
                <div>
                  <div className="text-xs font-bold text-[#0F172A]">
                    {t.configurator.drainLabel}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {t.configurator.drainDesc}
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={config.extras.drainEbb}
                  onChange={(e) =>
                    onChange({
                      ...config,
                      extras: { ...config.extras, drainEbb: e.target.checked },
                    })
                  }
                  className="w-5 h-5 accent-[#D91E2A] rounded cursor-pointer"
                />
              </label>

              {/* Installation */}
              <label className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[#F8FAFC] border border-slate-200 cursor-pointer">
                <div>
                  <div className="text-xs font-bold text-[#0F172A]">
                    {t.configurator.installLabel}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    {t.configurator.installRate}
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={config.extras.installation}
                  onChange={(e) =>
                    onChange({
                      ...config,
                      extras: { ...config.extras, installation: e.target.checked },
                    })
                  }
                  className="w-5 h-5 accent-[#D91E2A] rounded cursor-pointer"
                />
              </label>
            </div>

            {/* Handle Type */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700">
                {t.configurator.handleLabel}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {HANDLE_OPTIONS.map((hId) => {
                  const active = config.extras.handleType === hId;
                  return (
                    <button
                      key={hId}
                      type="button"
                      onClick={() =>
                        onChange({
                          ...config,
                          extras: { ...config.extras, handleType: hId },
                        })
                      }
                      className={`min-h-[42px] px-3 py-2 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#0F172A] text-white border-[#0F172A]'
                          : 'bg-[#F8FAFC] text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {t.handles[hId]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Stepper */}
            <div className="flex items-center justify-between gap-4 pt-3 border-t border-slate-100">
              <span className="text-xs font-bold text-[#0F172A]">
                {t.configurator.quantityLabel}
              </span>
              <div className="inline-flex items-center gap-1 bg-[#F8FAFC] border border-slate-200 rounded-xl p-1">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => handleQuantityChange(config.quantity - 1)}
                  className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[#0F172A] hover:bg-slate-50 cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  min={1}
                  max={99}
                  value={config.quantity}
                  onChange={(e) => handleQuantityChange(Number(e.target.value))}
                  aria-label={t.configurator.quantityLabel}
                  className="w-14 text-center font-mono tabular-nums font-bold text-sm text-[#0F172A] bg-transparent focus:outline-none"
                />
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => handleQuantityChange(config.quantity + 1)}
                  className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[#0F172A] hover:bg-slate-50 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>

      {scannerOpen && (
        <WallFitScanner
          config={config}
          t={t}
          onChangeConfig={onChange}
          onClose={() => setScannerOpen(false)}
        />
      )}
    </div>
  );
};
