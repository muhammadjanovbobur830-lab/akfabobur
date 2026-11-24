import type {
  ColorId,
  GlassType,
  HandleType,
  ModelPresetId,
  ProfileSeriesId,
  RoomType,
  SashOpeningType,
  WindowConfig,
} from '../types/window';

export const MIN_DIMENSION_MM = 400;
export const MAX_DIMENSION_MM = 3000;
export const MINIMUM_WINDOW_PRICE_UZS = 600000;

export interface ProfileSeriesSpec {
  id: ProfileSeriesId;
  chambers: number;
  depthMm: number;
  pricePerM2: number;
  thermalRating: string;
  soundInsulationDb: number;
}

export const PROFILE_SERIES: Record<ProfileSeriesId, ProfileSeriesSpec> = {
  standard: {
    id: 'standard',
    chambers: 3,
    depthMm: 60,
    pricePerM2: 650000,
    thermalRating: '0.64 m²·°C/W',
    soundInsulationDb: 31,
  },
  comfort: {
    id: 'comfort',
    chambers: 5,
    depthMm: 70,
    pricePerM2: 850000,
    thermalRating: '0.78 m²·°C/W',
    soundInsulationDb: 38,
  },
  premium: {
    id: 'premium',
    chambers: 7,
    depthMm: 80,
    pricePerM2: 1100000,
    thermalRating: '0.94 m²·°C/W',
    soundInsulationDb: 44,
  },
};

export interface ColorSpec {
  id: ColorId;
  hex: string;
  grainHex?: string;
  isWoodgrain: boolean;
  roughness: number;
  metalness: number;
}

export const PROFILE_COLORS: Record<ColorId, ColorSpec> = {
  white: {
    id: 'white',
    hex: '#F4F6F8',
    isWoodgrain: false,
    roughness: 0.35,
    metalness: 0.05,
  },
  brown: {
    id: 'brown',
    hex: '#4A2C1D',
    grainHex: '#351E12',
    isWoodgrain: true,
    roughness: 0.45,
    metalness: 0.05,
  },
  golden_oak: {
    id: 'golden_oak',
    hex: '#B8743B',
    grainHex: '#8E5322',
    isWoodgrain: true,
    roughness: 0.42,
    metalness: 0.04,
  },
  anthracite: {
    id: 'anthracite',
    hex: '#383E45',
    isWoodgrain: false,
    roughness: 0.38,
    metalness: 0.18,
  },
  black: {
    id: 'black',
    hex: '#1A1C1F',
    isWoodgrain: false,
    roughness: 0.32,
    metalness: 0.14,
  },
  walnut: {
    id: 'walnut',
    hex: '#5D3A24',
    grainHex: '#3B2213',
    isWoodgrain: true,
    roughness: 0.44,
    metalness: 0.05,
  },
  silver: {
    id: 'silver',
    hex: '#AEB4BC',
    isWoodgrain: false,
    roughness: 0.25,
    metalness: 0.55,
  },
};

export interface GlassSpec {
  id: GlassType;
  multiplier: number;
  tintHex: string;
  opacity: number;
  roughness: number;
  thicknessMm: number;
}

export const GLASS_OPTIONS: Record<GlassType, GlassSpec> = {
  single_chamber: {
    id: 'single_chamber',
    multiplier: 1.0,
    tintHex: '#DCEFF7',
    opacity: 0.24,
    roughness: 0.04,
    thicknessMm: 24,
  },
  double_chamber: {
    id: 'double_chamber',
    multiplier: 1.15,
    tintHex: '#CBE7F3',
    opacity: 0.28,
    roughness: 0.04,
    thicknessMm: 32,
  },
  low_e: {
    id: 'low_e',
    multiplier: 1.3,
    tintHex: '#BDE8DE',
    opacity: 0.32,
    roughness: 0.03,
    thicknessMm: 36,
  },
  frosted: {
    id: 'frosted',
    multiplier: 1.2,
    tintHex: '#EEF2F6',
    opacity: 0.78,
    roughness: 0.65,
    thicknessMm: 24,
  },
  tinted: {
    id: 'tinted',
    multiplier: 1.25,
    tintHex: '#3B4854',
    opacity: 0.52,
    roughness: 0.05,
    thicknessMm: 28,
  },
};

export const OPENING_FEES_UZS: Record<SashOpeningType, number> = {
  fixed: 0,
  open_left: 120000,
  open_right: 120000,
  tilt: 100000,
  open_bottom: 100000,
  tilt_turn_left: 180000,
  tilt_turn_right: 180000,
};

export const SASH_TYPES: SashOpeningType[] = [
  'fixed',
  'open_left',
  'open_right',
  'tilt',
  'tilt_turn_left',
  'tilt_turn_right',
  'open_bottom',
];

export const HANDLE_OPTIONS: HandleType[] = ['standard', 'key_lock', 'premium_metal'];

export interface CatalogModelPreset {
  id: ModelPresetId;
  defaultConfig: WindowConfig;
}

export const CATALOG_MODELS: CatalogModelPreset[] = [
  {
    id: 'single',
    defaultConfig: {
      modelId: 'single',
      isBalconyDoor: false,
      series: 'comfort',
      roomType: 'bedroom',
      widthMm: 900,
      heightMm: 1400,
      sashCount: 1,
      sashes: ['tilt_turn_right'],
      outerColor: 'white',
      innerColor: 'white',
      glassType: 'double_chamber',
      extras: {
        sill: true,
        mosquitoNet: true,
        drainEbb: true,
        installation: true,
        handleType: 'standard',
      },
      quantity: 1,
    },
  },
  {
    id: 'double',
    defaultConfig: {
      modelId: 'double',
      isBalconyDoor: false,
      series: 'comfort',
      roomType: 'bedroom',
      widthMm: 1450,
      heightMm: 1500,
      sashCount: 2,
      sashes: ['fixed', 'tilt_turn_right'],
      outerColor: 'white',
      innerColor: 'white',
      glassType: 'double_chamber',
      extras: {
        sill: true,
        mosquitoNet: true,
        drainEbb: true,
        installation: true,
        handleType: 'standard',
      },
      quantity: 1,
    },
  },
  {
    id: 'triple',
    defaultConfig: {
      modelId: 'triple',
      isBalconyDoor: false,
      series: 'comfort',
      roomType: 'living_room',
      widthMm: 2100,
      heightMm: 1550,
      sashCount: 3,
      sashes: ['tilt_turn_left', 'fixed', 'tilt_turn_right'],
      outerColor: 'white',
      innerColor: 'white',
      glassType: 'low_e',
      extras: {
        sill: true,
        mosquitoNet: true,
        drainEbb: true,
        installation: true,
        handleType: 'standard',
      },
      quantity: 1,
    },
  },
  {
    id: 'quad',
    defaultConfig: {
      modelId: 'quad',
      isBalconyDoor: false,
      series: 'premium',
      roomType: 'living_room',
      widthMm: 2700,
      heightMm: 1650,
      sashCount: 4,
      sashes: ['fixed', 'tilt_turn_left', 'tilt_turn_right', 'fixed'],
      outerColor: 'anthracite',
      innerColor: 'white',
      glassType: 'low_e',
      extras: {
        sill: true,
        mosquitoNet: true,
        drainEbb: true,
        installation: true,
        handleType: 'premium_metal',
      },
      quantity: 1,
    },
  },
  {
    id: 'balcony_door',
    defaultConfig: {
      modelId: 'balcony_door',
      isBalconyDoor: true,
      series: 'comfort',
      roomType: 'balcony',
      widthMm: 1500,
      heightMm: 2150,
      sashCount: 2,
      sashes: ['open_left', 'tilt_turn_right'],
      outerColor: 'white',
      innerColor: 'white',
      glassType: 'double_chamber',
      extras: {
        sill: true,
        mosquitoNet: false,
        drainEbb: true,
        installation: true,
        handleType: 'premium_metal',
      },
      quantity: 1,
    },
  },
  {
    id: 'fixed_window',
    defaultConfig: {
      modelId: 'fixed_window',
      isBalconyDoor: false,
      series: 'standard',
      roomType: 'office',
      widthMm: 1200,
      heightMm: 1400,
      sashCount: 1,
      sashes: ['fixed'],
      outerColor: 'white',
      innerColor: 'white',
      glassType: 'single_chamber',
      extras: {
        sill: true,
        mosquitoNet: false,
        drainEbb: true,
        installation: true,
        handleType: 'standard',
      },
      quantity: 1,
    },
  },
];

export const ROOM_PRESETS: Record<
  RoomType,
  Partial<WindowConfig> & {
    sashCount: 1 | 2 | 3 | 4;
    sashes: SashOpeningType[];
    widthMm: number;
    heightMm: number;
    series: ProfileSeriesId;
    glassType: GlassType;
    isBalconyDoor: boolean;
    modelId: ModelPresetId;
  }
> = {
  living_room: {
    modelId: 'triple',
    isBalconyDoor: false,
    series: 'comfort',
    widthMm: 2100,
    heightMm: 1550,
    sashCount: 3,
    sashes: ['tilt_turn_left', 'fixed', 'tilt_turn_right'],
    glassType: 'low_e',
    extras: {
      sill: true,
      mosquitoNet: true,
      drainEbb: true,
      installation: true,
      handleType: 'standard',
    },
  },
  bedroom: {
    modelId: 'double',
    isBalconyDoor: false,
    series: 'comfort',
    widthMm: 1450,
    heightMm: 1500,
    sashCount: 2,
    sashes: ['fixed', 'tilt_turn_right'],
    glassType: 'low_e',
    extras: {
      sill: true,
      mosquitoNet: true,
      drainEbb: true,
      installation: true,
      handleType: 'key_lock',
    },
  },
  kitchen: {
    modelId: 'double',
    isBalconyDoor: false,
    series: 'standard',
    widthMm: 1350,
    heightMm: 1400,
    sashCount: 2,
    sashes: ['fixed', 'tilt_turn_right'],
    glassType: 'double_chamber',
    extras: {
      sill: true,
      mosquitoNet: true,
      drainEbb: true,
      installation: true,
      handleType: 'standard',
    },
  },
  bathroom: {
    modelId: 'single',
    isBalconyDoor: false,
    series: 'standard',
    widthMm: 600,
    heightMm: 750,
    sashCount: 1,
    sashes: ['tilt'],
    glassType: 'frosted',
    extras: {
      sill: true,
      mosquitoNet: true,
      drainEbb: false,
      installation: true,
      handleType: 'standard',
    },
  },
  balcony: {
    modelId: 'balcony_door',
    isBalconyDoor: true,
    series: 'comfort',
    widthMm: 1550,
    heightMm: 2150,
    sashCount: 2,
    sashes: ['open_left', 'tilt_turn_right'],
    glassType: 'double_chamber',
    extras: {
      sill: true,
      mosquitoNet: false,
      drainEbb: true,
      installation: true,
      handleType: 'premium_metal',
    },
  },
  office: {
    modelId: 'triple',
    isBalconyDoor: false,
    series: 'premium',
    widthMm: 2200,
    heightMm: 1650,
    sashCount: 3,
    sashes: ['fixed', 'tilt_turn_right', 'fixed'],
    glassType: 'tinted',
    extras: {
      sill: true,
      mosquitoNet: false,
      drainEbb: true,
      installation: true,
      handleType: 'premium_metal',
    },
  },
};
