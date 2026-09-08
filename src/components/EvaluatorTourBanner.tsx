import React from 'react';
import { CameraPreset } from '../types';
import { Play, Pause, SkipForward, SkipBack, X, Sparkles } from 'lucide-react';
import { engineSound } from '../audio/engineSound';

export interface TourStop {
  preset: CameraPreset;
  title: string;
  subtitle: string;
  narrative: string;
}

export const EVALUATOR_TOUR_STOPS: TourStop[] = [
  {
    preset: 'cinematic',
    title: 'CINEMATIC 3/4 ATELIER HERO VIEW',
    subtitle: 'Low aerodynamic hyper-GT stance & carbon monocoque',
    narrative: 'Aura Spectre V12 combines an ultra-low center of gravity with an autoclave-cured carbon fiber monocoque weighing just 1,320 kg.',
  },
  {
    preset: 'front',
    title: 'FRONT SPLITTER & HIGH-INTENSITY LED OPTICS',
    subtitle: 'Active vortex generators & ground-effect aero',
    narrative: 'Sculpted front fenders house carbon louvers to vent high pressure from wheel arches, while the front splitter routes 420 kg of front downforce.',
  },
  {
    preset: 'cockpit',
    title: 'TEARDROP COCKPIT & FORMULA-1 YOKE',
    subtitle: 'Smoked panoramic glass & carbon-composite bucket seats',
    narrative: 'Minimalist cockpit architecture engineered for extreme G-forces, featuring cyan ambient accents, digital telemetry HUD, and an integrated steering yoke.',
  },
  {
    preset: 'engine',
    title: 'EXPOSED 6.5L TWIN-TURBO V12 HYBRID BAY',
    subtitle: '1,450 HP powertrain with titanium structural X-brace',
    narrative: 'Mid-mounted twin-turbo V12 revs to 10,500 RPM, paired with 4 high-voltage hybrid motors and titanium heat-treated exhaust manifolds.',
  },
  {
    preset: 'rear',
    title: 'QUAD TITANIUM EXHAUSTS & CARBON DIFFUSER',
    subtitle: 'Massive underbody diffuser & 6 vertical strakes',
    narrative: 'Rear fascia features a full-width curved LED taillight bar and quad center-exit titanium exhaust tips capable of plasma nitro flames.',
  },
  {
    preset: 'aero',
    title: 'ACTIVE DUAL-STAGE REAR WING & AIRBRAKE',
    subtitle: 'Computer-controlled hydraulic angle of attack',
    narrative: 'Dynamic kinematic rear wing shifts from 0° low-drag to 15° active downforce and 45° airbrake mode under high-speed deceleration.',
  },
];

interface EvaluatorTourBannerProps {
  isActive: boolean;
  currentStopIndex: number;
  isPaused: boolean;
  onNext: () => void;
  onPrev: () => void;
  onTogglePause: () => void;
  onExit: () => void;
}

export const EvaluatorTourBanner: React.FC<EvaluatorTourBannerProps> = ({
  isActive,
  currentStopIndex,
  isPaused,
  onNext,
  onPrev,
  onTogglePause,
  onExit,
}) => {
  if (!isActive) return null;

  const currentStop = EVALUATOR_TOUR_STOPS[currentStopIndex] || EVALUATOR_TOUR_STOPS[0];

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 w-[94vw] max-w-2xl animate-fade-in pointer-events-auto">
      <div className="bg-neutral-950/90 backdrop-blur-2xl border border-cyan-500/50 rounded-2xl shadow-[0_0_35px_rgba(0,229,255,0.25)] p-4 text-neutral-200">
        {/* Top bar with stop indicator and controls */}
        <div className="flex items-center justify-between pb-2 border-b border-neutral-800/80 text-xs font-mono-tech">
          <div className="flex items-center gap-2 text-cyan-400 font-bold">
            <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
            <span>EVALUATOR GUIDED TOUR</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              STOP {currentStopIndex + 1} OF {EVALUATOR_TOUR_STOPS.length}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                engineSound.playClickBeep();
                onPrev();
              }}
              className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 transition-colors cursor-pointer border border-neutral-800"
              title="Previous Camera View"
            >
              <SkipBack className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => {
                engineSound.playClickBeep();
                onTogglePause();
              }}
              className="px-2.5 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 transition-colors cursor-pointer flex items-center gap-1 text-xs"
              title={isPaused ? 'Resume Auto Tour' : 'Pause Auto Tour'}
            >
              {isPaused ? <Play className="w-3 h-3 fill-current" /> : <Pause className="w-3 h-3" />}
              <span>{isPaused ? 'RESUME' : 'PAUSE'}</span>
            </button>

            <button
              onClick={() => {
                engineSound.playClickBeep();
                onNext();
              }}
              className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 transition-colors cursor-pointer border border-neutral-800"
              title="Next Camera View"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => {
                engineSound.playClickBeep();
                onExit();
              }}
              className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer border border-neutral-800 ml-1"
              title="Exit Guided Tour (ESC)"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Narrative text block */}
        <div className="mt-2.5 space-y-1">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-rajdhani font-bold text-white tracking-wide uppercase">
              {currentStop.title}
            </h3>
            <span className="text-[10px] font-mono-tech text-amber-400 uppercase">
              {currentStop.subtitle}
            </span>
          </div>
          <p className="text-xs text-neutral-300 font-sans leading-relaxed">
            {currentStop.narrative}
          </p>
        </div>
      </div>
    </div>
  );
};
