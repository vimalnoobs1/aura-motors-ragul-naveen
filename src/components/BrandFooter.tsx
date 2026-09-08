import React from 'react';
import { Award, Shield, Compass, Globe, ArrowUp } from 'lucide-react';
import { engineSound } from '../audio/engineSound';

interface BrandFooterProps {
  onOpenCredits: () => void;
  onOpenAuraDb: () => void;
  onScrollToTop: () => void;
}

export const BrandFooter: React.FC<BrandFooterProps> = ({
  onOpenCredits,
  onOpenAuraDb,
  onScrollToTop,
}) => {
  return (
    <footer className="relative w-full bg-gradient-to-b from-[#05060a] via-[#090b10] to-[#030406] text-neutral-400 border-t border-neutral-800/80 font-sans pt-16 pb-12 overflow-hidden">
      {/* Subtle Warm Amber/Champagne Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[150px] bg-[radial-gradient(ellipse_at_top,_rgba(212,175,55,0.08)_0%,_transparent_75%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-neutral-800/80">
          {/* Col 1: Brand & Heritage */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl border border-[#d4af37]/60 bg-gradient-to-br from-[#24283b] to-[#121520] flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.25)]">
                <span className="font-serif font-black text-sm text-[#e6ca9c] tracking-tighter">Λ</span>
              </div>
              <span className="font-rajdhani text-xl font-black tracking-[0.25em] text-white uppercase">
                AURA MOTORS
              </span>
            </div>

            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-sm">
              Swiss hyper-GT atelier established on the shores of Lake Geneva. Handcrafted carbon-monocoque grand tourers engineered to transcend mechanical limits with uncompromising horological precision.
            </p>

            <div className="flex items-center gap-2 text-xs font-mono-tech text-[#d4af37]">
              <Globe className="w-3.5 h-3.5" />
              <span>SWISS ATELIER HERITAGE • GENEVA</span>
            </div>
          </div>

          {/* Col 2: Atelier Locations */}
          <div className="space-y-3">
            <span className="text-xs font-mono-tech uppercase tracking-widest text-[#d4af37] font-semibold block">
              GLOBAL ATELIERS
            </span>
            <ul className="space-y-2 text-xs text-neutral-400 font-sans">
              <li className="hover:text-white transition-colors cursor-default flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" /> Geneva Atelier (HQ)
              </li>
              <li className="hover:text-white transition-colors cursor-default flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-600" /> Monaco Carré d&apos;Or
              </li>
              <li className="hover:text-white transition-colors cursor-default flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-600" /> Tokyo Ginza Studio
              </li>
              <li className="hover:text-white transition-colors cursor-default flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-600" /> London Mayfair
              </li>
              <li className="hover:text-white transition-colors cursor-default flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-600" /> Dubai DIFC Concierge
              </li>
            </ul>
          </div>

          {/* Col 3: Programs & Systems */}
          <div className="space-y-3">
            <span className="text-xs font-mono-tech uppercase tracking-widest text-[#d4af37] font-semibold block">
              CLIENT SERVICES
            </span>
            <ul className="space-y-2 text-xs text-neutral-400 font-sans">
              <li>
                <a href="#configurator" className="hover:text-[#d4af37] transition-colors">
                  Bespoke Commission Program
                </a>
              </li>
              <li>
                <a href="#finance" className="hover:text-[#d4af37] transition-colors">
                  Private Client Capital & Lease
                </a>
              </li>
              <li>
                <a href="#performance" className="hover:text-[#d4af37] transition-colors">
                  Global Circuit Telemetry
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenAuraDb}
                  className="hover:text-[#d4af37] transition-colors text-left cursor-pointer"
                >
                  AuraDB Ledger
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Governance & Legal */}
          <div className="space-y-3">
            <span className="text-xs font-mono-tech uppercase tracking-widest text-[#d4af37] font-semibold block">
              LEGAL & POLICIES
            </span>
            <ul className="space-y-2 text-xs text-neutral-400 font-sans">
              <li className="hover:text-white transition-colors cursor-default">
                Atelier Commission Policy
              </li>
              <li className="hover:text-white transition-colors cursor-default">
                Confidential Client Privacy
              </li>
              <li className="hover:text-white transition-colors cursor-default">
                Terms of Commission & Escrow
              </li>
              <li className="hover:text-white transition-colors cursor-default">
                Track Warranty Terms
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer for High-Performance Vehicles */}
        <div className="py-6 border-b border-neutral-800/60 text-[11px] font-sans text-neutral-500 leading-relaxed">
          <p>
            <strong>LEGAL NOTICE REGARDING HIGH-PERFORMANCE VEHICLES:</strong> Vehicle performance metrics, including 0–100 km/h acceleration, horsepower, lateral G-forces, and V-Max ratings, are calculated under controlled proving ground conditions with professional drivers on dry pavement. Actual road performance may vary based on weather, ambient temperatures, tire degradation, and altitude. Never exceed posted speed limits on public roadways. V-Max speeds are electronically restricted unless operated on approved closed circuit tracks with certified high-velocity tire packages.
          </p>
        </div>

        {/* Bottom Bar: Copyright & Architect Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono-tech">
          <div>
            © {new Date().getFullYear()} AURA MOTORS S.A. ALL RIGHTS RESERVED. REGISTERED IN GENEVA, SWITZERLAND.
          </div>

          <div className="flex items-center gap-4">
            <button
              id="footer-architect-credits-btn"
              onClick={() => {
                engineSound.playClickBeep();
                onOpenCredits();
              }}
              className="flex items-center gap-2 text-neutral-400 hover:text-[#d4af37] transition-colors cursor-pointer"
            >
              <Award className="w-4 h-4 text-[#d4af37]" />
              <span>COMMISSION CREDITS</span>
            </button>

            <button
              id="footer-back-to-top-btn"
              onClick={onScrollToTop}
              className="p-2 rounded-xl bg-[#141724] hover:bg-[#1c2132] text-neutral-400 hover:text-white border border-neutral-750 hover:border-[#d4af37]/50 cursor-pointer transition-all"
              title="Return to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
