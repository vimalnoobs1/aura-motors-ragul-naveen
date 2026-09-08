import React from 'react';
import { VehicleState } from '../types';
import { Play, Pause, Wind, Lightbulb, DoorClosed, DoorOpen, Zap, Flame, Layers, Gauge } from 'lucide-react';
import { engineSound } from '../audio/engineSound';

interface InteractiveControlsProps {
  vehicleState: VehicleState;
  onUpdateState: (updates: Partial<VehicleState>) => void;
  isRevving: boolean;
  onRevStart: () => void;
  onRevEnd: () => void;
}

export const InteractiveControls: React.FC<InteractiveControlsProps> = ({
  vehicleState,
  onUpdateState,
  isRevving,
  onRevStart,
  onRevEnd,
}) => {
  const toggleDoors = () => {
    engineSound.playClickBeep();
    onUpdateState({ doorsOpen: !vehicleState.doorsOpen });
  };

  const cycleWing = () => {
    engineSound.playClickBeep();
    const modes: VehicleState['wingAngle'][] = ['retracted', 'active', 'airbrake'];
    const nextIdx = (modes.indexOf(vehicleState.wingAngle) + 1) % modes.length;
    onUpdateState({ wingAngle: modes[nextIdx] });
  };

  const cycleLights = () => {
    engineSound.playClickBeep();
    const modes: VehicleState['headlights'][] = ['off', 'drl', 'full'];
    const nextIdx = (modes.indexOf(vehicleState.headlights) + 1) % modes.length;
    onUpdateState({ headlights: modes[nextIdx] });
  };

  const toggleUnderglow = () => {
    engineSound.playClickBeep();
    onUpdateState({ underglow: !vehicleState.underglow });
  };

  const toggleAeroFlow = () => {
    engineSound.playClickBeep();
    onUpdateState({ showAeroFlow: !vehicleState.showAeroFlow });
  };

  const toggleTurntable = () => {
    engineSound.playClickBeep();
    onUpdateState({
      turntableSpeed: vehicleState.turntableSpeed > 0 ? 0 : 1,
    });
  };

  const toggleExplodedView = () => {
    engineSound.playActivationChime();
    onUpdateState({ explodedView: !vehicleState.explodedView });
  };

  const toggleNitro = () => {
    const nextNitro = !vehicleState.nitroActive;
    if (nextNitro) {
      engineSound.triggerNitro();
    } else {
      engineSound.playClickBeep();
    }
    onUpdateState({ nitroActive: nextNitro });
  };

  return (
    <div className="pointer-events-auto bg-neutral-950/80 backdrop-blur-xl border border-neutral-800/80 p-3 md:p-4 rounded-2xl shadow-2xl">
      {/* Title */}
      <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-neutral-800/80 text-[10px] font-mono-tech uppercase tracking-widest text-neutral-400">
        <span>INTERACTIVE KINEMATICS</span>
        <span className="text-amber-400">REAL-TIME RIG</span>
      </div>

      {/* Grid of kinematic buttons (8 controls in 4x2 or 8 cols) */}
      <div className="grid grid-cols-4 gap-2 mb-3">
        {/* Dihedral Butterfly Doors */}
        <button
          id="door-toggle-btn"
          onClick={toggleDoors}
          className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all cursor-pointer ${
            vehicleState.doorsOpen
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60 shadow-[0_0_12px_rgba(0,229,255,0.2)]'
              : 'bg-neutral-900/50 text-neutral-400 border-neutral-800 hover:border-neutral-700'
          }`}
          title="Toggle Dihedral Butterfly Doors"
        >
          {vehicleState.doorsOpen ? <DoorOpen className="w-4 h-4 mb-1" /> : <DoorClosed className="w-4 h-4 mb-1" />}
          <span className="text-[10px] font-mono-tech uppercase">Doors</span>
          <span className="text-[9px] font-mono-tech text-cyan-400">
            {vehicleState.doorsOpen ? 'OPEN' : 'CLOSED'}
          </span>
        </button>

        {/* Active Aero Wing */}
        <button
          id="wing-mode-btn"
          onClick={cycleWing}
          className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all cursor-pointer ${
            vehicleState.wingAngle !== 'retracted'
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60 shadow-[0_0_12px_rgba(0,229,255,0.2)]'
              : 'bg-neutral-900/50 text-neutral-400 border-neutral-800 hover:border-neutral-700'
          }`}
          title="Cycle Active Aero Wing Angle"
        >
          <Wind className="w-4 h-4 mb-1" />
          <span className="text-[10px] font-mono-tech uppercase">Aero Wing</span>
          <span className="text-[9px] font-mono-tech text-cyan-400 uppercase">
            {vehicleState.wingAngle}
          </span>
        </button>

        {/* Headlights */}
        <button
          id="lights-mode-btn"
          onClick={cycleLights}
          className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all cursor-pointer ${
            vehicleState.headlights !== 'off'
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-[0_0_12px_rgba(212,175,55,0.2)]'
              : 'bg-neutral-900/50 text-neutral-400 border-neutral-800 hover:border-neutral-700'
          }`}
          title="Cycle LED Headlights & DRLs"
        >
          <Lightbulb className="w-4 h-4 mb-1" />
          <span className="text-[10px] font-mono-tech uppercase">LED Optics</span>
          <span className="text-[9px] font-mono-tech text-amber-400 uppercase">
            {vehicleState.headlights}
          </span>
        </button>

        {/* Underglow */}
        <button
          id="underglow-toggle-btn"
          onClick={toggleUnderglow}
          className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all cursor-pointer ${
            vehicleState.underglow
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60 shadow-[0_0_12px_rgba(0,229,255,0.2)]'
              : 'bg-neutral-900/50 text-neutral-400 border-neutral-800 hover:border-neutral-700'
          }`}
          title="Ground Illumination Underglow"
        >
          <Zap className="w-4 h-4 mb-1" />
          <span className="text-[10px] font-mono-tech uppercase">Underglow</span>
          <span className="text-[9px] font-mono-tech text-cyan-400">
            {vehicleState.underglow ? 'ON' : 'OFF'}
          </span>
        </button>

        {/* Exploded View */}
        <button
          id="exploded-view-btn"
          onClick={toggleExplodedView}
          className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all cursor-pointer ${
            vehicleState.explodedView
              ? 'bg-amber-500/25 text-amber-300 border-amber-500/70 shadow-[0_0_16px_rgba(245,158,11,0.3)]'
              : 'bg-neutral-900/50 text-neutral-400 border-neutral-800 hover:border-neutral-700'
          }`}
          title="Separate Body Modules (Exploded Assembly View)"
        >
          <Layers className="w-4 h-4 mb-1" />
          <span className="text-[10px] font-mono-tech uppercase">Exploded</span>
          <span className="text-[9px] font-mono-tech text-amber-400">
            {vehicleState.explodedView ? 'DISSECTED' : 'INTEGRATED'}
          </span>
        </button>

        {/* Nitro Overboost */}
        <button
          id="nitro-overboost-btn"
          onClick={toggleNitro}
          className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all cursor-pointer ${
            vehicleState.nitroActive
              ? 'bg-cyan-400/30 text-cyan-200 border-cyan-400 shadow-[0_0_18px_rgba(0,229,255,0.4)] animate-pulse'
              : 'bg-neutral-900/50 text-neutral-400 border-neutral-800 hover:border-neutral-700'
          }`}
          title="Quad Exhaust Plasma Flames & Hybrid Overboost"
        >
          <Gauge className="w-4 h-4 mb-1" />
          <span className="text-[10px] font-mono-tech uppercase">Nitro Boost</span>
          <span className="text-[9px] font-mono-tech text-cyan-300">
            {vehicleState.nitroActive ? 'FIRING' : 'READY'}
          </span>
        </button>

        {/* CFD Aero Streamlines */}
        <button
          id="aero-stream-btn"
          onClick={toggleAeroFlow}
          className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all cursor-pointer ${
            vehicleState.showAeroFlow
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60 shadow-[0_0_12px_rgba(0,229,255,0.2)]'
              : 'bg-neutral-900/50 text-neutral-400 border-neutral-800 hover:border-neutral-700'
          }`}
          title="CFD Aerodynamic Airflow Visualization"
        >
          <Wind className="w-4 h-4 mb-1 animate-pulse" />
          <span className="text-[10px] font-mono-tech uppercase">CFD Stream</span>
          <span className="text-[9px] font-mono-tech text-cyan-400">
            {vehicleState.showAeroFlow ? 'ACTIVE' : 'OFF'}
          </span>
        </button>

        {/* Turntable Auto Rotate */}
        <button
          id="turntable-btn"
          onClick={toggleTurntable}
          className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all cursor-pointer ${
            vehicleState.turntableSpeed > 0
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60 shadow-[0_0_12px_rgba(0,229,255,0.2)]'
              : 'bg-neutral-900/50 text-neutral-400 border-neutral-800 hover:border-neutral-700'
          }`}
          title="Auto-Rotate Showroom Turntable"
        >
          {vehicleState.turntableSpeed > 0 ? (
            <Pause className="w-4 h-4 mb-1" />
          ) : (
            <Play className="w-4 h-4 mb-1" />
          )}
          <span className="text-[10px] font-mono-tech uppercase">360° Turn</span>
          <span className="text-[9px] font-mono-tech text-cyan-400">
            {vehicleState.turntableSpeed > 0 ? 'ROTATE' : 'PAUSED'}
          </span>
        </button>
      </div>

      {/* Interactive V12 Throttle / Rev Engine Button */}
      <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between gap-3">
        <div className="text-[11px] font-mono-tech text-neutral-400">
          <div className="flex items-center gap-1.5 text-neutral-300 font-semibold">
            <Flame className="w-3.5 h-3.5 text-red-400" />
            <span>V12 ACOUSTIC REV SYNTHESIZER</span>
          </div>
          <span className="text-[9px] text-neutral-500">Hold button or spacebar to spool turbos</span>
        </div>

        <button
          id="throttle-rev-btn"
          onMouseDown={onRevStart}
          onMouseUp={onRevEnd}
          onMouseLeave={onRevEnd}
          onTouchStart={onRevStart}
          onTouchEnd={onRevEnd}
          className={`px-5 py-2.5 rounded-xl font-rajdhani font-bold text-sm tracking-widest uppercase transition-all cursor-pointer select-none active:scale-95 ${
            isRevving
              ? 'bg-gradient-to-r from-red-600 via-amber-500 to-red-600 text-white shadow-[0_0_25px_rgba(239,68,68,0.7)] scale-95'
              : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-red-500/40 hover:border-red-500/80 shadow-[0_0_12px_rgba(239,68,68,0.15)]'
          }`}
        >
          {isRevving ? 'THROTTLE ENGAGED!' : 'PRESS & HOLD THROTTLE'}
        </button>
      </div>
    </div>
  );
};
