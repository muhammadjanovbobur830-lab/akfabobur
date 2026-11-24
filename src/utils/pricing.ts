import {
  GLASS_OPTIONS,
  MAX_DIMENSION_MM,
  MIN_DIMENSION_MM,
  MINIMUM_WINDOW_PRICE_UZS,
  OPENING_FEES_UZS,
  PROFILE_SERIES,
} from '../constants/catalog';
import type { PriceBreakdown, WindowConfig } from '../types/window';

const SILL_PRICE_PER_METER = 60000;
const MOSQUITO_NET_PRICE_PER_M2 = 90000;
const INSTALLATION_PRICE_PER_M2 = 150000;

/**
 * Pure, deterministic price calculator for AKFA windows & doors.
 * Formula:
 *   area_m2 = (width / 1000) * (height / 1000)
 *   base = area_m2 * series_price_per_m2
 *   glassSurcharge = base * (glassMultiplier - 1)
 *   openingFee = sum of opening fee per sash
 *   colorSurcharge = +12% on base profile price if any side is non-white
 *   dualColorSurcharge = +8% on base profile price if outerColor !== innerColor
 *   extras = sill (60,000/m) + mosquitoNet (90,000/m2) + installation (150,000/m2)
 *   unitPrice = max(600,000, subtotal)
 *   totalPrice = unitPrice * quantity
 */
export function calculateWindowPrice(config: WindowConfig): PriceBreakdown {
  const safeWidth = Number.isFinite(config.widthMm)
    ? Math.min(MAX_DIMENSION_MM, Math.max(MIN_DIMENSION_MM, config.widthMm))
    : MIN_DIMENSION_MM;

  const safeHeight = Number.isFinite(config.heightMm)
    ? Math.min(MAX_DIMENSION_MM, Math.max(MIN_DIMENSION_MM, config.heightMm))
    : MIN_DIMENSION_MM;

  const safeQty = Number.isFinite(config.quantity)
    ? Math.max(1, Math.floor(config.quantity))
    : 1;

  const areaM2 = (safeWidth / 1000) * (safeHeight / 1000);
  const seriesSpec = PROFILE_SERIES[config.series] ?? PROFILE_SERIES.standard;
  const glassSpec = GLASS_OPTIONS[config.glassType] ?? GLASS_OPTIONS.single_chamber;

  const baseProfilePrice = Math.round(areaM2 * seriesSpec.pricePerM2);
  const glassSurcharge = Math.round(baseProfilePrice * (glassSpec.multiplier - 1));

  const activeSashes = config.sashes.slice(0, config.sashCount);
  const openingFee = activeSashes.reduce((sum, sashType) => {
    return sum + (OPENING_FEES_UZS[sashType] ?? 0);
  }, 0);

  const hasColorLamination =
    config.outerColor !== 'white' || config.innerColor !== 'white';
  const colorSurcharge = hasColorLamination
    ? Math.round(baseProfilePrice * 0.12)
    : 0;

  const hasDualColor = config.outerColor !== config.innerColor;
  const dualColorSurcharge = hasDualColor
    ? Math.round(baseProfilePrice * 0.08)
    : 0;

  const sillPrice = config.extras.sill
    ? Math.round((safeWidth / 1000) * SILL_PRICE_PER_METER)
    : 0;

  const mosquitoNetPrice = config.extras.mosquitoNet
    ? Math.round(areaM2 * MOSQUITO_NET_PRICE_PER_M2)
    : 0;

  const installationPrice = config.extras.installation
    ? Math.round(areaM2 * INSTALLATION_PRICE_PER_M2)
    : 0;

  const subtotalBeforeMin =
    baseProfilePrice +
    glassSurcharge +
    openingFee +
    colorSurcharge +
    dualColorSurcharge +
    sillPrice +
    mosquitoNetPrice +
    installationPrice;

  const minimumApplied = subtotalBeforeMin < MINIMUM_WINDOW_PRICE_UZS;
  const unitPrice = Math.max(MINIMUM_WINDOW_PRICE_UZS, subtotalBeforeMin);
  const totalPrice = unitPrice * safeQty;

  return {
    areaM2,
    seriesPricePerM2: seriesSpec.pricePerM2,
    baseProfilePrice,
    glassMultiplier: glassSpec.multiplier,
    glassSurcharge,
    openingFee,
    colorSurcharge,
    dualColorSurcharge,
    sillPrice,
    mosquitoNetPrice,
    installationPrice,
    subtotalBeforeMin,
    minimumApplied,
    unitPrice,
    quantity: safeQty,
    totalPrice,
  };
}

/**
 * Formats UZS amounts with space thousands separator: e.g. "1 250 000 so'm"
 */
export function formatUZS(amount: number, currencyLabel = "so'm"): string {
  const safe = Number.isFinite(amount) ? Math.round(amount) : 0;
  const formattedNumber = safe
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `${formattedNumber} ${currencyLabel}`;
}
