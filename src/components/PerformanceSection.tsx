import React, { useState } from 'react';
import { VehicleSpec } from '../data/vehicles';
import { Box } from 'lucide-react';
import { engineSound } from '../audio/engineSound';

interface PerformanceSectionProps {
  vehicle: VehicleSpec;
  onOpen3DShowroom: () => void;
}

export const PerformanceSection: React.FC<PerformanceSectionProps> = ({
  vehicle,
  onOpen3DShowroom,
}) => {
  const [rpmSlider, setRpmSlider] = useState<number>(7200);

  const maxRpm = 9500;
  const rpmRatio = rpmSlider / maxRpm;
  const dynamicTorque = Math.round(
    vehicle.torqueNm * (Math.sin(rpmRatio * Math.PI * 0.85) + 0.2)
  );
  const dynamicPower = Math.round((dynamicTorque * rpmSlider) / 7127);

  const gears = [
    { gear: '1ST', ratio: '3.42:1', speedKmh: 95 },
    { gear: '2ND', ratio: '2.14:1', speedKmh: 148 },
    { gear: '3RD', ratio: '1.58:1', speedKmh: 202 },
    { gear: '4TH', ratio: '1.24:1', speedKmh: 260 },
    { gear: '5TH', ratio: '1.02:1', speedKmh: 318 },
    { gear: '6TH', ratio: '0.86:1', speedKmh: 372 },
    { gear: '7TH', ratio: '0.74:1', speedKmh: 425 },
  ];

  return (
    <section id="performance" className="relative w-full py-24 md:py-32 bg-gradient-to-b from-[#0e1017] via-[#12151e] to-[#0c0e15] border-t border-neutral-800/80 overflow-hidden select-none">
      {/* Soft Ambient Overhead Lighting */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[90vw] max-w-[1100px] h-[350px] bg-[radial-gradient(ellipse_at_top,_rgba(212,175,55,0.06)_0%,_rgba(255,255,255,0.02)_40%,_transparent_75%)]" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
              <span className="text-[10px] sm:text-[11px] font-mono-tech tracking-[0.3em] text-[#d4af37] uppercase font-semibold">
                DYNAMICS & TELEMETRY BENCHMARKS
              </span>
            </div>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-syne font-extrabold tracking-tight text-white uppercase">
              PERFORMANCE
            </h2>
          </div>

          <button
            onClick={() => {
              engineSound.playActivationChime();
              onOpen3DShowroom();
            }}
            className="self-start md:self-auto px-6 py-3 rounded-full bg-[#151824] hover:bg-[#1d2232] text-white border border-neutral-750 hover:border-[#d4af37]/60 font-syne font-bold text-xs tracking-[0.16em] uppercase transition-all cursor-pointer flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95"
          >
            <Box className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>3D TELEMETRY</span>
          </button>
        </div>

        {/* 4 Large Hero Metric Numbers */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="p-8 rounded-3xl bg-gradient-to-b from-[#181b27] to-[#10131c] border border-neutral-700/60 shadow-[0_15px_35px_rgba(0,0,0,0.6)]">
            <span className="text-[10px] font-mono-tech tracking-[0.2em] text-[#d4af37] uppercase font-semibold block">
              MAX OUTPUT
            </span>
            <div className="text-4xl sm:text-5xl font-syne font-extrabold text-white mt-2">
              {vehicle.powerBhp} <span className="text-sm font-mono-tech text-[#d4af37]">BHP</span>
            </div>
            <span className="text-xs font-mono-tech text-neutral-400 mt-2 block">
              @ 8,500 RPM
            </span>
          </div>

          <div className="p-8 rounded-3xl bg-gradient-to-b from-[#181b27] to-[#10131c] border border-neutral-700/60 shadow-[0_15px_35px_rgba(0,0,0,0.6)]">
            <span className="text-[10px] font-mono-tech tracking-[0.2em] text-[#d4af37] uppercase font-semibold block">
              PEAK TORQUE
            </span>
            <div className="text-4xl sm:text-5xl font-syne font-extrabold text-white mt-2">
              {vehicle.torqueNm} <span className="text-sm font-mono-tech text-[#d4af37]">NM</span>
            </div>
            <span className="text-xs font-mono-tech text-neutral-400 mt-2 block">
              CONSTANT FLAT CURVE
            </span>
          </div>

          <div className="p-8 rounded-3xl bg-gradient-to-b from-[#181b27] to-[#10131c] border border-neutral-700/60 shadow-[0_15px_35px_rgba(0,0,0,0.6)]">
            <span className="text-[10px] font-mono-tech tracking-[0.2em] text-[#d4af37] uppercase font-semibold block">
              0–100 KM/H
            </span>
            <div className="text-4xl sm:text-5xl font-syne font-extrabold text-white mt-2">
              {vehicle.acceleration0to100} <span className="text-sm font-mono-tech text-[#d4af37]">SEC</span>
            </div>
            <span className="text-xs font-mono-tech text-neutral-400 mt-2 block">
              LAUNCH CONTROL PROTOCOL
            </span>
          </div>

          <div className="p-8 rounded-3xl bg-gradient-to-b from-[#181b27] to-[#10131c] border border-neutral-700/60 shadow-[0_15px_35px_rgba(0,0,0,0.6)]">
            <span className="text-[10px] font-mono-tech tracking-[0.2em] text-[#d4af37] uppercase font-semibold block">
              TOP SPEED
            </span>
            <div className="text-4xl sm:text-5xl font-syne font-extrabold text-white mt-2">
              {vehicle.topSpeedKmh} <span className="text-sm font-mono-tech text-[#d4af37]">KM/H</span>
            </div>
            <span className="text-xs font-mono-tech text-neutral-400 mt-2 block">
              V-MAX AERODYNAMIC LIMIT
            </span>
          </div>
        </div>

        {/* Live Powertrain Interactive Dyno & Gearing */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#181b27] via-[#12151f] to-[#0e1017] border border-neutral-700/60 shadow-[0_25px_50px_rgba(0,0,0,0.65)]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-neutral-800 mb-8">
            <div>
              <span className="text-[10px] font-mono-tech tracking-[0.25em] text-[#d4af37] uppercase block mb-1 font-semibold">
                CALIBRATED DYNO POWER BAND
              </span>
              <div className="text-2xl sm:text-3xl font-rajdhani font-bold text-white uppercase">
                {rpmSlider} RPM
              </div>
            </div>

            <div className="flex items-center gap-8 font-rajdhani">
              <div>
                <span className="text-[10px] font-mono-tech text-neutral-400 uppercase block">POWER AT RPM</span>
                <span className="text-2xl font-bold text-white">{dynamicPower} BHP</span>
              </div>
              <div className="w-[1px] h-8 bg-neutral-800" />
              <div>
                <span className="text-[10px] font-mono-tech text-neutral-400 uppercase block">TORQUE AT RPM</span>
                <span className="text-2xl font-bold text-white">{dynamicTorque} NM</span>
              </div>
            </div>
          </div>

          {/* RPM Slider */}
          <div className="mb-10">
            <input
              id="slider-rpm"
              type="range"
              min="1500"
              max="9500"
              step="100"
              value={rpmSlider}
              onChange={(e) => {
                setRpmSlider(Number(e.target.value));
              }}
              className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#d4af37]"
            />
            <div className="flex justify-between text-[10px] font-mono-tech text-neutral-400 mt-2">
              <span>IDLE (1,500)</span>
              <span>MID-TORQUE (5,500)</span>
              <span>PEAK V12 (8,500)</span>
              <span className="text-[#d4af37]">REDLINE (9,500)</span>
            </div>
          </div>

          {/* Clean 7-Speed Transmission Ratio Bar */}
          <div>
            <span className="text-[10px] font-mono-tech tracking-[0.25em] text-[#d4af37] uppercase block mb-4 font-semibold">
              DUAL-CLUTCH SEAMLESS GEAR RATIOS
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {gears.map((g) => (
                <div
                  key={g.gear}
                  className="p-4 rounded-2xl bg-[#141723] border border-neutral-750 text-center font-rajdhani hover:border-[#d4af37]/40 transition-colors"
                >
                  <span className="text-xs font-bold text-white block">{g.gear}</span>
                  <span className="text-[11px] font-mono-tech text-neutral-400 block my-0.5">{g.ratio}</span>
                  <span className="text-xs font-bold text-neutral-300">{g.speedKmh} KM/H</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
