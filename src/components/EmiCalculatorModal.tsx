import React, { useState, useMemo } from 'react';
import { Calculator, DollarSign, Calendar, Percent, ShieldCheck, X } from 'lucide-react';
import { engineSound } from '../audio/engineSound';

interface EmiCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  baseVehiclePrice?: number;
}

export const EmiCalculatorModal: React.FC<EmiCalculatorModalProps> = ({
  isOpen,
  onClose,
  baseVehiclePrice = 3850000,
}) => {
  const [vehiclePrice, setVehiclePrice] = useState<number>(baseVehiclePrice);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(25); // 25% down payment
  const [tenureMonths, setTenureMonths] = useState<number>(36); // 36 months default
  const [interestRateAnnual, setInterestRateAnnual] = useState<number>(4.25); // 4.25% APR

  const calculations = useMemo(() => {
    const downPaymentAmount = (vehiclePrice * downPaymentPercent) / 100;
    const loanAmount = vehiclePrice - downPaymentAmount;
    const monthlyRate = interestRateAnnual / 12 / 100;

    let monthlyEmi = 0;
    if (monthlyRate === 0) {
      monthlyEmi = loanAmount / tenureMonths;
    } else {
      const compound = Math.pow(1 + monthlyRate, tenureMonths);
      monthlyEmi = (loanAmount * monthlyRate * compound) / (compound - 1);
    }

    const totalInterest = monthlyEmi * tenureMonths - loanAmount;
    const totalPayable = downPaymentAmount + monthlyEmi * tenureMonths;
    const principalPct = (loanAmount / (loanAmount + totalInterest)) * 100;
    const interestPct = (totalInterest / (loanAmount + totalInterest)) * 100;

    return {
      downPaymentAmount,
      loanAmount,
      monthlyEmi,
      totalInterest,
      totalPayable,
      principalPct,
      interestPct,
    };
  }, [vehiclePrice, downPaymentPercent, tenureMonths, interestRateAnnual]);

  if (!isOpen) return null;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="emi-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-fade-in"
    >
      <div className="relative w-full max-w-2xl bg-neutral-950 border border-cyan-500/40 rounded-2xl shadow-[0_0_50px_rgba(0,229,255,0.15)] flex flex-col overflow-hidden text-neutral-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-gradient-to-r from-neutral-900/90 to-neutral-950">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 id="emi-modal-title" className="text-base font-rajdhani font-bold tracking-wider text-white uppercase">
                Aura Financial Atelier
              </h2>
              <span className="text-[10px] text-neutral-400 font-mono-tech">
                REDUCING-BALANCE BESPOKE HYPERCAR AMORTIZATION
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              engineSound.playClickBeep();
              onClose();
            }}
            className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer border border-neutral-800"
            title="Close Financial Calculator"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[80vh]">
          {/* Monthly Payment Hero Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-900/90 to-neutral-950 border border-cyan-500/30 text-center shadow-xl">
            <span className="text-xs font-mono-tech uppercase text-neutral-400 tracking-wider">
              ESTIMATED MONTHLY INSTALLMENT (EMI)
            </span>
            <div className="text-3xl sm:text-4xl font-rajdhani font-bold text-cyan-300 tracking-wider my-1">
              {formatCurrency(calculations.monthlyEmi)}
              <span className="text-sm font-normal text-neutral-400 font-mono-tech"> / month</span>
            </div>
            <p className="text-xs text-neutral-400 font-mono-tech">
              Tenure of {tenureMonths} Months at {interestRateAnnual}% APR Super-Prime
            </p>
          </div>

          {/* Interactive Sliders & Controls */}
          <div className="space-y-4 font-mono-tech text-xs">
            {/* Vehicle Base Price */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-neutral-300">
                <span className="flex items-center gap-1.5 text-neutral-400">
                  <DollarSign className="w-3.5 h-3.5 text-cyan-400" /> Total Vehicle Specification
                </span>
                <span className="font-bold text-white">{formatCurrency(vehiclePrice)}</span>
              </div>
              <input
                type="range"
                min={3500000}
                max={4800000}
                step={50000}
                value={vehiclePrice}
                onChange={(e) => setVehiclePrice(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-neutral-500">
                <span>Base GT ($3.5M)</span>
                <span>Fully Bespoke Commission ($4.8M)</span>
              </div>
            </div>

            {/* Down Payment % */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-neutral-300">
                <span className="flex items-center gap-1.5 text-neutral-400">
                  <Percent className="w-3.5 h-3.5 text-cyan-400" /> Down Payment ({downPaymentPercent}%)
                </span>
                <span className="font-bold text-amber-400">
                  {formatCurrency(calculations.downPaymentAmount)}
                </span>
              </div>
              <input
                type="range"
                min={10}
                max={75}
                step={5}
                value={downPaymentPercent}
                onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-neutral-500">
                <span>10% ($385K)</span>
                <span>75% ($2.88M)</span>
              </div>
            </div>

            {/* Loan Tenure Selector */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-neutral-300">
                <span className="flex items-center gap-1.5 text-neutral-400">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" /> Loan Tenure
                </span>
                <span className="font-bold text-white">{tenureMonths} Months ({tenureMonths / 12} Years)</span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {[12, 24, 36, 48, 60].map((months) => (
                  <button
                    key={months}
                    type="button"
                    onClick={() => {
                      engineSound.playClickBeep();
                      setTenureMonths(months);
                    }}
                    className={`py-2 rounded-xl font-rajdhani font-semibold text-xs uppercase tracking-wider transition-colors cursor-pointer border ${
                      tenureMonths === months
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60 shadow-[0_0_10px_rgba(0,229,255,0.2)]'
                        : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    {months} MO
                  </button>
                ))}
              </div>
            </div>

            {/* Annual Interest Rate Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-neutral-300">
                <span className="flex items-center gap-1.5 text-neutral-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> Annual Interest Rate (APR)
                </span>
                <span className="font-bold text-cyan-300">{interestRateAnnual}%</span>
              </div>
              <input
                type="range"
                min={2.5}
                max={8.5}
                step={0.25}
                value={interestRateAnnual}
                onChange={(e) => setInterestRateAnnual(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-neutral-500">
                <span>Super-Prime 2.5%</span>
                <span>Standard 8.5%</span>
              </div>
            </div>
          </div>

          {/* Breakdown Graphic Bar (Principal vs Interest) */}
          <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-mono-tech">
              <span className="text-neutral-400">Amortization Ratio</span>
              <span className="text-neutral-400">
                Principal {calculations.principalPct.toFixed(1)}% / Interest {calculations.interestPct.toFixed(1)}%
              </span>
            </div>

            {/* Dual color progress bar */}
            <div className="h-2.5 w-full bg-neutral-800 rounded-full overflow-hidden flex">
              <div
                style={{ width: `${calculations.principalPct}%` }}
                className="bg-cyan-400 transition-all duration-300"
                title={`Principal: ${formatCurrency(calculations.loanAmount)}`}
              />
              <div
                style={{ width: `${calculations.interestPct}%` }}
                className="bg-amber-400 transition-all duration-300"
                title={`Interest: ${formatCurrency(calculations.totalInterest)}`}
              />
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-neutral-800/80 text-center font-mono-tech text-[11px]">
              <div>
                <span className="text-neutral-500 block">BORROWED PRINCIPAL</span>
                <span className="text-cyan-300 font-semibold">{formatCurrency(calculations.loanAmount)}</span>
              </div>
              <div>
                <span className="text-neutral-500 block">TOTAL INTEREST</span>
                <span className="text-amber-300 font-semibold">{formatCurrency(calculations.totalInterest)}</span>
              </div>
              <div>
                <span className="text-neutral-500 block">TOTAL ACQUISITION</span>
                <span className="text-white font-semibold">{formatCurrency(calculations.totalPayable)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-neutral-900/90 border-t border-neutral-800 flex items-center justify-between text-[11px] font-mono-tech text-neutral-500">
          <span>Formula: [P × r × (1+r)ⁿ] / [(1+r)ⁿ - 1] (Reducing Balance)</span>
          <span className="text-cyan-400">Aura Motors Finance Division</span>
        </div>
      </div>
    </div>
  );
};
