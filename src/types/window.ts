export type Language = 'uz' | 'ru' | 'en';

export type AppView = 'catalog' | 'configurator' | 'cart' | 'orders' | 'success';

export type ProfileSeriesId = 'standard' | 'comfort' | 'premium';

export type SashOpeningType =
  | 'fixed'
  | 'open_left'
  | 'open_right'
  | 'tilt'
  | 'tilt_turn_left'
  | 'tilt_turn_right'
  | 'open_bottom';

export type RoomType =
  | 'living_room'
  | 'bedroom'
  | 'kitchen'
  | 'bathroom'
  | 'balcony'
  | 'office';

export type ColorId =
  | 'white'
  | 'brown'
  | 'golden_oak'
  | 'anthracite'
  | 'black'
  | 'walnut'
  | 'silver';

export type GlassType =
  | 'single_chamber'
  | 'double_chamber'
  | 'low_e'
  | 'frosted'
  | 'tinted';

export type HandleType = 'standard' | 'key_lock' | 'premium_metal';

export type ModelPresetId =
  | 'single'
  | 'double'
  | 'triple'
  | 'quad'
  | 'balcony_door'
  | 'fixed_window';

export interface WindowExtras {
  sill: boolean;
  mosquitoNet: boolean;
  drainEbb: boolean;
  installation: boolean;
  handleType: HandleType;
}

export interface WindowConfig {
  modelId: ModelPresetId;
  isBalconyDoor: boolean;
  series: ProfileSeriesId;
  roomType: RoomType;
  widthMm: number;
  heightMm: number;
  sashCount: 1 | 2 | 3 | 4;
  sashes: SashOpeningType[];
  outerColor: ColorId;
  innerColor: ColorId;
  glassType: GlassType;
  extras: WindowExtras;
  quantity: number;
}

export interface PriceBreakdown {
  areaM2: number;
  seriesPricePerM2: number;
  baseProfilePrice: number;
  glassMultiplier: number;
  glassSurcharge: number;
  openingFee: number;
  colorSurcharge: number;
  dualColorSurcharge: number;
  sillPrice: number;
  mosquitoNetPrice: number;
  installationPrice: number;
  subtotalBeforeMin: number;
  minimumApplied: boolean;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface CartItem {
  id: string;
  config: WindowConfig;
  price: PriceBreakdown;
  createdAt: string;
}

export interface OrderFormData {
  name: string;
  phone: string;
  address: string;
  roomNotes: string;
  measurementDate: string;
  comment: string;
}

export interface OrderRecord {
  orderNumber: string;
  createdAt: string;
  customer: OrderFormData;
  items: CartItem[];
  totalAmount: number;
  telegramSent: boolean;
}
