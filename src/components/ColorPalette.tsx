import React from 'react';
import { BodyColorKey, WheelFinishKey, CaliperColorKey } from '../types';
import { Check } from 'lucide-react';
import { engineSound } from '../audio/engineSound';

interface ColorPaletteProps {
  currentColor: BodyColorKey;
  onColorSelect: (color: BodyColorKey) => void;
  currentWheel: WheelFinishKey;
  onWheelSelect: (wheel: WheelFinishKey) => void;
  currentCaliper: CaliperColorKey;
  onCaliperSelect: (caliper: CaliperColorKey) => void;
}

export const ColorPalette: React.FC<ColorPaletteProps> = ({
  currentColor,
  onColorSelect,
  currentWheel,
  onWheelSelect,
  currentCaliper,
  onCaliperSelect,
}) => {
  const bodyColors: {
    id: BodyColorKey;
    name: string;
    sub: string;
    hex: string;
    swatchClass: string;
  }[] = [
    {
      id: 'noir',
      name: 'OBSIDIAN NOIR',
      sub: 'Metallic Deep Carbon',
      hex: '#0b0c10',
      swatchClass: 'bg-gradient-to-br from-neutral-800 via-neutral-900 to-black',
    },
    {
      id: 'gold',
      name: 'CHAMPAGNE GOLD',
      sub: 'Brushed Titanium Pearl',
      hex: '#d4af37',
      swatchClass: 'bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600',
    },
    {
      id: 'cyan',
      name: 'ARCTIC CYAN',
      sub: 'Electric Glacial Lacquer',
      hex: '#00e5ff',
      swatchClass: 'bg-gradient-to-br from-cyan-300 via-cyan-400 to-cyan-700',
    },
    {
      id: 'rosso',
      name: 'VELOCITY ROSSO',
      sub: 'Tri-Coat Candy Rosso',
      hex: '#c4121a',
      swatchClass: 'bg-gradient-to-br from-red-500 via-red-600 to-red-900',
    },
    {
      id: 'bianco',
      name: 'PEARL BIANCO',
      sub: 'Frost Diamond Metallic',
      hex: '#f2f4f7',
      swatchClass: 'bg-gradient-to-br from-white via-neutral-200 to-neutral-400',
    },
  ];

  const wheels: { id: WheelFinishKey; name: string; hex: string }[] = [
    { id: 'stealth', name: 'Stealth Noir', hex: '#16181c' },
    { id: 'titanium', name: 'Forged Titanium', hex: '#7c8188' },
    { id: 'bronze', name: 'Satin Bronze', hex: '#8a6a3b' },
    { id: 'chrome', name: 'Mirror Diamond', hex: '#d8dde4' },
  ];

  const calipers: { id: CaliperColorKey; name: string; hex: string }[] = [
    { id: 'cyan', name: 'Acid Cyan', hex: '#00e5ff' },
    { id: 'gold', name: 'Racing Gold', hex: '#ffb703' },
    { id: 'rosso', name: 'Rosso Corsa', hex: '#e61c24' },
    { id: 'noir', name: 'Carbon Black', hex: '#1a1c22' },
  ];

  const handleBodyColor = (id: BodyColorKey) => {
    engineSound.playClickBeep();
    onColorSelect(id);
  };

  const handleWheel = (id: WheelFinishKey) => {
    engineSound.playClickBeep();
    onWheelSelect(id);
  };

  const handleCaliper = (id: CaliperColorKey) => {
    engineSound.playClickBeep();
    onCaliperSelect(id);
  };

  return (
    <div className="pointer-events-auto bg-neutral-950/80 backdrop-blur-xl border border-neutral-800/80 p-3 md:p-4 rounded-2xl shadow-2xl">
      {/* Title */}
      <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-neutral-800/80 text-[10px] font-mono-tech uppercase tracking-widest text-neutral-400">
        <span>ATELIER BESPOKE FINISHES</span>
        <span className="text-cyan-400">PBR SHADER SPEC</span>
      </div>

      {/* Body Colors Section */}
      <div className="mb-3">
        <div className="text-[11px] font-syne font-bold uppercase text-neutral-300 mb-2">
          Exterior Paint Formulation
        </div>
        <div className="grid grid-cols-5 gap-2">
          {bodyColors.map((color) => {
            const isSelected = currentColor === color.id;
            return (
              <button
                key={color.id}
                id={`color-${color.id}-btn`}
                onClick={() => handleBodyColor(color.id)}
                className={`group relative flex flex-col items-center p-1.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-cyan-400/90 bg-neutral-900/90 shadow-[0_0_12px_rgba(0,229,255,0.25)]'
                    : 'border-neutral-800 hover:border-neutral-700 bg-neutral-900/40'
                }`}
                title={`${color.name} (${color.sub})`}
              >
                {/* Swatch circle */}
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full ${color.swatchClass} flex items-center justify-center shadow-md relative ring-1 ring-white/20`}
                >
                  {isSelected && (
                    <Check className={`w-3.5 h-3.5 ${color.id === 'bianco' ? 'text-black' : 'text-white'}`} />
                  )}
                </div>

                <span className="mt-1 text-[9px] font-mono-tech tracking-tight text-neutral-400 group-hover:text-neutral-200 text-center truncate max-w-full">
                  {color.name.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Secondary Finishes: Wheels & Calipers */}
      <div className="grid grid-cols-2 gap-3 pt-2.5 border-t border-neutral-800/80">
        {/* Wheels */}
        <div>
          <div className="text-[10px] font-mono-tech uppercase text-neutral-400 mb-1.5">
            Forged Wheels
          </div>
          <div className="flex items-center gap-1.5">
            {wheels.map((w) => (
              <button
                key={w.id}
                id={`wheel-${w.id}-btn`}
                onClick={() => handleWheel(w.id)}
                className={`w-6 h-6 rounded-full border transition-all cursor-pointer flex items-center justify-center ${
                  currentWheel === w.id
                    ? 'border-cyan-400 ring-2 ring-cyan-500/30 scale-110'
                    : 'border-neutral-700 hover:scale-105'
                }`}
                style={{ backgroundColor: w.hex }}
                title={w.name}
              />
            ))}
          </div>
        </div>

        {/* Calipers */}
        <div>
          <div className="text-[10px] font-mono-tech uppercase text-neutral-400 mb-1.5">
            Brake Calipers
          </div>
          <div className="flex items-center gap-1.5">
            {calipers.map((c) => (
              <button
                key={c.id}
                id={`caliper-${c.id}-btn`}
                onClick={() => handleCaliper(c.id)}
                className={`w-6 h-6 rounded-full border transition-all cursor-pointer flex items-center justify-center ${
                  currentCaliper === c.id
                    ? 'border-white ring-2 ring-white/30 scale-110'
                    : 'border-neutral-700 hover:scale-105'
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
