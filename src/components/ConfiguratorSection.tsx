import React, { useState } from 'react';
import { VehicleSpec } from '../data/vehicles';
import { VehicleState, BodyColorKey, WheelFinishKey, CaliperColorKey } from '../types';
import { ShowroomCanvas } from './ShowroomCanvas';
import {
  PAINT_OPTIONS,
  WHEEL_OPTIONS,
  INTERIOR_THEMES,
  CARBON_ACCENTS,
} from '../data/configuratorOptions';
import { engineSound } from '../audio/engineSound';

interface ConfiguratorSectionProps {
  vehicle: VehicleSpec;
  vehicleState: VehicleState;
  onUpdateVehicleState: (updates: Partial<VehicleState>) => void;
  onNavigateToFinance: (totalPriceInInr: number) => void;
  onRequestQuote: (vehicle: VehicleSpec, configSummary: ConfigSummary) => void;
}

export interface ConfigSummary {
  paintName: string;
  paintPrice: number;
  wheelName: string;
  wheelPrice: number;
  interiorName: string;
  interiorPrice: number;
  accentName: string;
  accentPrice: number;
  basePriceInInr: number;
  optionsTotalInInr: number;
  finalPriceInInr: number;
}

type ConfigCategory = 'paint' | 'wheels' | 'interior' | 'accents';

export const ConfiguratorSection: React.FC<ConfiguratorSectionProps> = ({
  vehicle,
  vehicleState,
  onUpdateVehicleState,
  onNavigateToFinance,
  onRequestQuote,
}) => {
  const [activeCategory, setActiveCategory] = useState<ConfigCategory>('paint');
  const [selectedInteriorId, setSelectedInteriorId] = useState<string>('nero-cyan');
  const [selectedAccentId, setSelectedAccentId] = useState<string>('gloss-twill');

  // Active selections
  const currentPaint = PAINT_OPTIONS.find((p) => p.id === vehicleState.color) || PAINT_OPTIONS[0];
  const currentWheel = WHEEL_OPTIONS.find((w) => w.id === vehicleState.wheelFinish) || WHEEL_OPTIONS[0];
  const currentInterior = INTERIOR_THEMES.find((i) => i.id === selectedInteriorId) || INTERIOR_THEMES[0];
  const currentAccent = CARBON_ACCENTS.find((c) => c.id === selectedAccentId) || CARBON_ACCENTS[0];

  // Mathematical price computation
  const basePriceInInr = vehicle.priceInCrores * 10000000;
  const optionsTotalInInr =
    currentPaint.price +
    currentWheel.price +
    currentInterior.price +
    currentAccent.price;

  const finalPriceInInr = basePriceInInr + optionsTotalInInr;
  const finalPriceInCrores = finalPriceInInr / 10000000;
  const optionsInLakhs = (optionsTotalInInr / 100000).toFixed(1);

  const configSummary: ConfigSummary = {
    paintName: currentPaint.name,
    paintPrice: currentPaint.price,
    wheelName: currentWheel.name,
    wheelPrice: currentWheel.price,
    interiorName: currentInterior.name,
    interiorPrice: currentInterior.price,
    accentName: currentAccent.name,
    accentPrice: currentAccent.price,
    basePriceInInr,
    optionsTotalInInr,
    finalPriceInInr,
  };

  return (
    <section id="configurator" className="relative w-full py-24 md:py-32 bg-gradient-to-b from-[#0c0e15] via-[#11141d] to-[#0e1017] border-t border-neutral-800/80 overflow-hidden select-none">
      {/* Soft Ambient Overhead Atelier Lighting */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[90vw] max-w-[1100px] h-[350px] bg-[radial-gradient(ellipse_at_top,_rgba(212,175,55,0.06)_0%,_rgba(255,255,255,0.02)_50%,_transparent_75%)]" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
              <span className="text-[10px] sm:text-[11px] font-mono-tech tracking-[0.3em] text-[#d4af37] uppercase font-semibold">
                ATELIER COMMISSION & CONFIGURATION
              </span>
            </div>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-rajdhani font-black tracking-tight text-white uppercase">
              CONFIGURE YOUR AURA
            </h2>
          </div>

          <div className="text-xs font-mono-tech text-neutral-400 tracking-wider">
            3D REAL-TIME SURFACE SIMULATION
          </div>
        </div>

        {/* Main Split Grid: 3D Vehicle Stage (Left/Top) + Minimal Controls & Persistent Price (Right/Bottom) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* 3D Vehicle Stage Viewport (8 Columns on desktop) */}
          <div className="lg:col-span-8 rounded-3xl bg-gradient-to-b from-[#181b27] via-[#12151f] to-[#0e1017] border border-neutral-700/60 overflow-hidden relative h-[420px] sm:h-[540px] shadow-[0_25px_60px_rgba(0,0,0,0.7)] flex flex-col justify-between">
            {/* Embedded Live Three.js 3D WebGL Canvas */}
            <div className="absolute inset-0 z-0">
              <ShowroomCanvas
                mode="atelier"
                cameraPreset="side"
                vehicleState={vehicleState}
                onCameraChange={() => {}}
              />
            </div>

            {/* Subtle Top Overlay: Selected Model & Category */}
            <div className="relative z-10 p-6 flex items-center justify-between pointer-events-none">
              <div>
                <span className="text-[10px] font-mono-tech tracking-[0.25em] text-[#d4af37] uppercase block font-semibold">
                  3D ATELIER PREVIEW
                </span>
                <span className="text-xl sm:text-2xl font-rajdhani font-bold text-white uppercase">
                  {vehicle.name}
                </span>
              </div>
              <div className="px-3 py-1 rounded-full bg-black/60 border border-neutral-750 text-[10px] font-mono-tech text-[#d4af37]">
                DRAG TO ROTATE 360°
              </div>
            </div>

            {/* Subtle Bottom Overlay: Active Specs */}
            <div className="relative z-10 p-6 flex flex-wrap items-center gap-4 text-xs font-mono-tech text-neutral-300 pointer-events-none">
              <span className="px-3 py-1 rounded-full bg-black/70 border border-neutral-750">
                PAINT: {currentPaint.name}
              </span>
              <span className="px-3 py-1 rounded-full bg-black/70 border border-neutral-750">
                WHEELS: {currentWheel.name}
              </span>
            </div>
          </div>

          {/* Minimal Controls & Persistent Price (4 Columns on desktop) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* 1. Category Switcher: PAINT | WHEELS | INTERIOR | ACCENTS */}
            <div className="grid grid-cols-4 p-1 rounded-2xl bg-neutral-950 border border-neutral-850 text-center font-rajdhani text-xs font-bold tracking-wider uppercase">
              {(['paint', 'wheels', 'interior', 'accents'] as ConfigCategory[]).map((cat) => (
                <button
                  key={cat}
                  id={`cat-btn-${cat}`}
                  onClick={() => {
                    engineSound.playClickBeep();
                    setActiveCategory(cat);
                  }}
                  className={`py-2.5 rounded-xl transition-all cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-white text-black shadow-md'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* 2. Options Palette */}
            <div className="p-6 rounded-3xl bg-[#06080e] border border-neutral-850 min-h-[260px] flex flex-col justify-between">
              {activeCategory === 'paint' && (
                <div className="space-y-3">
                  <span className="text-[11px] font-mono-tech tracking-[0.2em] text-neutral-400 uppercase block mb-2">
                    EXTERIOR FINISH
                  </span>
                  <div className="grid grid-cols-5 gap-2.5 mb-4">
                    {PAINT_OPTIONS.map((p) => {
                      const isSelected = vehicleState.color === p.id;
                      return (
                        <button
                          key={p.id}
                          id={`paint-${p.id}`}
                          onClick={() => {
                            engineSound.playClickBeep();
                            onUpdateVehicleState({ color: p.id });
                          }}
                          style={{ backgroundColor: p.hex }}
                          className={`w-full aspect-square rounded-xl transition-all cursor-pointer border-2 ${
                            isSelected
                              ? 'border-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.4)]'
                              : 'border-neutral-800 hover:scale-105'
                          }`}
                          title={p.name}
                        />
                      );
                    })}
                  </div>
                  <div>
                    <div className="text-base font-rajdhani font-bold text-white">
                      {currentPaint.name}
                    </div>
                    <div className="text-xs font-mono-tech text-neutral-400 mt-0.5">
                      {currentPaint.price === 0
                        ? 'INCLUDED'
                        : `+ ₹${(currentPaint.price / 100000).toFixed(1)} LAKHS`}
                    </div>
                  </div>
                </div>
              )}

              {activeCategory === 'wheels' && (
                <div className="space-y-3">
                  <span className="text-[11px] font-mono-tech tracking-[0.2em] text-neutral-400 uppercase block mb-2">
                    ALLOY & FORGED WHEELS
                  </span>
                  <div className="space-y-2">
                    {WHEEL_OPTIONS.map((w) => {
                      const isSelected = vehicleState.wheelFinish === w.id;
                      return (
                        <button
                          key={w.id}
                          id={`wheel-${w.id}`}
                          onClick={() => {
                            engineSound.playClickBeep();
                            onUpdateVehicleState({ wheelFinish: w.id });
                          }}
                          className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-neutral-900 border-white text-white'
                              : 'bg-neutral-950/60 border-neutral-850 text-neutral-400 hover:text-neutral-200'
                          }`}
                        >
                          <span className="font-rajdhani font-bold text-xs uppercase tracking-wider">
                            {w.name}
                          </span>
                          <span className="font-mono-tech text-[10px]">
                            {w.price === 0 ? 'INCLUDED' : `+ ₹${(w.price / 100000).toFixed(1)}L`}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeCategory === 'interior' && (
                <div className="space-y-3">
                  <span className="text-[11px] font-mono-tech tracking-[0.2em] text-neutral-400 uppercase block mb-2">
                    ATELIER SALON UPHOLSTERY
                  </span>
                  <div className="space-y-2">
                    {INTERIOR_THEMES.map((item) => {
                      const isSelected = selectedInteriorId === item.id;
                      return (
                        <button
                          key={item.id}
                          id={`interior-${item.id}`}
                          onClick={() => {
                            engineSound.playClickBeep();
                            setSelectedInteriorId(item.id);
                          }}
                          className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-neutral-900 border-white text-white'
                              : 'bg-neutral-950/60 border-neutral-850 text-neutral-400 hover:text-neutral-200'
                          }`}
                        >
                          <span className="font-rajdhani font-bold text-xs uppercase tracking-wider">
                            {item.name}
                          </span>
                          <span className="font-mono-tech text-[10px]">
                            {item.price === 0 ? 'INCLUDED' : `+ ₹${(item.price / 100000).toFixed(1)}L`}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeCategory === 'accents' && (
                <div className="space-y-3">
                  <span className="text-[11px] font-mono-tech tracking-[0.2em] text-neutral-400 uppercase block mb-2">
                    AERODYNAMIC CARBON ACCENTS
                  </span>
                  <div className="space-y-2">
                    {CARBON_ACCENTS.map((accent) => {
                      const isSelected = selectedAccentId === accent.id;
                      return (
                        <button
                          key={accent.id}
                          id={`accent-${accent.id}`}
                          onClick={() => {
                            engineSound.playClickBeep();
                            setSelectedAccentId(accent.id);
                          }}
                          className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-neutral-900 border-white text-white'
                              : 'bg-neutral-950/60 border-neutral-850 text-neutral-400 hover:text-neutral-200'
                          }`}
                        >
                          <span className="font-rajdhani font-bold text-xs uppercase tracking-wider">
                            {accent.name}
                          </span>
                          <span className="font-mono-tech text-[10px]">
                            {accent.price === 0 ? 'INCLUDED' : `+ ₹${(accent.price / 100000).toFixed(1)}L`}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 3. Persistent Luxury Price Breakdown */}
            <div className="p-6 rounded-3xl bg-gradient-to-b from-[#181b27] to-[#10131c] border border-neutral-700/60 shadow-[0_15px_35px_rgba(0,0,0,0.6)] font-rajdhani">
              <span className="text-[10px] font-mono-tech tracking-[0.25em] text-[#d4af37] uppercase block mb-4 font-semibold">
                COMMISSION VALUATION
              </span>

              <div className="space-y-2 text-sm font-semibold tracking-wider">
                <div className="flex items-center justify-between text-neutral-400">
                  <span>BASE</span>
                  <span className="text-white">₹{vehicle.priceInCrores.toFixed(2)} CR</span>
                </div>

                <div className="flex items-center justify-between text-neutral-400">
                  <span>OPTIONS</span>
                  <span className="text-[#d4af37] font-mono-tech">+ ₹{optionsInLakhs} L</span>
                </div>

                <div className="w-full h-[1px] bg-neutral-800 my-2" />

                <div className="flex items-baseline justify-between pt-1">
                  <span className="text-base font-bold text-white uppercase">TOTAL</span>
                  <span className="text-2xl sm:text-3xl font-black text-white">
                    ₹{finalPriceInCrores.toFixed(2)} CR
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-col gap-2.5">
                <button
                  id="cfg-finance-btn"
                  onClick={() => {
                    engineSound.playActivationChime();
                    onNavigateToFinance(finalPriceInInr);
                  }}
                  className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#e5ca9a] via-[#f7ebd8] to-[#d4af37] hover:brightness-110 text-neutral-950 font-rajdhani font-bold text-xs tracking-[0.2em] uppercase transition-all cursor-pointer shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:scale-105 active:scale-95"
                >
                  CALCULATE LEASE / FINANCE
                </button>

                <button
                  id="cfg-quote-btn"
                  onClick={() => {
                    engineSound.playClickBeep();
                    onRequestQuote(vehicle, configSummary);
                  }}
                  className="w-full py-3.5 rounded-full bg-[#151824] hover:bg-[#1d2232] text-white border border-neutral-750 hover:border-[#d4af37]/60 font-rajdhani font-bold text-xs tracking-[0.2em] uppercase transition-all cursor-pointer active:scale-95 shadow-md"
                >
                  REQUEST BESPOKE QUOTE
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
