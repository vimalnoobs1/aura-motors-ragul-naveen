import React, { useState } from 'react';
import { VehicleSpec } from '../data/vehicles';
import { Box } from 'lucide-react';
import { engineSound } from '../audio/engineSound';

interface VehicleDetailSectionProps {
  vehicle: VehicleSpec;
  onOpen3DShowroom: () => void;
  onOpenConfigurator: () => void;
}

type PillarTab = 'exterior' | 'interior' | 'performance' | 'engineering';

export const VehicleDetailSection: React.FC<VehicleDetailSectionProps> = ({
  vehicle,
  onOpen3DShowroom,
  onOpenConfigurator,
}) => {
  const [activeTab, setActiveTab] = useState<PillarTab>('exterior');

  const pillars: { id: PillarTab; label: string }[] = [
    { id: 'exterior', label: 'EXTERIOR' },
    { id: 'interior', label: 'INTERIOR' },
    { id: 'performance', label: 'PERFORMANCE' },
    { id: 'engineering', label: 'ENGINEERING' },
  ];

  const pillarData = {
    exterior: {
      tag: 'AERODYNAMIC ARCHITECTURE',
      specs: [
        { value: '0.28', unit: 'Cd', label: 'DRAG COEFFICIENT' },
        { value: '820', unit: 'KG', label: 'DOWNFORCE @ 300 KM/H' },
        { value: '100%', unit: 'PREPREG', label: 'CARBON MONOCOQUE' },
        { value: 'DUAL', unit: 'PLANE', label: 'ACTIVE AIRBRAKE' },
      ],
      highlights: ['Prepreg Autoclave Weave', 'Active Venturi Channels', 'Dihedral Sync Doors'],
    },
    interior: {
      tag: 'BESPOKE COCKPIT',
      specs: [
        { value: '100%', unit: 'SEMI-ANILINE', label: 'SCOTTISH LEATHER' },
        { value: 'SOLID', unit: 'MILLED', label: 'TITANIUM SWITCHGEAR' },
        { value: '128', unit: 'CHANNEL', label: 'ACTIVE NOISE CANCEL' },
        { value: 'CARBON', unit: 'SHELL', label: 'RACE MONOCOQUE SEATS' },
      ],
      highlights: ['Haptic Titanium Controls', 'Optical-Grade Glass Cockpit', 'Hand-Stitched Alcantara'],
    },
    performance: {
      tag: 'POWERTRAIN DYNAMICS',
      specs: [
        { value: `${vehicle.powerBhp}`, unit: 'BHP', label: 'PEAK OUTPUT' },
        { value: `${vehicle.acceleration0to100}`, unit: 'SEC', label: '0–100 KM/H' },
        { value: `${vehicle.topSpeedKmh}`, unit: 'KM/H', label: 'V-MAX SPEED' },
        { value: `${vehicle.torqueNm}`, unit: 'NM', label: 'INSTANT TORQUE' },
      ],
      highlights: ['Catapult Launch Protocol', 'Quad In-Wheel Vectoring', 'Silicon Carbide Inverters'],
    },
    engineering: {
      tag: 'CHASSIS DYNAMICS',
      specs: [
        { value: '65,000', unit: 'NM / DEG', label: 'TORSIONAL RIGIDITY' },
        { value: `${vehicle.curbWeightKg}`, unit: 'KG', label: 'DRY CURB MASS' },
        { value: `${vehicle.powerToWeightBhpPerTonne}`, unit: 'BHP/T', label: 'POWER-TO-WEIGHT' },
        { value: '420', unit: 'MM', label: 'CARBON CERAMIC DISCS' },
      ],
      highlights: ['Pushrod Inboard Dampers', 'Titanium Hub Carriers', 'Magnesium Subframes'],
    },
  };

  const currentPillar = pillarData[activeTab];

  return (
    <section id="vehicle-detail" className="relative w-full py-24 md:py-32 bg-gradient-to-b from-[#0c0e15] via-[#11141d] to-[#0e1017] border-t border-neutral-800/80 overflow-hidden select-none">
      {/* Soft Ambient Showroom Lighting */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[85vw] max-w-[1000px] h-[350px] bg-[radial-gradient(ellipse_at_top,_rgba(212,175,55,0.06)_0%,_rgba(255,255,255,0.02)_50%,_transparent_75%)]" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Model Title & Price Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-neutral-800">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
              <span className="text-[10px] sm:text-[11px] font-mono-tech tracking-[0.3em] text-[#d4af37] uppercase font-semibold">
                TECHNICAL BENCHMARK SPECIFICATION
              </span>
            </div>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-rajdhani font-black tracking-tight text-white uppercase">
              {vehicle.name}
            </h2>
          </div>

          <div className="text-left md:text-right">
            <span className="text-3xl sm:text-4xl font-rajdhani font-black text-white block">
              ₹{vehicle.priceInCrores.toFixed(2)} CR
            </span>
            <span className="text-xs font-mono-tech text-neutral-400">
              ${(vehicle.priceUsd / 1000000).toFixed(2)}M USD • EX-ATELIER
            </span>
          </div>
        </div>

        {/* 4 Pillars Tab Switcher */}
        <div className="flex items-center justify-start md:justify-center gap-2 sm:gap-4 my-10 overflow-x-auto scrollbar-none">
          {pillars.map((p) => (
            <button
              key={p.id}
              id={`detail-tab-${p.id}`}
              onClick={() => {
                engineSound.playClickBeep();
                setActiveTab(p.id);
              }}
              className={`px-6 sm:px-8 py-3 rounded-full font-rajdhani font-bold text-xs sm:text-sm tracking-[0.2em] uppercase transition-all cursor-pointer whitespace-nowrap ${
                activeTab === p.id
                  ? 'bg-gradient-to-r from-[#e5ca9a] via-[#f7ebd8] to-[#d4af37] text-neutral-950 shadow-[0_0_25px_rgba(212,175,55,0.3)]'
                  : 'bg-[#151824] text-neutral-400 hover:text-white border border-neutral-750 hover:border-[#d4af37]/50'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Pillar Showcase Stage (Zero Long Paragraphs, Big Spec Numbers) */}
        <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-b from-[#181b27] via-[#12151f] to-[#0e1017] border border-neutral-700/60 shadow-[0_25px_55px_rgba(0,0,0,0.7)] relative overflow-hidden">
          {/* Subtle Ambient Studio Accent */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(circle,_rgba(212,175,55,0.08)_0%,_transparent_70%)] pointer-events-none" />

          <div className="relative z-10 flex items-center justify-between gap-4 mb-10 pb-6 border-b border-neutral-800">
            <span className="text-xs font-mono-tech tracking-[0.3em] text-[#d4af37] uppercase font-semibold">
              {currentPillar.tag}
            </span>

            <div className="flex items-center gap-3">
              <button
                onClick={onOpen3DShowroom}
                className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#151825] hover:bg-[#1d2233] text-white border border-neutral-700 hover:border-[#d4af37]/60 text-xs font-rajdhani font-bold tracking-wider uppercase transition-all cursor-pointer"
              >
                <Box className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>3D ATELIER</span>
              </button>
            </div>
          </div>

          {/* 4 Heroic Stat Numbers */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 my-6">
            {currentPillar.specs.map((spec, i) => (
              <div key={i} className="flex flex-col">
                <div className="flex items-baseline gap-2 font-rajdhani font-black text-white leading-none">
                  <span className="text-4xl sm:text-6xl md:text-7xl tracking-tighter">
                    {spec.value}
                  </span>
                  <span className="text-sm sm:text-base text-[#d4af37] font-bold uppercase tracking-wider">
                    {spec.unit}
                  </span>
                </div>
                <span className="text-[11px] font-mono-tech tracking-[0.2em] text-neutral-400 uppercase mt-3">
                  {spec.label}
                </span>
              </div>
            ))}
          </div>

          {/* Minimal Material Tags */}
          <div className="mt-12 pt-8 border-t border-neutral-800 flex flex-wrap items-center gap-3">
            <span className="text-[10px] font-mono-tech tracking-widest text-[#d4af37] uppercase mr-2 font-semibold">
              ENGINEERED ATTRIBUTES:
            </span>
            {currentPillar.highlights.map((h, i) => (
              <span
                key={i}
                className="px-4 py-1.5 rounded-full bg-[#151824] border border-neutral-750 text-xs font-rajdhani font-semibold text-neutral-300 tracking-wider uppercase"
              >
                {h}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
