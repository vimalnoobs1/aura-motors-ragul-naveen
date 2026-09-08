export type ShowroomMode = 'atelier' | 'midnight';

export type BodyColorKey = 'noir' | 'gold' | 'cyan' | 'rosso' | 'bianco';

export interface BodyColorOption {
  id: BodyColorKey;
  name: string;
  tagline: string;
  hex: string;
  metalness: number;
  roughness: number;
  clearcoat: number;
  clearcoatRoughness: number;
  textColor: string;
}

export type WheelFinishKey = 'stealth' | 'titanium' | 'bronze' | 'chrome';

export interface WheelOption {
  id: WheelFinishKey;
  name: string;
  hex: string;
}

export type CaliperColorKey = 'cyan' | 'gold' | 'rosso' | 'noir';

export interface CaliperOption {
  id: CaliperColorKey;
  name: string;
  hex: string;
}

export type CameraPreset = 'cinematic' | 'front' | 'side' | 'rear' | 'cockpit' | 'engine' | 'aero';

export interface PerformanceMetric {
  label: string;
  value: string;
  unit: string;
  detail: string;
  progress: number;
}

export interface VehicleState {
  color: BodyColorKey;
  wheelFinish: WheelFinishKey;
  caliperColor: CaliperColorKey;
  doorsOpen: boolean;
  wingAngle: 'retracted' | 'active' | 'airbrake'; // 0, 15, 45 degrees
  headlights: 'off' | 'drl' | 'full';
  underglow: boolean;
  showAeroFlow: boolean;
  turntableSpeed: number; // 0 = paused, 1 = normal, 2 = fast
  explodedView: boolean;
  nitroActive: boolean;
}

export interface AuraUser {
  id: string;
  username: string;
  name: string;
  role: string;
  clearance: string;
  clearanceLevel: number;
  status: 'ACTIVE' | 'STANDBY' | 'AUTHENTICATED';
  lastLogin: string;
  avatarSeed?: string;
  password?: string;
}

export interface DatabaseLog {
  id: string;
  timestamp: string;
  level: 'INFO' | 'SUCCESS' | 'WARN' | 'EXEC';
  message: string;
  latencyMs?: number;
}

export interface EmiCalculationResult {
  vehiclePrice: number;
  downPaymentPercent: number;
  downPaymentAmount: number;
  loanAmount: number;
  tenureMonths: number;
  interestRateAnnual: number;
  monthlyEmi: number;
  totalInterest: number;
  totalPayable: number;
}
