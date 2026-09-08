import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Cpu, Zap, Radio, FastForward } from 'lucide-react';
import { engineSound } from '../audio/engineSound';

interface StartupSequenceProps {
  onComplete: () => void;
}

export const StartupSequence: React.FC<StartupSequenceProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<number>(0);
  const [telemetryLogs, setTelemetryLogs] = useState<string[]>([]);

  useEffect(() => {
    // Phase 0: Pure Black
    const t0 = setTimeout(() => {
      setPhase(1); // AURA MOTORS reveal
      engineSound.playStartupChime();
    }, 400);

    // Phase 1 -> Phase 2: System initialization
    const t1 = setTimeout(() => {
      setPhase(2);
      const logs = [
        'INITIALIZING CARBON COMPOSITE TELEMETRY...',
        'TWIN-TURBO 60° V12 SENSOR BUS: ONLINE',
        '800V DUAL SILICON-CARBIDE INVERTER: 100% READY',
        'ACTIVE KINEMATIC REAR WING RIGGING: SYNCED',
        'PBR RAY-MARCHED SHADER PIPELINE: OPTIMAL',
      ];
      logs.forEach((log, index) => {
        setTimeout(() => {
          setTelemetryLogs((prev) => [...prev, log]);
          engineSound.playClickBeep();
        }, index * 260);
      });
    }, 1800);

    // Phase 2 -> Phase 3: Vehicle Reveal
    const t2 = setTimeout(() => {
      setPhase(3);
    }, 3400);

    // Phase 3 -> Phase 4: Showroom lighting activates
    const t3 = setTimeout(() => {
      setPhase(4);
    }, 4500);

    // Phase 4 -> Phase 5: HUD Appears & complete
    const t4 = setTimeout(() => {
      setPhase(5);
      setTimeout(onComplete, 600);
    }, 5500);

    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase < 5 && (
        <motion.div
          key="startup-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050608] text-neutral-100 overflow-hidden select-none"
        >
          {/* Skip button */}
          <button
            id="skip-startup-btn"
            onClick={onComplete}
            className="absolute top-6 right-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono-tech tracking-widest uppercase bg-neutral-900/80 hover:bg-neutral-800 text-neutral-400 hover:text-cyan-400 border border-neutral-700/60 hover:border-cyan-500/50 backdrop-blur-md transition-all cursor-pointer"
          >
            <span>Skip Intro</span>
            <FastForward className="w-3.5 h-3.5" />
          </button>

          {/* Background Ambient Grid */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,229,255,0.06)_0%,transparent_70%)] pointer-events-none" />
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
            }}
          />

          {/* Phase 1: Brand Reveal */}
          {phase >= 1 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center text-center px-4"
            >
              {/* Emblem icon */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="w-16 h-16 mb-6 rounded-2xl border border-cyan-500/30 bg-neutral-900/60 backdrop-blur-md flex items-center justify-center relative shadow-[0_0_30px_rgba(0,229,255,0.15)]"
              >
                <div className="w-8 h-8 border-2 border-cyan-400/80 rotate-45 flex items-center justify-center">
                  <div className="w-3 h-3 bg-gradient-to-tr from-cyan-400 to-amber-300" />
                </div>
              </motion.div>

              <motion.div
                initial={{ letterSpacing: '0.6em', opacity: 0 }}
                animate={{ letterSpacing: '0.4em', opacity: 1 }}
                transition={{ duration: 1.0, ease: 'easeOut' }}
                className="text-xs font-mono-tech text-cyan-400/80 uppercase mb-2 tracking-[0.4em]"
              >
                Atelier Virtualis • Capstone Exhibition
              </motion.div>

              <h1 className="text-4xl md:text-6xl font-cinzel font-black tracking-[0.25em] text-white uppercase drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
                AURA MOTORS
              </h1>

              <div className="h-[1px] w-32 bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent my-4" />

              <p className="text-xs font-mono-tech tracking-[0.3em] text-neutral-400 uppercase">
                AURA SPECTRE V12 — HYPER-GT
              </p>
            </motion.div>
          )}

          {/* Phase 2: System Telemetry Initialization */}
          {phase >= 2 && phase < 4 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-10 w-full max-w-md px-6"
            >
              <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-950/70 backdrop-blur-md shadow-2xl">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-800/80 text-[10px] font-mono-tech text-neutral-400">
                  <span className="flex items-center gap-1.5 text-cyan-400">
                    <Radio className="w-3 h-3 animate-pulse text-cyan-400" />
                    SYS_DIAGNOSTICS_STAGE_01
                  </span>
                  <span className="text-neutral-500">60 FPS • WEBGL 2.0</span>
                </div>

                <div className="space-y-1.5 min-h-[105px]">
                  {telemetryLogs.map((log, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-[11px] font-mono-tech text-neutral-300 flex items-center gap-2"
                    >
                      <span className="text-cyan-400">›</span>
                      <span>{log}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Progress bar */}
                <div className="mt-3 w-full h-1 bg-neutral-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyan-500 via-amber-400 to-cyan-400"
                    initial={{ width: '0%' }}
                    animate={{ width: `${Math.min(100, (telemetryLogs.length / 5) * 100)}%` }}
                    transition={{ ease: 'easeOut' }}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Phase 3 & 4: Lighting Activation */}
          {phase >= 4 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-8 flex items-center gap-3 px-6 py-2.5 rounded-full border border-cyan-400/40 bg-cyan-950/30 backdrop-blur-md"
            >
              <Zap className="w-4 h-4 text-cyan-400 animate-bounce" />
              <span className="text-xs font-mono-tech tracking-widest text-cyan-300 uppercase">
                SHOWROOM LIGHTING ACTIVATED • ENGAGING HUD
              </span>
            </motion.div>
          )}

          {/* Bottom status badge */}
          <div className="absolute bottom-8 flex items-center gap-6 text-[10px] font-mono-tech text-neutral-500 uppercase tracking-widest">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3 h-3 text-cyan-500" /> WebGL PBR Engine
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3 h-3 text-amber-500" /> Carbon Monocoque V4.2
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
