import React from 'react';
import { ShowroomMode } from '../types';
import { Award, Cpu, ShieldCheck } from 'lucide-react';

interface FooterBarProps {
  mode: ShowroomMode;
  onOpenCredits: () => void;
}

export const FooterBar: React.FC<FooterBarProps> = ({ mode, onOpenCredits }) => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-20 pointer-events-none p-2 md:p-3 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-neutral-800/40">
      {/* System Status Indicators */}
      <div className="flex items-center gap-3 text-[10px] font-mono-tech text-neutral-400 pointer-events-auto">
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>SYSTEM ONLINE</span>
        </div>

        <div className="hidden sm:flex items-center gap-1 text-neutral-500">
          <Cpu className="w-3 h-3 text-cyan-500" />
          <span>THREE.JS PBR 60 FPS</span>
        </div>

        <div className="hidden md:flex items-center gap-1 text-neutral-500">
          <ShieldCheck className="w-3 h-3 text-amber-500" />
          <span>CARBON T1000G RIG</span>
        </div>

        <span className="text-cyan-400/80 uppercase font-semibold">
          MODE: {mode === 'atelier' ? 'ATELIER STUDIO' : 'MIDNIGHT CYBER'}
        </span>
      </div>

      {/* Prominent Project Credits Callout in Footer */}
      <button
        id="footer-credits-banner"
        onClick={onOpenCredits}
        className="pointer-events-auto flex items-center gap-2 px-3 py-1 rounded-xl bg-neutral-950/80 hover:bg-neutral-900 border border-amber-500/30 hover:border-amber-400/60 text-neutral-300 hover:text-white transition-all cursor-pointer shadow-lg"
      >
        <Award className="w-3.5 h-3.5 text-amber-400" />
        <div className="text-[10px] font-mono-tech flex items-center gap-1.5">
          <span className="text-neutral-400">ARCHITECT:</span>
          <span className="text-white font-semibold">S. RAGUL</span>
          <span className="text-neutral-600">|</span>
          <span className="text-neutral-400">ENGINEER:</span>
          <span className="text-white font-semibold">NAVEENKUMAR S</span>
        </div>
      </button>
    </footer>
  );
};
