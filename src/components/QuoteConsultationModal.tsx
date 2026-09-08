import React, { useState } from 'react';
import { VehicleSpec } from '../data/vehicles';
import { ConfigSummary } from './ConfiguratorSection';
import { FinanceDetails } from './FinanceSection';
import { X, Check, Copy, Shield, Calendar, MapPin, Phone, Mail, User, Sparkles, Download, CheckCircle2 } from 'lucide-react';
import { engineSound } from '../audio/engineSound';

interface QuoteConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: VehicleSpec;
  configSummary?: ConfigSummary | null;
  financeDetails?: FinanceDetails | null;
  mode?: 'quote' | 'viewing';
}

export const QuoteConsultationModal: React.FC<QuoteConsultationModalProps> = ({
  isOpen,
  onClose,
  vehicle,
  configSummary,
  financeDetails,
  mode = 'quote',
}) => {
  const [activeTab, setActiveTab] = useState<'quote' | 'viewing'>(mode);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Monaco');
  const [timeline, setTimeline] = useState('3-6 Months');
  const [bespokeNotes, setBespokeNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [commissionRef, setCommissionRef] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const cities = [
    'Monaco',
    'Zurich',
    'Geneva',
    'London',
    'Dubai',
    'New York',
    'Tokyo',
    'Singapore',
    'Mumbai',
    'Los Angeles',
  ];

  const timelines = [
    'Immediate Allocation (Priority Slot)',
    '3–6 Months',
    '1 Year',
    'Collector Reserve (2027/28)',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    engineSound.playActivationChime();
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const ref = `AURA-CMSN-2026-${randomCode}-CH`;
    setCommissionRef(ref);
    setIsSubmitted(true);
  };

  const getManifestText = () => {
    return `=== AURA MOTORS PRIVATE CLIENT COMMISSION ===
Commission Reference: ${commissionRef}
Client Name: ${fullName || 'Private Client'}
Destination City: ${city}
Preferred Delivery: ${timeline}
Vehicle: ${vehicle.name} (${vehicle.drivetrain})
Base Valuation: ₹${vehicle.priceInCrores.toFixed(2)} CR

Bespoke Configuration:
- Paint: ${configSummary ? configSummary.paintName : 'Standard Atelier Noir'}
- Wheels: ${configSummary ? configSummary.wheelName : '21" Forged Billet Titanium'}
- Calipers: ${configSummary ? configSummary.caliperName : 'Quantum Cyan'}
- Salon: ${configSummary ? configSummary.interiorName : 'Nero Ade & Acid Cyan'}
- Carbon: ${configSummary ? configSummary.carbonName : 'Gloss 3K Twill Carbon'}
- Valuation: ₹${configSummary ? (configSummary.finalPriceInInr / 10000000).toFixed(2) : vehicle.priceInCrores.toFixed(2)} CR

Atelier Advisor: Jean-Luc Vance, Senior Director of Private Client Commissions
Headquarters: Rue du Rhône, Geneva, Switzerland
============================================`;
  };

  const handleCopyManifest = () => {
    navigator.clipboard.writeText(getManifestText());
    setCopied(true);
    engineSound.playConfirmationBeep();
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-neutral-950 border border-neutral-800 shadow-[0_25px_70px_rgba(0,0,0,0.9)] overflow-hidden my-8">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-850">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <div>
              <span className="text-[10px] font-mono-tech uppercase tracking-widest text-cyan-400 block">
                GENEVA ATELIER CONCIERGE
              </span>
              <h3 className="text-xl font-rajdhani font-bold text-white uppercase">
                {isSubmitted ? 'COMMISSION CONFIRMED' : 'BESPOKE COMMISSIONS & INQUIRIES'}
              </h3>
            </div>
          </div>

          <button
            id="modal-close-btn"
            onClick={onClose}
            className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 cursor-pointer transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {!isSubmitted ? (
          <div>
            {/* Tab switch */}
            <div className="flex border-b border-neutral-850 px-6 pt-4 gap-4">
              <button
                type="button"
                onClick={() => setActiveTab('quote')}
                className={`pb-3 text-xs font-rajdhani font-bold tracking-wider uppercase cursor-pointer border-b-2 transition-all ${
                  activeTab === 'quote'
                    ? 'border-cyan-400 text-cyan-300'
                    : 'border-transparent text-neutral-400 hover:text-neutral-200'
                }`}
              >
                REQUEST FORMAL QUOTE
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('viewing')}
                className={`pb-3 text-xs font-rajdhani font-bold tracking-wider uppercase cursor-pointer border-b-2 transition-all ${
                  activeTab === 'viewing'
                    ? 'border-cyan-400 text-cyan-300'
                    : 'border-transparent text-neutral-400 hover:text-neutral-200'
                }`}
              >
                BOOK PRIVATE ATELIER VIEWING
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Selected Vehicle Overview Banner */}
              <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800 flex items-center justify-between text-xs font-mono-tech">
                <div>
                  <span className="text-neutral-400 block text-[10px]">COMMISSION VEHICLE:</span>
                  <span className="text-white font-bold text-sm font-rajdhani">{vehicle.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-neutral-400 block text-[10px]">CURRENT VALUATION:</span>
                  <span className="text-cyan-400 font-bold font-rajdhani text-sm">
                    ₹{configSummary ? (configSummary.finalPriceInInr / 10000000).toFixed(2) : vehicle.priceInCrores.toFixed(2)} CR
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-mono-tech uppercase text-neutral-400 block mb-1.5">
                    CLIENT FULL NAME *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-3 text-neutral-500" />
                    <input
                      required
                      type="text"
                      placeholder="e.g. Lord Alistair Vance"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-600 text-xs focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-mono-tech uppercase text-neutral-400 block mb-1.5">
                    CONFIDENTIAL EMAIL *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-3 text-neutral-500" />
                    <input
                      required
                      type="email"
                      placeholder="client@familyoffice.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-600 text-xs focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-mono-tech uppercase text-neutral-400 block mb-1.5">
                    TELEPHONE / SECURE WHATSAPP *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-3 text-neutral-500" />
                    <input
                      required
                      type="tel"
                      placeholder="+41 22 819 0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-600 text-xs focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-mono-tech uppercase text-neutral-400 block mb-1.5">
                    PREFERRED RESIDENCE / DELIVERY CITY
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 absolute left-3 top-3 text-neutral-500" />
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs focus:border-cyan-400 focus:outline-none appearance-none cursor-pointer"
                    >
                      {cities.map((c) => (
                        <option key={c} value={c} className="bg-neutral-950">
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono-tech uppercase text-neutral-400 block mb-1.5">
                  COMMISSION TIMELINE PREFERENCE
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {timelines.map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setTimeline(t)}
                      className={`p-2.5 rounded-xl text-left text-xs font-mono-tech border transition-all cursor-pointer ${
                        timeline === t
                          ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                          : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono-tech uppercase text-neutral-400 block mb-1.5">
                  ADDITIONAL BESPOKE REQUESTS (ARMORING, SPECIAL MATERIALS, LIVERY)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g., Requesting private circuit delivery at Circuit Paul Ricard with customized titanium door treadplates..."
                  value={bespokeNotes}
                  onChange={(e) => setBespokeNotes(e.target.value)}
                  className="w-full p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-600 text-xs focus:border-cyan-400 focus:outline-none"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-4 border-t border-neutral-850 flex items-center justify-between">
                <span className="text-[10px] font-mono-tech text-neutral-500 flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-cyan-400" />
                  STRICT NON-DISCLOSURE ENFORCED
                </span>

                <button
                  type="submit"
                  id="submit-quote-btn"
                  className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-rajdhani font-bold text-xs tracking-wider uppercase transition-all cursor-pointer shadow-[0_0_20px_rgba(0,229,255,0.3)]"
                >
                  {activeTab === 'quote' ? 'SUBMIT COMMISSION DOSSIER' : 'CONFIRM PRIVATE APPOINTMENT'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Confirmation State */
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-mono-tech uppercase tracking-widest text-cyan-400 block">
                COMMISSION DOSSIER LODGED
              </span>
              <h3 className="text-2xl sm:text-3xl font-rajdhani font-bold text-white uppercase mt-1">
                COMMISSION #{commissionRef}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 mt-2 max-w-md mx-auto font-sans">
                Thank you, <strong className="text-white">{fullName || 'Valued Client'}</strong>. Your allocation request for the <strong className="text-cyan-400">{vehicle.name}</strong> has been transmitted directly to our executive suite.
              </p>
            </div>

            {/* Advisor Card */}
            <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 text-left max-w-md mx-auto">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-neutral-800 border border-cyan-500/40 flex items-center justify-center font-rajdhani font-bold text-cyan-300 text-lg">
                  JV
                </div>
                <div>
                  <span className="text-[10px] font-mono-tech uppercase text-cyan-400 block">
                    ASSIGNED ATELIER ADVISOR
                  </span>
                  <div className="text-base font-rajdhani font-bold text-white">
                    Jean-Luc Vance
                  </div>
                  <span className="text-xs text-neutral-400 font-sans block">
                    Senior Vice President, Private Client Commissions • Geneva
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-neutral-800 text-[11px] font-mono-tech text-neutral-400 flex justify-between">
                <span>DESTINATION: {city.toUpperCase()}</span>
                <span className="text-cyan-400">CONTACT WITHIN 4 HOURS</span>
              </div>
            </div>

            {/* Spec Manifest Copy & Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                id="copy-spec-btn"
                onClick={handleCopyManifest}
                className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-750 text-neutral-200 text-xs font-rajdhani font-bold tracking-wider uppercase transition-all cursor-pointer flex items-center gap-2"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-cyan-400" />}
                <span>{copied ? 'SPEC COPIED TO CLIPBOARD' : 'COPY COMMISSION SPEC'}</span>
              </button>

              <button
                id="close-confirmation-btn"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 text-xs font-rajdhani font-bold tracking-wider uppercase transition-all cursor-pointer"
              >
                RETURN TO SHOWROOM
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
