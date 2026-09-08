import React from 'react';
import { X, Award, Shield, Terminal } from 'lucide-react';

interface CreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreditsModal: React.FC<CreditsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#090a0e] border border-neutral-800 rounded-3xl p-6 md:p-8 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-neutral-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono-tech uppercase tracking-[0.25em] text-amber-400">
              <Award className="w-4 h-4" />
              <span>COLLEGE CAPSTONE EXHIBITION</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-cinzel font-bold tracking-wider text-white mt-1">
              PROJECT CREDITS
            </h2>
          </div>

          <button
            id="close-credits-btn"
            onClick={onClose}
            className="p-2.5 rounded-full bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Project Description Banner */}
        <div className="mb-6 p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800/80 text-xs font-mono-tech text-neutral-300 leading-relaxed">
          <span className="text-cyan-400 font-bold">AURA MOTORS</span> — Luxury Automotive Atelier & Interactive 3D Virtual Showroom. An immersive engineering and virtual exhibition showcasing the fictional hypercar <span className="text-amber-400 font-semibold">AURA SPECTRE V12 — Hyper-GT</span>.
        </div>

        {/* The Two Team Members Prominently Displayed */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* S. RAGUL */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-neutral-900/60 to-neutral-950/90 border border-cyan-500/30 shadow-[0_0_20px_rgba(0,229,255,0.08)]">
            <div className="flex items-center gap-2 text-[10px] font-mono-tech uppercase tracking-[0.2em] text-cyan-400 mb-2">
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span>PROJECT ARCHITECT</span>
            </div>

            <h3 className="text-2xl font-cinzel font-bold text-white tracking-wider mb-2">
              S. RAGUL
            </h3>

            <div className="h-[1px] w-12 bg-cyan-400/50 mb-3" />

            <p className="text-xs font-mono-tech text-neutral-300 leading-relaxed">
              Lead 3D WebGL, Physical Shaders, Kinematic Rigging & Scene Architecture
            </p>
          </div>

          {/* NAVEENKUMAR S */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-neutral-900/60 to-neutral-950/90 border border-amber-500/30 shadow-[0_0_20px_rgba(212,175,55,0.08)]">
            <div className="flex items-center gap-2 text-[10px] font-mono-tech uppercase tracking-[0.2em] text-amber-400 mb-2">
              <Terminal className="w-3.5 h-3.5 text-amber-400" />
              <span>PROJECT ENGINEER</span>
            </div>

            <h3 className="text-2xl font-cinzel font-bold text-white tracking-wider mb-2">
              NAVEENKUMAR S
            </h3>

            <div className="h-[1px] w-12 bg-amber-400/50 mb-3" />

            <p className="text-xs font-mono-tech text-neutral-300 leading-relaxed">
              Lead Systems, UI/UX, Web Audio & Database Architecture
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-neutral-800/80 flex items-center justify-between text-[11px] font-mono-tech text-neutral-500">
          <span>CAPSTONE EXHIBITION PROJECT</span>
          <span className="text-neutral-400">AURA MOTORS • ATELIER VIRTUALIS</span>
        </div>
      </div>
    </div>
  );
};
