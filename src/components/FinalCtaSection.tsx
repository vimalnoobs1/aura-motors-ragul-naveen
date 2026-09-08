import React from 'react';
import { engineSound } from '../audio/engineSound';

interface FinalCtaSectionProps {
  onRequestQuote: () => void;
  onBookViewing: () => void;
}

export const FinalCtaSection: React.FC<FinalCtaSectionProps> = ({
  onRequestQuote,
  onBookViewing,
}) => {
  return (
    <section id="final-cta" className="relative w-full py-28 sm:py-36 bg-gradient-to-b from-[#08090f] via-[#10131d] to-[#05060a] border-t border-neutral-800/80 select-none overflow-hidden text-center">
      {/* Subtle Ambient Radial Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.08)_0%,_rgba(255,255,255,0.03)_40%,_transparent_75%)] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <div className="inline-flex items-center gap-2 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
          <span className="text-xs font-mono-tech tracking-[0.35em] text-[#d4af37] uppercase font-semibold">
            EXCLUSIVE COMMISSIONS OPEN • GLOBAL ATELIER
          </span>
        </div>

        <h2 className="text-5xl sm:text-7xl md:text-8xl font-syne font-extrabold tracking-tight text-white uppercase leading-none">
          MAKE IT YOURS
        </h2>

        {/* Minimal Actions */}
        <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <button
            id="final-cta-quote-btn"
            onClick={() => {
              engineSound.playActivationChime();
              onRequestQuote();
            }}
            className="w-full sm:w-auto px-10 py-4 rounded-full bg-gradient-to-r from-[#e5ca9a] via-[#f7ebd8] to-[#d4af37] hover:brightness-110 text-neutral-950 font-syne font-bold text-xs sm:text-sm tracking-[0.18em] uppercase transition-all shadow-[0_0_30px_rgba(212,175,55,0.35)] hover:scale-105 active:scale-95 cursor-pointer"
          >
            REQUEST A QUOTE
          </button>

          <button
            id="final-cta-viewing-btn"
            onClick={() => {
              engineSound.playClickBeep();
              onBookViewing();
            }}
            className="w-full sm:w-auto px-10 py-4 rounded-full bg-[#151824] hover:bg-[#1d2232] text-white border border-neutral-750 hover:border-[#d4af37]/60 font-syne font-bold text-xs sm:text-sm tracking-[0.18em] uppercase transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
          >
            BOOK A PRIVATE VIEWING
          </button>
        </div>
      </div>
    </section>
  );
};
