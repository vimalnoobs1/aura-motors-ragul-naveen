import React from 'react';
import { Cpu, X, Server, Layers, Volume2, Database, ShieldCheck, Monitor, ArrowRight, GitBranch } from 'lucide-react';
import { engineSound } from '../audio/engineSound';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="arch-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-fade-in"
    >
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-neutral-950 border border-cyan-500/40 rounded-2xl shadow-[0_0_50px_rgba(0,229,255,0.15)] flex flex-col overflow-hidden text-neutral-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-gradient-to-r from-neutral-900/90 to-neutral-950">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 id="arch-modal-title" className="text-base font-rajdhani font-bold tracking-wider text-white uppercase">
                System Architecture & Data Flow
              </h2>
              <span className="text-[10px] text-neutral-400 font-mono-tech">
                AURA MOTORS CAPSTONE TECHNICAL SPECIFICATION
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              engineSound.playClickBeep();
              onClose();
            }}
            className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer border border-neutral-800"
            title="Close Architecture Diagram"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[80vh]">
          {/* Architecture Visual Grid */}
          <div className="space-y-4">
            {/* Layer 1: Client Interactions */}
            <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono-tech text-cyan-400 font-semibold">
                <span className="flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-cyan-400" /> LAYER 1: CLIENT PRESENTATION &amp; INPUT ENGINE
                </span>
                <span className="text-[10px] text-neutral-500">React 18 + Tailwind CSS</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono-tech text-[11px] text-neutral-300">
                <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800">
                  <span className="text-cyan-300 font-semibold block mb-0.5">3D WebGL Viewport</span>
                  <span>Full-screen responsive canvas with dynamic OrbitControls, pan, &amp; camera presets</span>
                </div>
                <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800">
                  <span className="text-cyan-300 font-semibold block mb-0.5">Atelier HUD &amp; Modals</span>
                  <span>Real-time colorways, dihedral door triggers, exploded view dissection, telemetry telemetry</span>
                </div>
                <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800">
                  <span className="text-cyan-300 font-semibold block mb-0.5">Keyboard Control Rig</span>
                  <span>Shortcut bindings: Space (Throttle), D (Doors), W (Wing), E (Exploded), N (Nitro), T (Tour)</span>
                </div>
              </div>
            </div>

            <div className="flex justify-center -my-2 text-neutral-600">
              <ArrowRight className="w-4 h-4 rotate-90" />
            </div>

            {/* Layer 2: State & Native Web Audio Engine */}
            <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono-tech text-amber-400 font-semibold">
                <span className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-amber-400" /> LAYER 2: APPLICATION STATE &amp; PROCEDURAL AUDIO SYNTHESIZER
                </span>
                <span className="text-[10px] text-amber-300">Zero External Audio Files • Native Web Audio API</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono-tech text-[11px] text-neutral-300">
                <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800">
                  <span className="text-amber-300 font-semibold block mb-0.5">V12 Engine Synthesis</span>
                  <span>Multiple harmonic saw/tri oscillators, 12 firing pulses, low-pass filter RPM ramping</span>
                </div>
                <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800">
                  <span className="text-amber-300 font-semibold block mb-0.5">Turbos &amp; Blow-Off Valve</span>
                  <span>High-Q bandpass filtered noise buffer + pneumatic pressure release impulse</span>
                </div>
                <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800">
                  <span className="text-amber-300 font-semibold block mb-0.5">Hydraulics &amp; UI Chimes</span>
                  <span>Resonant mechanical door swoosh &amp; dual-tone high frequency confirmation pings</span>
                </div>
              </div>
            </div>

            <div className="flex justify-center -my-2 text-neutral-600">
              <ArrowRight className="w-4 h-4 rotate-90" />
            </div>

            {/* Layer 3: 3D Graphics Engine (Three.js) */}
            <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono-tech text-purple-400 font-semibold">
                <span className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-purple-400" /> LAYER 3: HIGH-FIDELITY PROCEDURAL 3D GRAPHICS (THREE.JS)
                </span>
                <span className="text-[10px] text-neutral-500">WebGL 2.0 • ACES Filmic Tone Mapping</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono-tech text-[11px] text-neutral-300">
                <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800">
                  <span className="text-purple-300 font-semibold block mb-0.5">PBR Physical Materials</span>
                  <span>Bespoke MeshPhysicalMaterial with clearcoat 1.0, metallic flakes, transmission glass</span>
                </div>
                <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800">
                  <span className="text-purple-300 font-semibold block mb-0.5">Kinematic Rigging</span>
                  <span>Hierarchical dihedral door pivots, active dual-stage aero wing, exploded module offsets</span>
                </div>
                <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800">
                  <span className="text-purple-300 font-semibold block mb-0.5">Lighting &amp; Studio Stage</span>
                  <span>Key, rim, backlight array, ground cyber ring, shadow maps, and CFD airflow lines</span>
                </div>
              </div>
            </div>

            <div className="flex justify-center -my-2 text-neutral-600">
              <ArrowRight className="w-4 h-4 rotate-90" />
            </div>

            {/* Layer 4: Simulated Enterprise Data Architecture */}
            <div className="p-4 rounded-xl bg-neutral-900/60 border border-cyan-500/40 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono-tech text-cyan-400 font-semibold">
                <span className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-cyan-400" /> LAYER 4: AURADB POSTGRESQL 16.4 CLUSTER [SIMULATION]
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  FRONTEND SIMULATION
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono-tech text-[11px] text-neutral-300">
                <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800">
                  <span className="text-cyan-300 font-semibold block mb-0.5">PostgreSQL 16.4 Tables</span>
                  <span>vehicles, atelier_orders, telemetry_logs, cluster_nodes with live search &amp; sort</span>
                </div>
                <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800">
                  <span className="text-cyan-300 font-semibold block mb-0.5">SQL Query Terminal</span>
                  <span>Interactive SQL execution terminal with simulated latency, EXPLAIN plans, buffer hits</span>
                </div>
                <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800">
                  <span className="text-cyan-300 font-semibold block mb-0.5">Security &amp; RBAC Auth</span>
                  <span>Role-based access levels 2–5 (Architect, Engineer, Admin, Evaluator) + TLS 1.3</span>
                </div>
              </div>
            </div>
          </div>

          {/* Verification & Compliance Note */}
          <div className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-800 text-xs font-mono-tech space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>CAPSTONE PROJECT CRITICAL ARCHITECTURAL CONSTRAINTS</span>
            </div>
            <ul className="space-y-1.5 text-neutral-400 text-[11px] list-disc list-inside">
              <li><strong className="text-neutral-200">Zero Audio Assets:</strong> All sounds are mathematically generated at runtime using Web Audio API nodes without external MP3/WAV requests.</li>
              <li><strong className="text-neutral-200">Simulated Enterprise Database:</strong> AuraDB simulates a real PostgreSQL 16.4 cluster entirely client-side without requiring unauthenticated external DB servers.</li>
              <li><strong className="text-neutral-200">Independent 3D Scene:</strong> Three.js canvas runs directly inside modern WebGL with procedural geometry generation for the hypercar monocoque.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-neutral-900/90 border-t border-neutral-800 flex items-center justify-between text-[11px] font-mono-tech text-neutral-500">
          <span>AURA MOTORS — Luxury Automotive Atelier &amp; 3D Virtual Showroom</span>
          <span className="text-cyan-400 flex items-center gap-1">
            <GitBranch className="w-3 h-3" /> v2.4.0 Production Build
          </span>
        </div>
      </div>
    </div>
  );
};
