import { BodyColorKey, WheelFinishKey, CaliperColorKey } from '../types';

export interface PaintOption {
  id: BodyColorKey;
  name: string;
  category: 'Standard Atelier' | 'Heritage Exclusive' | 'Liquid Metal';
  price: number; // in INR
  hex: string;
  description: string;
}

export interface WheelConfigOption {
  id: WheelFinishKey;
  name: string;
  type: string;
  price: number;
  hex: string;
  description: string;
}

export interface CaliperConfigOption {
  id: CaliperColorKey;
  name: string;
  price: number;
  hex: string;
}

export interface InteriorThemeOption {
  id: string;
  name: string;
  price: number;
  palette: [string, string]; // primary, accent
  materials: string;
  description: string;
}

export interface CarbonAccentOption {
  id: string;
  name: string;
  price: number;
  finish: string;
  description: string;
}

export interface PerformancePackageOption {
  id: string;
  name: string;
  price: number;
  highlight: string;
  description: string;
}

export const PAINT_OPTIONS: PaintOption[] = [
  {
    id: 'noir',
    name: 'Obsidian Noir Carbon',
    category: 'Standard Atelier',
    price: 0,
    hex: '#0a0d12',
    description: 'Deep multi-stage metallic black with exposed twill carbon-fiber weave under clearcoat.',
  },
  {
    id: 'gold',
    name: 'Liquid Aurum Gold',
    category: 'Heritage Exclusive',
    price: 1850000,
    hex: '#D4AF37',
    description: 'Electrolytic 24-karat gold mica flakes suspended in high-gloss lacquer.',
  },
  {
    id: 'cyan',
    name: 'Quantum Cyan Electric',
    category: 'Liquid Metal',
    price: 2400000,
    hex: '#00D2FF',
    description: 'Signature electric cyan with pearlescent flip and high-saturation luminescence.',
  },
  {
    id: 'rosso',
    name: 'Rosso Corsa Competizione',
    category: 'Heritage Exclusive',
    price: 1600000,
    hex: '#D6001C',
    description: 'Pure racing vermilion developed on European circuits with high UV resistance.',
  },
  {
    id: 'bianco',
    name: 'Bianco Perlato Satin',
    category: 'Liquid Metal',
    price: 2100000,
    hex: '#F0F4F8',
    description: 'Subtle frosted satin white with iridescent diamond dust particles.',
  },
];

export const WHEEL_OPTIONS: WheelConfigOption[] = [
  {
    id: 'titanium',
    name: '21" Forged Billet Titanium',
    type: 'Monoblock Star Spoke',
    price: 0,
    hex: '#94a3b8',
    description: 'Cold-forged aerospace titanium alloy with diamond-cut outer perimeter.',
  },
  {
    id: 'stealth',
    name: '21" Stealth Carbon Aero',
    type: 'Carbon Turbine Rim',
    price: 1800000,
    hex: '#1e293b',
    description: 'Wind-tunnel tested carbon aero disc reducing drag at speeds over 250 km/h.',
  },
  {
    id: 'bronze',
    name: '21" Heritage Satin Bronze',
    type: 'Center-Lock Magnesium',
    price: 2200000,
    hex: '#b45309',
    description: 'Ultra-lightweight magnesium alloy with center-lock nut in anodized blue.',
  },
  {
    id: 'chrome',
    name: '21" Polished Mirror Chrome',
    type: 'Electro-Polished Alloy',
    price: 1500000,
    hex: '#e2e8f0',
    description: 'Hand-polished mirror surface treated with scratch-resistant ceramic coating.',
  },
];

export const CALIPER_OPTIONS: CaliperConfigOption[] = [
  { id: 'cyan', name: 'Quantum Cyan Acid', price: 0, hex: '#00E5FF' },
  { id: 'gold', name: 'Gilded 24K Gold', price: 650000, hex: '#FACC15' },
  { id: 'rosso', name: 'Competizione Red', price: 500000, hex: '#EF4444' },
  { id: 'noir', name: 'Stealth Matte Noir', price: 350000, hex: '#334155' },
];

export const INTERIOR_THEMES: InteriorThemeOption[] = [
  {
    id: 'nero-cyan',
    name: 'Nero Ade & Acid Cyan Stitching',
    price: 0,
    palette: ['#0f172a', '#00E5FF'],
    materials: 'Semi-aniline Scottish leather, black Alcantara, cyan contrast piping',
    description: 'The signature cockpit atmosphere balancing stealth cockpit focus with electric cyan highlights.',
  },
  {
    id: 'crema-titanium',
    name: 'Crema Imperial & Brushed Titanium',
    price: 1450000,
    palette: ['#f8fafc', '#94a3b8'],
    materials: 'Perforated ivory full-grain leather, polished billet titanium trim',
    description: 'Luminous luxury salon ambience favored for coastal grand touring and afternoon sunlight.',
  },
  {
    id: 'track-carbon',
    name: 'Pure Forged Carbon & Alcantara',
    price: 2100000,
    palette: ['#18181b', '#ef4444'],
    materials: 'Structural dry carbon bucket seats, high-grip Nomex racing Alcantara',
    description: 'Saves 38 kg in cabin weight with 6-point harness provisions and fire-resistant suede.',
  },
  {
    id: 'saddle-tan',
    name: 'Saddle Tan Heritage & Smoked Oak',
    price: 1800000,
    palette: ['#78350f', '#d97706'],
    materials: 'Hand-burnished vegetable-tanned leather, bookmatched smoked walnut',
    description: 'Timeless automotive tailoring inspired by vintage coachbuilt trans-European tourers.',
  },
];

export const CARBON_ACCENTS: CarbonAccentOption[] = [
  {
    id: 'gloss-twill',
    name: 'Gloss 3K Twill Carbon Weave',
    price: 0,
    finish: 'High-Gloss Clearcoat',
    description: 'Traditional symmetrical chevron weave with deep gloss reflection.',
  },
  {
    id: 'satin-forged',
    name: 'Forged Marble Carbon Matrix',
    price: 1200000,
    finish: 'Satin Matte Clearcoat',
    description: 'Randomized compressed carbon fiber flakes with a distinctive marbled finish.',
  },
  {
    id: 'gold-infused',
    name: 'Aurum Threaded Carbon Weave',
    price: 2800000,
    finish: '24K Gold Wire Weave',
    description: 'Ultra-rare textile weaving micro-fine 24-karat gold threads directly into carbon fibers.',
  },
];

export const PERFORMANCE_PACKAGES: PerformancePackageOption[] = [
  {
    id: 'track-pack',
    name: 'Atelier Nürburgring Track Telemetry Pack',
    price: 3200000,
    highlight: '+120 kg Downforce & Active Aerodynamic Splitter',
    description: 'Extended carbon dive planes, rear gurney flap, and satellite racing telemetry lap-timer.',
  },
  {
    id: 'exhaust-nitro',
    name: 'Titanium Inconel Exhaust & Overboost ECU',
    price: 2400000,
    highlight: '+85 BHP with High-Frequency Acoustic Resonance',
    description: '3D-printed titanium exhaust system shaving 14 kg with dual plasma flame igniters.',
  },
  {
    id: 'ceramic-brakes',
    name: 'Brembo Carbon-Silicon Matrix Brake Discs (420mm)',
    price: 2600000,
    highlight: 'Zero Fade Under 1.8G Deceleration',
    description: '10-piston front monoblock calipers with ceramic matrix pads rated up to 1,100°C.',
  },
  {
    id: 'concierge-track',
    name: 'Aura VIP Global Trackside Support (3 Years)',
    price: 1500000,
    highlight: 'Dedicated Factory Technician at Global Circuits',
    description: 'Private circuit transport, tire engineers, and factory telemetry analysis anywhere in Europe and Asia.',
  },
];
