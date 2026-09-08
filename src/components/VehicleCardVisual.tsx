import React from 'react';
import { VehicleSpec } from '../data/vehicles';

interface VehicleCardVisualProps {
  vehicle: VehicleSpec;
  isHovered?: boolean;
}

export const VehicleCardVisual: React.FC<VehicleCardVisualProps> = ({
  vehicle,
  isHovered = false,
}) => {
  // Determine silhouette profile based on vehicle id
  const isSuv = vehicle.id === 'aura-titan-s';
  const isShootingBrake = vehicle.id === 'aura-valkyrie-gt';
  const isLongtail = vehicle.id === 'aura-zenith';
  const isTrack = vehicle.id === 'aura-phantom-x' || vehicle.id === 'aura-apex-r' || vehicle.id === 'aura-stratos-gt3';
  const isRoadster = vehicle.id === 'aura-eclipse-gt';
  const isLimousine = vehicle.id === 'aura-monarch';

  let bodyPath = 'M 40 100 Q 70 82 120 78 L 190 74 Q 240 50 300 48 Q 360 48 400 70 L 460 78 Q 500 85 530 100 Q 535 106 525 110 L 460 112 Q 430 85 390 85 Q 350 85 330 112 L 210 112 Q 190 85 150 85 Q 110 85 90 112 L 35 110 Z';
  let canopyPath = 'M 220 74 Q 260 52 300 50 Q 350 50 380 72 Z';
  let wingPath = '';

  if (isSuv) {
    bodyPath = 'M 35 110 Q 55 75 110 70 L 200 68 Q 230 42 300 40 L 410 40 Q 450 42 470 65 L 525 80 Q 545 92 535 112 L 465 114 Q 440 85 395 85 Q 350 85 335 114 L 205 114 Q 185 85 140 85 Q 95 85 80 114 L 30 112 Z';
    canopyPath = 'M 215 68 L 290 44 L 405 44 L 450 68 Z';
  } else if (isShootingBrake) {
    bodyPath = 'M 40 102 Q 70 80 125 76 L 195 72 Q 240 48 310 48 L 420 48 Q 450 52 485 75 L 530 96 Q 535 106 525 112 L 460 112 Q 430 85 390 85 Q 350 85 330 112 L 210 112 Q 190 85 150 85 Q 110 85 90 112 L 35 110 Z';
    canopyPath = 'M 225 72 L 305 50 L 415 50 L 465 74 Z';
  } else if (isLongtail) {
    bodyPath = 'M 20 102 Q 60 82 120 78 L 190 74 Q 240 48 300 46 Q 360 46 395 68 L 470 76 Q 515 82 545 98 Q 555 106 540 112 L 470 112 Q 435 85 395 85 Q 355 85 335 112 L 210 112 Q 190 85 150 85 Q 110 85 90 112 L 20 110 Z';
    canopyPath = 'M 215 74 Q 255 50 300 48 Q 350 48 385 70 Z';
    wingPath = 'M 25 90 L 70 86 L 68 92 L 23 96 Z';
  } else if (isTrack) {
    wingPath = 'M 50 58 L 105 55 L 102 62 L 48 65 Z';
    canopyPath = 'M 220 74 Q 260 52 300 50 Q 350 50 380 72 Z';
  } else if (isRoadster) {
    canopyPath = 'M 230 76 Q 270 66 310 66 Q 340 66 360 76 Z';
  } else if (isLimousine) {
    bodyPath = 'M 30 108 Q 50 82 110 78 L 190 75 Q 230 48 310 46 L 430 46 Q 465 50 500 78 L 540 92 Q 550 104 535 112 L 465 114 Q 440 85 395 85 Q 350 85 335 114 L 205 114 Q 185 85 140 85 Q 95 85 80 114 L 25 112 Z';
    canopyPath = 'M 215 75 L 305 48 L 420 48 L 480 75 Z';
  }

  const accent = vehicle.accentColor || '#C0C0C0';

  return (
    <div className="relative w-full h-52 sm:h-60 flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-[#1c202d] via-[#141723] to-[#0d0f16] border border-neutral-750/70 transition-all duration-700 shadow-inner">
      {/* Precision Gallery Lighting (Overhead atelier softbox glow) */}
      <div className="absolute top-0 inset-x-0 h-28 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.1)_0%,_rgba(212,175,55,0.03)_40%,_transparent_75%)] pointer-events-none" />

      {/* Showroom Atelier Horizon & Floor Tile Reflection */}
      <div className="absolute bottom-7 inset-x-4 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37]/35 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-7 bg-gradient-to-t from-[#0a0c12]/80 to-transparent pointer-events-none" />

      {/* Subtle underbody ambient reflection */}
      <div
        className="absolute bottom-7 left-1/2 -translate-x-1/2 w-3/4 h-7 rounded-full blur-xl pointer-events-none transition-opacity duration-500"
        style={{
          backgroundColor: accent,
          opacity: isHovered ? 0.28 : 0.12,
        }}
      />

      {/* Vehicle Vector Graphic */}
      <div
        className={`relative z-10 w-full max-w-[92%] transition-all duration-500 ease-out transform ${
          isHovered ? '-translate-y-2 scale-[1.03]' : 'translate-y-0 scale-100'
        }`}
      >
        <svg
          viewBox="0 0 570 150"
          className="w-full h-auto drop-shadow-[0_15px_30px_rgba(0,0,0,0.85)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={`paint-${vehicle.id}`} x1="0%" y1="0%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#141822" />
              <stop offset="25%" stopColor={accent} stopOpacity="0.45" />
              <stop offset="55%" stopColor="#10141d" />
              <stop offset="85%" stopColor="#1a202c" />
              <stop offset="100%" stopColor="#0a0d13" />
            </linearGradient>

            <linearGradient id={`glass-${vehicle.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e2e8f0" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#64748b" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* Underbody Shadow */}
          <ellipse cx="285" cy="133" rx="245" ry="9" fill="#000000" opacity="0.9" />

          {/* Rear Wing (if applicable) */}
          {wingPath && (
            <path
              d={wingPath}
              fill="#18181b"
              stroke="#52525b"
              strokeWidth="1.5"
            />
          )}

          {/* Car Body Shell */}
          <path
            d={bodyPath}
            fill={`url(#paint-${vehicle.id})`}
            stroke={isHovered ? '#94a3b8' : '#334155'}
            strokeWidth={isHovered ? '1.5' : '1'}
            strokeLinejoin="round"
          />

          {/* Subtle Crease / Reflection Highlight */}
          <path
            d="M 140 85 Q 240 76 380 76 L 460 82"
            stroke="#ffffff"
            strokeWidth="0.7"
            strokeOpacity={isHovered ? '0.5' : '0.25'}
          />

          {/* Greenhouse Glass Canopy */}
          <path
            d={canopyPath}
            fill={`url(#glass-${vehicle.id})`}
            stroke="#94a3b8"
            strokeWidth="0.8"
            strokeOpacity="0.5"
          />

          {/* Front Alloy Wheel */}
          <circle cx="150" cy="112" r="23" fill="#090a0f" stroke="#475569" strokeWidth="2" />
          <circle cx="150" cy="112" r="14" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />
          <circle cx="150" cy="112" r="5" fill="#f8fafc" />
          <path d="M 150 98 L 150 126 M 136 112 L 164 112 M 140 102 L 160 122 M 140 122 L 160 102" stroke="#94a3b8" strokeWidth="1" strokeOpacity="0.6" />

          {/* Rear Alloy Wheel */}
          <circle cx="390" cy="112" r="23" fill="#090a0f" stroke="#475569" strokeWidth="2" />
          <circle cx="390" cy="112" r="14" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />
          <circle cx="390" cy="112" r="5" fill="#f8fafc" />
          <path d="M 390 98 L 390 126 M 376 112 L 404 112 M 380 102 L 400 122 M 380 122 L 400 102" stroke="#94a3b8" strokeWidth="1" strokeOpacity="0.6" />

          {/* Slim Matrix Headlight & Taillight Bars */}
          <path d="M 505 98 L 528 101" stroke="#f8fafc" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
          <path d="M 42 101 L 58 102" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
        </svg>
      </div>
    </div>
  );
};
