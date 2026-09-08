import React from 'react';
import { engineSound } from '../audio/engineSound';
import { ArrowRight, Sliders } from 'lucide-react';

interface HeroSectionProps {
  onExplore: () => void;
  onConfigure: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExplore,
  onConfigure,
}) => {
  return (
    <div className="relative w-full h-full flex flex-col justify-between pt-20 sm:pt-24 pb-8 sm:pb-12 px-4 sm:px-8 lg:px-12 pointer-events-none z-10 select-none">
      {/* Top Section: Architectural Brand Bar & Project Team Info */}
      <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row md:items-center justify-between gap-3 pointer-events-auto">
        <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#141721]/85 backdrop-blur-xl border border-neutral-750/70 shadow-lg self-start">
          <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-pulse" />
          <span className="text-[10px] font-mono-tech tracking-[0.25em] text-neutral-300 uppercase">
            SWISS HYPER-GT ATELIER
          </span>
          <span className="text-neutral-600">•</span>
          <span className="text-[10px] font-mono-tech tracking-[0.2em] text-[#d4af37] uppercase font-semibold">
            GENEVA
          </span>
        </div>

        {/* Small Premium Project Team Area */}
        <div className="grid grid-cols-2 gap-3 sm:gap-6 px-3.5 sm:px-5 py-2 rounded-2xl bg-[#121520]/90 backdrop-blur-xl border border-neutral-750/80 shadow-lg text-left self-stretch sm:self-auto">
          <div className="pr-2 sm:pr-4 border-r border-neutral-800">
            <span className="text-[9px] font-mono-tech text-[#d4af37] uppercase tracking-wider block font-semibold">
              PROJECT ARCHITECT
            </span>
            <span className="text-xs sm:text-sm font-bold text-white font-syne block leading-tight">
              S. RAGUL
            </span>
            <span className="text-[10px] text-neutral-400 block font-sans truncate">
              Lead 3D WebGL & Vehicle Design
            </span>
          </div>

          <div>
            <span className="text-[9px] font-mono-tech text-[#d4af37] uppercase tracking-wider block font-semibold">
              PROJECT ENGINEER
            </span>
            <span className="text-xs sm:text-sm font-bold text-white font-syne block leading-tight">
              NAVEENKUMAR S
            </span>
            <span className="text-[10px] text-neutral-400 block font-sans truncate">
              Lead Systems & UI/UX
            </span>
          </div>
        </div>
      </div>

      {/* Model Title Overlay */}
      <div className="max-w-7xl mx-auto w-full mt-2 sm:mt-4 pointer-events-auto">
        <div className="inline-block p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#161924]/90 via-[#10131b]/75 to-transparent backdrop-blur-md border border-neutral-750/60 shadow-[0_15px_35px_rgba(0,0,0,0.6)] max-w-full">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] sm:text-xs font-mono-tech tracking-[0.3em] text-[#d4af37] uppercase font-semibold">
              AURA MOTORS
            </span>
            <span className="text-neutral-600">•</span>
            <span className="text-[10px] font-mono-tech tracking-[0.2em] text-neutral-400 uppercase">
              FLAGSHIP HYPERCAR
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-syne font-extrabold tracking-tight text-white uppercase drop-shadow-[0_10px_25px_rgba(0,0,0,0.9)] leading-none">
            AURA SPECTRE V12
          </h1>

          <div className="mt-2 flex items-center gap-3">
            <div className="h-[2px] w-10 bg-gradient-to-r from-[#d4af37] to-transparent" />
            <span className="text-xs font-mono-tech tracking-wider text-neutral-300">
              TWIN-TURBO 6.5L V12 HYBRID
            </span>
          </div>
        </div>
      </div>

      {/* Center Viewport for 3D Car */}
      <div className="flex-1 min-h-[40px] sm:min-h-[80px]" />

      {/* Bottom Floating Specs & Actions */}
      <div className="max-w-7xl mx-auto w-full pointer-events-auto">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-end justify-between gap-3 sm:gap-6">
          {/* Key Specs Capsule */}
          <div className="p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-[#131620]/85 backdrop-blur-2xl border border-neutral-700/60 shadow-[0_20px_45px_rgba(0,0,0,0.7)] flex flex-wrap items-center justify-between gap-3 sm:gap-8">
            <div>
              <span className="text-[9px] font-mono-tech text-neutral-400 uppercase tracking-widest block mb-0.5">
                0–100
              </span>
              <span className="text-lg sm:text-2xl font-syne font-bold text-white tracking-wide">
                2.1s
              </span>
            </div>

            <div className="w-[1px] h-7 bg-neutral-800 hidden sm:block" />

            <div>
              <span className="text-[9px] font-mono-tech text-neutral-400 uppercase tracking-widest block mb-0.5">
                TOP SPEED
              </span>
              <span className="text-lg sm:text-2xl font-syne font-bold text-white tracking-wide">
                425 <span className="text-xs font-normal text-neutral-400 font-mono-tech">KM/H</span>
              </span>
            </div>

            <div className="w-[1px] h-7 bg-neutral-800 hidden sm:block" />

            <div>
              <span className="text-[9px] font-mono-tech text-neutral-400 uppercase tracking-widest block mb-0.5">
                POWER
              </span>
              <span className="text-lg sm:text-2xl font-syne font-bold text-white tracking-wide">
                1,480 <span className="text-xs font-normal text-neutral-400 font-mono-tech">BHP</span>
              </span>
            </div>

            <div className="w-[1px] h-7 bg-neutral-800 hidden sm:block" />

            {/* Price Badge */}
            <div>
              <span className="text-[9px] font-mono-tech text-[#d4af37] uppercase tracking-widest block mb-0.5 font-semibold">
                PRICE
              </span>
              <span className="text-lg sm:text-2xl font-syne font-extrabold text-amber-200">
                ₹8.50 CR
              </span>
            </div>
          </div>

          {/* Action Buttons: EXPLORE & CONFIGURE */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            <button
              id="hero-explore-btn"
              onClick={() => {
                engineSound.playActivationChime();
                onExplore();
              }}
              className="flex-1 sm:flex-none min-h-[44px] px-6 sm:px-9 py-3 rounded-full bg-gradient-to-r from-[#e6ca9c] via-[#f7ebd7] to-[#d4af37] hover:brightness-110 text-neutral-950 font-syne font-bold text-xs sm:text-sm tracking-[0.16em] uppercase transition-all transform hover:scale-[1.02] active:scale-95 cursor-pointer shadow-[0_0_25px_rgba(212,175,55,0.35)] flex items-center justify-center gap-2"
            >
              <span>EXPLORE</span>
              <ArrowRight className="w-4 h-4 text-neutral-950" />
            </button>

            <button
              id="hero-configure-btn"
              onClick={() => {
                engineSound.playClickBeep();
                onConfigure();
              }}
              className="flex-1 sm:flex-none min-h-[44px] px-6 sm:px-9 py-3 rounded-full bg-[#141722]/90 hover:bg-[#1c202d] text-neutral-100 hover:text-white border border-[#d4af37]/40 hover:border-[#d4af37] font-syne font-bold text-xs sm:text-sm tracking-[0.16em] uppercase transition-all backdrop-blur-xl transform hover:scale-[1.02] active:scale-95 cursor-pointer shadow-lg flex items-center justify-center gap-2"
            >
              <Sliders className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>CONFIGURE</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
