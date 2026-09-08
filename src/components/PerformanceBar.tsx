import React, { useEffect, useState } from 'react';
import { Gauge, Zap, Flame, Activity } from 'lucide-react';
import { engineSound } from '../audio/engineSound';

interface PerformanceBarProps {
  isRevving: boolean;
}

export const PerformanceBar: React.FC<PerformanceBarProps> = ({ isRevving }) => {
  const [liveRpm, setLiveRpm] = useState(950);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveRpm(engineSound.getRpm());
    }, 60);
    return () => clearInterval(interval);
  }, []);

  const metrics = [
    {
      label: 'ACCELERATION',
      value: '2.1',
      unit: 'SEC',
      subtext: '0–100 KM/H',
      icon: <Zap className="w-3.5 h-3.5 text-cyan-400" />,
      accent: 'text-cyan-400',
    },
    {
      label: 'TOP SPEED',
      value: '425',
      unit: 'KM/H',
      subtext: 'ELECTRONIC CEILING',
      icon: <Gauge className="w-3.5 h-3.5 text-amber-400" />,
      accent: 'text-amber-400',
    },
    {
      label: 'NET OUTPUT',
      value: '1,480',
      unit: 'BHP',
      subtext: 'COMBINED HYBRID',
      icon: <Flame className="w-3.5 h-3.5 text-red-400" />,
      accent: 'text-red-400',
    },
    {
      label: 'MAX TORQUE',
      value: '1,250',
      unit: 'NM',
      subtext: 'INSTANT VECTORING',
      icon: <Activity className="w-3.5 h-3.5 text-emerald-400" />,
      accent: 'text-emerald-400',
    },
  ];

  const rpmPercent = Math.min(100, Math.max(0, ((liveRpm - 800) / (9200 - 800)) * 100));

  return (
    <div className="pointer-events-auto bg-neutral-950/80 backdrop-blur-xl border border-neutral-800/80 p-3 md:p-4 rounded-2xl shadow-2xl">
      {/* Top row: Powertrain headline & RPM live bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-neutral-800/80 gap-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-[10px] font-mono-tech uppercase tracking-[0.2em] text-neutral-400">
            POWERTRAIN ARCHITECTURE:
          </span>
          <span className="text-xs font-syne font-bold tracking-wider text-white">
            TWIN-TURBO HYBRID V12
          </span>
        </div>

        {/* Live RPM readout */}
        <div className="flex items-center gap-2 text-[11px] font-mono-tech">
          <span className="text-neutral-500">TACHOMETER:</span>
          <span className={`font-bold tabular-nums ${isRevving ? 'text-red-400' : 'text-cyan-300'}`}>
            {liveRpm.toLocaleString()} RPM
          </span>
          {/* Visual mini bar */}
          <div className="w-20 sm:w-28 h-2 bg-neutral-800 rounded-full overflow-hidden p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-75 ${
                rpmPercent > 75
                  ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]'
                  : 'bg-gradient-to-r from-cyan-400 to-amber-400'
              }`}
              style={{ width: `${rpmPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {metrics.map((metric, idx) => (
          <div
            key={idx}
            className="p-2.5 rounded-xl bg-neutral-900/50 border border-neutral-800/60 hover:border-neutral-700 transition-colors"
          >
            <div className="flex items-center justify-between text-[10px] font-mono-tech text-neutral-400 uppercase tracking-wider mb-1">
              <span>{metric.label}</span>
              {metric.icon}
            </div>

            <div className="flex items-baseline gap-1.5">
              <span className="text-xl md:text-2xl font-rajdhani font-bold text-white tracking-tight tabular-nums">
                {metric.value}
              </span>
              <span className={`text-[11px] font-mono-tech font-semibold ${metric.accent}`}>
                {metric.unit}
              </span>
            </div>

            <div className="text-[9px] font-mono-tech text-neutral-500 uppercase tracking-wider mt-0.5">
              {metric.subtext}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
