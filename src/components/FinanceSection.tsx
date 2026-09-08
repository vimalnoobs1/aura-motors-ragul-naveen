import React, { useState } from 'react';
import { VehicleSpec } from '../data/vehicles';
import { engineSound } from '../audio/engineSound';

interface FinanceSectionProps {
  vehicle: VehicleSpec;
  configuredPriceInInr?: number;
  onRequestFinanceQuote: (financeDetails: FinanceDetails) => void;
}

export interface FinanceDetails {
  vehicleName: string;
  totalVehiclePriceInInr: number;
  downPaymentPercent: number;
  downPaymentInInr: number;
  principalInInr: number;
  tenureMonths: number;
  interestRateAnnual: number;
  monthlyEmiInInr: number;
  totalInterestInInr: number;
  financeProgram: string;
}

export const FinanceSection: React.FC<FinanceSectionProps> = ({
  vehicle,
  configuredPriceInInr,
  onRequestFinanceQuote,
}) => {
  const totalPrice = configuredPriceInInr || vehicle.priceInCrores * 10000000;

  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(25);
  const [tenureMonths, setTenureMonths] = useState<number>(36);
  const [interestRateAnnual, setInterestRateAnnual] = useState<number>(7.9);

  // Amortization math
  const downPaymentInInr = Math.round((totalPrice * downPaymentPercent) / 100);
  const principalInInr = totalPrice - downPaymentInInr;
  const monthlyRate = interestRateAnnual / 12 / 100;

  let monthlyEmiInInr = 0;
  if (monthlyRate > 0) {
    const factor = Math.pow(1 + monthlyRate, tenureMonths);
    monthlyEmiInInr = Math.round((principalInInr * monthlyRate * factor) / (factor - 1));
  } else {
    monthlyEmiInInr = Math.round(principalInInr / tenureMonths);
  }

  const totalPayments = monthlyEmiInInr * tenureMonths;
  const totalInterestInInr = Math.max(0, totalPayments - principalInInr);

  const handleApply = () => {
    engineSound.playActivationChime();
    onRequestFinanceQuote({
      vehicleName: vehicle.name,
      totalVehiclePriceInInr: totalPrice,
      downPaymentPercent,
      downPaymentInInr,
      principalInInr,
      tenureMonths,
      interestRateAnnual,
      monthlyEmiInInr,
      totalInterestInInr,
      financeProgram: 'AURA Atelier Private Capital',
    });
  };

  return (
    <section id="finance" className="relative w-full py-24 md:py-32 bg-gradient-to-b from-[#0c0e15] via-[#10131d] to-[#08090f] border-t border-neutral-800/80 overflow-hidden select-none">
      {/* Soft Ambient Overhead Lighting */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[85vw] max-w-[1000px] h-[350px] bg-[radial-gradient(ellipse_at_top,_rgba(212,175,55,0.06)_0%,_rgba(255,255,255,0.02)_50%,_transparent_75%)]" />

      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
            <span className="text-[10px] sm:text-[11px] font-mono-tech tracking-[0.3em] text-[#d4af37] uppercase font-semibold">
              PRIVATE CLIENT CAPITAL SOLUTIONS
            </span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-syne font-extrabold tracking-tight text-white uppercase">
            ATELIER FINANCE
          </h2>
        </div>

        {/* Clean Premium Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Interactive Sliders (7 Cols) */}
          <div className="lg:col-span-7 p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-[#181b27] to-[#10131c] border border-neutral-700/60 shadow-[0_20px_45px_rgba(0,0,0,0.6)] space-y-8">
            {/* 1. Vehicle Price */}
            <div>
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-xs font-mono-tech tracking-wider text-[#d4af37] uppercase font-semibold">
                  VEHICLE PRICE
                </span>
                <span className="text-2xl font-syne font-extrabold text-white">
                  ₹{(totalPrice / 10000000).toFixed(2)} CR
                </span>
              </div>
              <div className="text-xs font-mono-tech text-neutral-400">
                {vehicle.name} Atelier Commission
              </div>
            </div>

            {/* 2. Down Payment Slider */}
            <div>
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-xs font-mono-tech tracking-wider text-neutral-300 uppercase">
                  DOWN PAYMENT ({downPaymentPercent}%)
                </span>
                <span className="text-xl font-syne font-bold text-[#d4af37]">
                  ₹{(downPaymentInInr / 100000).toFixed(1)} LAKHS
                </span>
              </div>
              <input
                id="slider-downpayment"
                type="range"
                min="10"
                max="60"
                step="5"
                value={downPaymentPercent}
                onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#d4af37]"
              />
            </div>

            {/* 3. Tenure Slider */}
            <div>
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-xs font-mono-tech tracking-wider text-neutral-300 uppercase">
                  TENURE
                </span>
                <span className="text-xl font-syne font-bold text-white">
                  {tenureMonths} MONTHS ({Math.round(tenureMonths / 12)} YRS)
                </span>
              </div>
              <input
                id="slider-tenure"
                type="range"
                min="12"
                max="60"
                step="12"
                value={tenureMonths}
                onChange={(e) => setTenureMonths(Number(e.target.value))}
                className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#d4af37]"
              />
            </div>

            {/* 4. Interest Slider */}
            <div>
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-xs font-mono-tech tracking-wider text-neutral-300 uppercase">
                  ANNUAL INTEREST RATE
                </span>
                <span className="text-xl font-syne font-bold text-white">
                  {interestRateAnnual.toFixed(1)}% APR
                </span>
              </div>
              <input
                id="slider-interest"
                type="range"
                min="5.5"
                max="12.0"
                step="0.1"
                value={interestRateAnnual}
                onChange={(e) => setInterestRateAnnual(Number(e.target.value))}
                className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#d4af37]"
              />
            </div>
          </div>

          {/* Right: Monthly EMI Hero Card (5 Cols) */}
          <div className="lg:col-span-5 p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#1c202e] via-[#141724] to-[#0c0f17] border border-[#d4af37]/60 text-center flex flex-col justify-between shadow-[0_25px_60px_rgba(0,0,0,0.85),0_0_25px_rgba(212,175,55,0.15)] ring-1 ring-[#d4af37]/30 relative overflow-hidden">
            {/* Soft Metallic Glow */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#d4af37]/10 blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <span className="text-[11px] font-mono-tech tracking-[0.3em] text-[#d4af37] uppercase block mb-3 font-semibold">
                ESTIMATED MONTHLY CAPITAL
              </span>

              {/* Prominent Monthly EMI */}
              <div className="text-4xl sm:text-5xl md:text-6xl font-syne font-extrabold text-white tracking-tight leading-none my-4">
                ₹{(monthlyEmiInInr / 100000).toFixed(2)} L
              </div>
              <span className="text-xs font-mono-tech text-neutral-400 uppercase tracking-widest block">
                PER MONTH / {tenureMonths} MOS
              </span>

              <div className="w-full h-[1px] bg-neutral-800 my-8" />

              {/* Summary Stats */}
              <div className="grid grid-cols-2 gap-4 text-left font-syne">
                <div>
                  <span className="text-[10px] font-mono-tech text-neutral-400 uppercase block">
                    PRINCIPAL FINANCED
                  </span>
                  <span className="text-base font-bold text-neutral-200">
                    ₹{(principalInInr / 10000000).toFixed(2)} CR
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-mono-tech text-neutral-400 uppercase block">
                    TOTAL INTEREST
                  </span>
                  <span className="text-base font-bold text-[#d4af37]">
                    ₹{(totalInterestInInr / 100000).toFixed(1)} L
                  </span>
                </div>
              </div>
            </div>

            {/* Action CTA */}
            <div className="relative z-10 mt-10">
              <button
                id="finance-apply-btn"
                onClick={handleApply}
                className="w-full py-4 rounded-full bg-gradient-to-r from-[#e5ca9a] via-[#f7ebd8] to-[#d4af37] hover:brightness-110 text-neutral-950 font-syne font-bold text-xs tracking-[0.18em] uppercase transition-all shadow-[0_0_25px_rgba(212,175,55,0.35)] cursor-pointer hover:scale-105 active:scale-95"
              >
                APPLY FOR CAPITAL
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
