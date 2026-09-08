import React from 'react';
import { X, Shield, Zap, Wind, Cpu, Activity, Award } from 'lucide-react';

interface EngineeringModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EngineeringModal: React.FC<EngineeringModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const sections = [
    {
      title: 'CARBON-FIBER MONOCOQUE CHASSIS',
      icon: <Shield className="w-4 h-4 text-cyan-400" />,
      specs: [
        { label: 'Torsional Rigidity', value: '68,000 Nm/deg' },
        { label: 'Tub Material', value: 'Autoclaved T1000G Carbon Matrix' },
        { label: 'Crash Structure', value: 'Integrated Front & Rear Hex-Honeycomb' },
        { label: 'Dry Curb Weight', value: '1,380 kg (3,042 lbs)' },
        { label: 'Weight Distribution', value: '44% Front / 56% Rear' },
      ],
    },
    {
      title: 'TWIN-TURBO HYBRID V12 POWERTRAIN',
      icon: <Zap className="w-4 h-4 text-amber-400" />,
      specs: [
        { label: 'Combustion Engine', value: '6.5L 60° Quad-Cam 48V V12 Twin-Turbo' },
        { label: 'Combustion Output', value: '980 BHP @ 8,800 RPM' },
        { label: 'Electric Hybrid Drive', value: 'Tri-Motor Axial-Flux 800V Architecture' },
        { label: 'Electric Boost Output', value: '500 BHP (Instant Torque Vectoring)' },
        { label: 'Combined System Output', value: '1,480 BHP / 1,250 Nm' },
        { label: 'Max Engine Redline', value: '9,200 RPM' },
      ],
    },
    {
      title: 'ACTIVE AERODYNAMICS & FLUID DYNAMICS',
      icon: <Wind className="w-4 h-4 text-emerald-400" />,
      specs: [
        { label: 'Net Downforce @ 300 km/h', value: '840 kg (High-Downforce Mode)' },
        { label: 'Drag Coefficient (Cd)', value: '0.28 (Slick) / 0.46 (Airbrake)' },
        { label: 'Underbody Venturi', value: 'Twin Accelerated Ground-Effect Strakes' },
        { label: 'Rear Active Wing', value: 'Dual-Stage Hydraulic Kinematic Tilt' },
      ],
    },
    {
      title: 'CHASSIS DYNAMICS & SUSPENSION',
      icon: <Activity className="w-4 h-4 text-indigo-400" />,
      specs: [
        { label: 'Suspension Type', value: 'F1 Pushrod Magneto-Rheological Dampers' },
        { label: 'Front Brake Rotors', value: '410mm Carbon-Ceramic Perforated Discs' },
        { label: 'Front Calipers', value: '10-Piston Monoblock Titanium Alloy' },
        { label: 'Rear Brake Rotors', value: '390mm Carbon-Ceramic 6-Piston' },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#090a0e] border border-neutral-800 rounded-3xl p-6 md:p-8 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-neutral-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono-tech uppercase tracking-[0.25em] text-cyan-400">
              <Cpu className="w-4 h-4" />
              <span>AURA ENGINEERING LABORATORY</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-cinzel font-bold tracking-wider text-white mt-1">
              SPECTRE V12 TECHNICAL BLUEPRINT
            </h2>
          </div>

          <button
            id="close-engineering-btn"
            onClick={onClose}
            className="p-2.5 rounded-full bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Blueprint Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sections.map((section, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-neutral-950/70 border border-neutral-800/80 hover:border-neutral-700/80 transition-all"
            >
              <div className="flex items-center gap-2 pb-2.5 mb-3 border-b border-neutral-800/60 text-xs font-syne font-bold tracking-wider text-neutral-200">
                {section.icon}
                <span>{section.title}</span>
              </div>

              <div className="space-y-2">
                {section.specs.map((spec, sIdx) => (
                  <div
                    key={sIdx}
                    className="flex items-center justify-between text-xs font-mono-tech py-1 border-b border-neutral-900/60 last:border-0"
                  >
                    <span className="text-neutral-500">{spec.label}</span>
                    <span className="text-neutral-200 font-medium text-right">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footnote */}
        <div className="mt-6 pt-4 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono-tech text-neutral-500 gap-2">
          <span>ATELIER TELEMETRY VERIFIED • ISO 9001 HYPERCAR BENCHMARK</span>
          <span className="text-cyan-400">CHASSIS AM-SPECTRE-01 READY FOR TRACK DEPLOYMENT</span>
        </div>
      </div>
    </div>
  );
};
